import React from 'react';

const Coin = (
  props: {
    className?: string,
    onClick?: () => void
  }
) => {
  return (
    <div className='dice-wrapper'>
      <svg width="48" onClick={props.onClick ? props.onClick : () => {}} className={`dice icon-coin ${props.className}`} height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.8501 10.9C36.8834 8.56666 35.8168 7.11667 34.6501 6.55C32.6168 5.58333 30.4334 4.78333 28.1001 4.15C27.9668 4.11667 27.8334 4.08333 27.7001 4.05L27.5501 4C27.5168 4 27.4501 3.98333 27.3501 3.95C27.0501 3.88333 26.7334 3.8 26.4001 3.7C25.1668 3.5 23.9334 3.58333 22.7001 3.95C22.5001 4.01667 22.3001 4.08333 22.1001 4.15C20.4668 4.75 18.8168 5.83333 17.1501 7.4C16.0501 8.43333 15.0501 9.6 14.1501 10.9C13.5834 11.6667 13.0668 12.4833 12.6001 13.35C11.4668 15.4167 10.5501 17.7333 9.85011 20.3C8.41677 25.7 8.38344 30.65 9.75011 35.15C10.4168 37.45 11.3668 39.2833 12.6001 40.65C13.6668 41.8167 14.9168 42.6333 16.3501 43.1L16.7001 43.2C17.0334 43.2667 17.3668 43.35 17.7001 43.45L17.9001 43.5C20.4001 44.2 22.6334 44.5167 24.6001 44.45C25.6668 44.6167 27.8668 43.25 31.2001 40.35C34.6001 37.4833 37.0168 33.35 38.4501 27.95C39.9168 22.55 39.9834 17.6667 38.6501 13.3C38.3834 12.4333 38.1168 11.6333 37.8501 10.9ZM35.7501 10.9C35.9168 11.2667 36.1001 11.6667 36.3001 12.1L33.3001 11.15C33.2668 11.05 33.2334 10.9667 33.2001 10.9C32.1001 8.8 30.5001 7.36667 28.4001 6.6C29.9668 6.96667 31.7001 7.6 33.6001 8.5C34.3334 8.9 35.0501 9.7 35.7501 10.9ZM27.0501 6.25C27.1501 6.28333 27.2168 6.3 27.2501 6.3L27.4001 6.35C29.5334 7.11667 31.1668 8.63333 32.3001 10.9C32.6334 11.6 32.9334 12.3667 33.2001 13.2C33.2668 13.4 33.3168 13.5833 33.3501 13.75C33.9501 16.05 34.1668 18.4833 34.0001 21.05C33.8668 22.8167 33.5501 24.6167 33.0501 26.45C32.2501 29.45 31.0334 32.0667 29.4001 34.3C28.4668 35.6667 27.3501 36.9 26.0501 38C23.3168 40.3667 20.8501 41.45 18.6501 41.25L18.5001 41.2C18.2334 41.1333 17.9501 41.05 17.6501 40.95L17.3001 40.9C15.3001 40.2667 13.7334 38.8667 12.6001 36.7C12.1668 35.8667 11.7834 34.9167 11.4501 33.85C10.2834 29.8833 10.3334 25.5 11.6001 20.7C11.9001 19.6333 12.2334 18.6167 12.6001 17.65C13.6001 15.05 14.9168 12.8 16.5501 10.9C17.0168 10.3333 17.5168 9.8 18.0501 9.3C20.7834 6.7 23.5001 5.6 26.2001 6C26.5001 6.1 26.7834 6.18333 27.0501 6.25ZM34.9501 21.35L37.8001 22.1C37.6668 23.8333 37.3501 25.6167 36.8501 27.45C36.0168 30.5833 34.8334 33.25 33.3001 35.45L30.4001 34.65C32.0334 32.35 33.2501 29.7 34.0501 26.7C34.5501 24.8667 34.8501 23.0833 34.9501 21.35ZM37.1501 14.75C37.4834 15.85 37.7001 17.0167 37.8001 18.25L35.0001 17.5C34.8668 16.3 34.6501 15.1333 34.3501 14L37.1501 14.75ZM27.0501 38.3C27.8834 37.5667 28.6501 36.7833 29.3501 35.95L32.2501 36.75C31.7168 37.3833 31.1334 37.9667 30.5001 38.5C27.5334 41.0333 25.5834 42.2167 24.6501 42.05C23.0501 42.0167 21.3834 41.8333 19.6501 41.5C21.8501 41.7333 24.3168 40.6667 27.0501 38.3ZM24.8501 19.9L25.6501 12.9L23.0001 15.2L24.0001 17L22.1001 19.25L19.8001 19.9L24.2501 9.15L14.7001 20.15L16.1001 36.9L17.4001 26.75L19.2501 27.25L19.3001 32.35L21.7501 28.35L23.8001 28.9L19.9001 37.5L28.5001 26.95L29.0001 10.15L25.8001 22L24.8501 19.9Z" fill="black" />
        <path d="M30.4999 38.5C31.1332 37.9667 31.7165 37.3834 32.2499 36.75L29.3499 35.95C28.6499 36.7834 27.8832 37.5667 27.0499 38.3C24.3165 40.6667 21.8499 41.7334 19.6499 41.5C21.3832 41.8334 23.0499 42.0167 24.6499 42.05C25.5832 42.2167 27.5332 41.0334 30.4999 38.5ZM37.7999 22.1L34.9499 21.35C34.8499 23.0834 34.5499 24.8667 34.0499 26.7C33.2499 29.7 32.0332 32.35 30.3999 34.65L33.2999 35.45C34.8332 33.25 36.0165 30.5834 36.8499 27.45C37.3499 25.6167 37.6665 23.8334 37.7999 22.1ZM37.7999 18.25C37.6999 17.0167 37.4832 15.85 37.1499 14.75L34.3499 14C34.6499 15.1334 34.8665 16.3 34.9999 17.5L37.7999 18.25ZM27.3999 6.35004L27.2499 6.30004C27.2165 6.30004 27.1499 6.28338 27.0499 6.25004C26.7832 6.18338 26.4999 6.10004 26.1999 6.00004C23.4999 5.60004 20.7832 6.70004 18.0499 9.30004C17.5165 9.80004 17.0165 10.3334 16.5499 10.9C14.9165 12.8 13.5999 15.05 12.5999 17.65C12.2332 18.6167 11.8999 19.6334 11.5999 20.7C10.3332 25.5 10.2832 29.8834 11.4499 33.85C11.7832 34.9167 12.1665 35.8667 12.5999 36.7C13.7332 38.8667 15.2999 40.2667 17.2999 40.9L17.6499 40.95C17.9499 41.05 18.2332 41.1334 18.4999 41.2L18.6499 41.25C20.8499 41.45 23.3165 40.3667 26.0499 38C27.3499 36.9 28.4665 35.6667 29.3999 34.3C31.0332 32.0667 32.2499 29.45 33.0499 26.45C33.5499 24.6167 33.8665 22.8167 33.9999 21.05C34.1665 18.4834 33.9499 16.05 33.3499 13.75C33.3165 13.5834 33.2666 13.4 33.1999 13.2C32.9332 12.3667 32.6332 11.6 32.2999 10.9C31.1665 8.63338 29.5332 7.11671 27.3999 6.35004ZM24.8499 19.9L25.7999 22L28.9999 10.15L28.4999 26.95L19.8999 37.5L23.7999 28.9L21.7499 28.35L19.2999 32.35L19.2499 27.25L17.3999 26.75L16.0999 36.9L14.6999 20.15L24.2499 9.15004L19.7999 19.9L22.0999 19.25L23.9999 17L22.9999 15.2L25.6499 12.9L24.8499 19.9ZM35.7499 10.9C35.0499 9.70004 34.3332 8.90004 33.5999 8.50004C31.6999 7.60004 29.9665 6.96671 28.3999 6.60004C30.4999 7.36671 32.0999 8.80004 33.1999 10.9C33.2332 10.9667 33.2665 11.05 33.2999 11.15L36.2999 12.1C36.0999 11.6667 35.9165 11.2667 35.7499 10.9Z" className="to-color" />
      </svg>
    </div>
  );
};

export default Coin;
