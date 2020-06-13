#include "Networking.h"
#include "IdManager.h"
#include "RakNet.h"
#include <memory>
#include <sstream>

namespace {
class PacketGuard
{
public:
  PacketGuard(RakPeerInterface* peer_, Packet* packet_)
    : peer(peer_)
    , packet(packet_)
  {
  }

  ~PacketGuard() { peer->DeallocatePacket(packet); }

private:
  RakPeerInterface* const peer;
  Packet* const packet;
};

const char* GetError(unsigned char packetType)
{
  switch (packetType) {
    case ID_ALREADY_CONNECTED:
      return "Already connected";
    case ID_CONNECTION_BANNED:
      return "Banned";
    case ID_INVALID_PASSWORD:
      return "Invalid password";
    case ID_INCOMPATIBLE_PROTOCOL_VERSION:
      return "Incompatible protocol version";
    case ID_IP_RECENTLY_CONNECTED:
      return "IP recently connected";
    case ID_NO_FREE_INCOMING_CONNECTIONS:
      return "No free incoming connections";
    default:
      return "";
  }
}

class Client : public Networking::IClient
{
public:
  Client(const char* ip_, unsigned short port_, int timeoutMs_)
    : ip(ip_)
    , port(port_)
  {

    peer.reset(new RakPeer);
    socket.reset(new SocketDescriptor(0, nullptr));
    const auto res = peer->Startup(1, &*socket, 1);
    if (res != StartupResult::CRABNET_STARTED) {
      throw std::runtime_error("Peer startup failed with code " +
                               std::to_string((int)res));
    }
    const auto conRes = peer->Connect(ip.data(), port, "", 0);
    if (conRes != ConnectionAttemptResult::CONNECTION_ATTEMPT_STARTED) {
      throw std::runtime_error("Peer connect failed with code " +
                               std::to_string((int)conRes));
    }
    peer->SetTimeoutTime(timeoutMs_, {});
  }

  ~Client() override
  {
    packetGuard.reset(); // Depends on peer, so must be reset first
    peer->Shutdown(0);
  }

  void Send(Networking::PacketData data, size_t length, bool reliable) override
  {
    peer->Send(reinterpret_cast<const char*>(data), length, MEDIUM_PRIORITY,
               reliable ? RELIABLE : UNRELIABLE, 0, serverGuid, false);
  }

  void Tick(OnPacket onPacket, void* state) override
  {
    std::weak_ptr weakPeer = peer;
    while (1) {
      Packet* packet = nullptr;
      if (auto p = weakPeer.lock()) {
        packet = p->Receive();
        packetGuard.reset(new PacketGuard(&*p, packet));
      }
      if (!packet)
        break;

      if (packet->data[0] == ID_CONNECTION_REQUEST_ACCEPTED) {
        serverGuid = packet->guid;
        isConnected = true;
      }

      if (packet->data[0] == ID_CONNECTION_LOST ||
          packet->data[0] == ID_DISCONNECTION_NOTIFICATION)
        isConnected = false;

      HandlePacketClientside(onPacket, state, packet);
    }
  }

  bool IsConnected() const override { return isConnected; }

private:
  const std::string ip;
  const unsigned short port;

  RakNetGUID serverGuid = UNASSIGNED_CRABNET_GUID;
  std::shared_ptr<RakPeerInterface> peer;
  std::unique_ptr<SocketDescriptor> socket;
  std::unique_ptr<PacketGuard> packetGuard;
  bool isConnected = false;
};

class Server : public Networking::IServer
{
public:
  constexpr static int timeoutTimeMs = 6000;

  Server(unsigned short port_, unsigned short maxConnections)
  {
    idManager.reset(new IdManager(maxConnections));
    peer.reset(new RakPeer);
    socket.reset(new SocketDescriptor(port_, nullptr));

    const auto res = peer->Startup(maxConnections, &*socket, 1);
    if (res != StartupResult::CRABNET_STARTED) {
      throw std::runtime_error("Peer startup failed with code " +
                               std::to_string((int)res));
    }
    peer->SetMaximumIncomingConnections(maxConnections);
    peer->SetTimeoutTime(timeoutTimeMs, {});
  }

  void Send(Networking::UserId id, Networking::PacketData data, size_t length,
            bool reliable) override
  {
    const auto guid = idManager->find(id);
    if (guid == RakNetGUID(-1))
      throw std::runtime_error("User with id " + std::to_string(id) +
                               " doesn't exist");

    peer->Send(reinterpret_cast<const char*>(data), length, MEDIUM_PRIORITY,
               reliable ? RELIABLE_ORDERED : UNRELIABLE, 0, guid, false);
  }

  void Tick(OnPacket onPacket, void* state) override
  {
    while (1) {
      auto packet = peer->Receive();
      if (!packet)
        break;
      PacketGuard guard(peer.get(), packet);
      Networking::HandlePacketServerside(onPacket, state, packet,
                                         *this->idManager);
    }
  }

private:
  std::unique_ptr<RakPeerInterface> peer;
  std::unique_ptr<SocketDescriptor> socket;
  std::unique_ptr<IdManager> idManager;
};
}

std::shared_ptr<Networking::IClient> Networking::CreateClient(
  const char* serverIp, unsigned short serverPort, int timeoutMs)
{
  return std::make_shared<Client>(serverIp, serverPort, timeoutMs);
}

std::shared_ptr<Networking::IServer> Networking::CreateServer(
  unsigned short port, unsigned short maxConnections)
{
  return std::make_shared<Server>(port, maxConnections);
}

void Networking::HandlePacketClientside(Networking::IClient::OnPacket onPacket,
                                        void* state, Packet* packet)
{
  const auto packetId = packet->data[0];
  if (packetId >= Networking::MinPacketId) {
    onPacket(state, Networking::PacketType::Message, packet->data,
             packet->length, "");
  } else if (packetId == ID_CONNECTION_LOST ||
             packetId == ID_DISCONNECTION_NOTIFICATION) {
    onPacket(state, Networking::PacketType::ClientSideDisconnect, nullptr, 0,
             "");
  } else if (packetId == ID_CONNECTION_ATTEMPT_FAILED) {
    onPacket(state, Networking::PacketType::ClientSideConnectionFailed,
             nullptr, 0, "");
  } else if (packetId == ID_CONNECTION_REQUEST_ACCEPTED) {
    onPacket(state, Networking::PacketType::ClientSideConnectionAccepted,
             nullptr, 0, "");
  } else if (auto err = GetError(packetId); err && err[0]) {
    onPacket(state, Networking::PacketType::ClientSideConnectionDenied,
             nullptr, 0, err);
  }
}

void Networking::HandlePacketServerside(Networking::IServer::OnPacket onPacket,
                                        void* state, Packet* packet,
                                        IdManager& idManager)
{
  const auto packetId = packet->data[0];
  Networking::UserId userId;
  switch (packetId) {
    case ID_DISCONNECTION_NOTIFICATION:
    case ID_CONNECTION_LOST:
      userId = idManager.find(packet->guid);
      if (userId == Networking::InvalidUserId)
        throw std::runtime_error(
          (std::stringstream()
           << "Unexpected disconnection for system without userId (guid="
           << packet->guid.g << ")")
            .str());
      idManager.freeId(userId);
      onPacket(state, userId, Networking::PacketType::ServerSideUserDisconnect,
               nullptr, 0);
      break;
    case ID_NEW_INCOMING_CONNECTION:
      userId = idManager.allocateId(packet->guid);
      if (userId == Networking::InvalidUserId) {
        throw std::runtime_error("idManager is full");
      }
      onPacket(state, userId, Networking::PacketType::ServerSideUserConnect,
               nullptr, 0);
      break;
    default:
      userId = idManager.find(packet->guid);
      if (packetId >= Networking::MinPacketId) {
        onPacket(state, userId, Networking::PacketType::Message, packet->data,
                 packet->length);
      }
      break;
  }
}