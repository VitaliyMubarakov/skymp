/* eslint-disable */
const esbuild = require('esbuild');
const path = require('path');
const args = require('node-args-parser')(process.argv);
const fs = require('fs/promises');
//var watch = require('node-watch');

const isPathExists = async (path) => !!(await fs.stat(path).catch(() => { }));

const copyFileSync = async (source, target) => {
		var targetFile = target;

		const targetExists = await isPathExists(target);
		const targetStat = await fs.lstat(target).catch(() => { });

		if (targetExists) {
				if (targetStat?.isDirectory()) {
						targetFile = path.join(target, path.basename(source));
				}
		}
		await fs.writeFile(targetFile, await fs.readFile(source));
};

const copyFolderRecursiveSync = async (source, target) => {
		// Check if folder needs to be created or integrated
		const targetExists = await isPathExists(target);
		if (!targetExists) await fs.mkdir(target);

		const sourceStat = await fs.lstat(source).catch(() => { });
		// Copy
		if (sourceStat?.isDirectory()) {
				const files = await fs.readdir(source);
				for (let i = 0; i < files.length; i++) {
						const file = files[i];
						var curSource = path.join(source, file);
						const curSourceStat = await fs.lstat(curSource).catch(() => { });
						if (curSourceStat?.isDirectory()) {
								await copyFolderRecursiveSync(curSource, target);
						} else {
								await copyFileSync(curSource, target);
						}
				}
		}
};

(async () => {
	console.log("ahaha");
		const modulePath = path.join('modules');
		const modulesInDataPath = path.join('../build/dist/server', 'data', 'modules');

		const moduleDirs = await fs.readdir(modulePath);

		const isWatch = false;

		// add conig.json files if not exists and create array of index.js/ts files to compile
		const configFiles = [];
		const dataFolders = [];
		const moduleEntryFiles = await Promise.all(
			moduleDirs.map(async (dir) => {
				const jsPath = path.join(modulePath, dir, 'index.js');
				const tsPath = path.join(modulePath, dir, 'index.ts');
				const configPath = path.join(modulePath, dir, 'config.json');
				const dataPath = path.join(modulePath, dir, 'data');

				const jsPathExists = await isPathExists(jsPath);
				const tsPathExists = await isPathExists(tsPath);
				const configPathExists = await isPathExists(configPath);
				const dataPathExists = await isPathExists(dataPath);

				if (!configPathExists) await fs.writeFile(configPath, '{}');
				configFiles.push(configPath);

				if (dataPathExists) dataFolders.push(dataPath);

				if (!jsPathExists && !tsPathExists) return;

				return jsPathExists ? jsPath : tsPath;
			})
		);

		/**
			* Copy changed config.json to module folder in server data
			* @param {any} evt
			* @param {string} pathName
			* @returns
			*/
		const reloadConfig = async (evt, pathName, silent = false) => {
				try {
						if (evt === 'remove') {
								console.log(`[watch] don't remove config files, create new one`);
								await fs.writeFile(pathName, '{}');
								console.log(`[watch] create finished`);
								return;
						}

						const moduleName = pathName.split(path.sep).slice(-2, -1)[0];
						if (!silent) console.log(`[watch] copy started (change: "${pathName.split(path.sep).slice(-3).join(path.sep)}")`);
						await fs.copyFile(pathName, path.join(modulesInDataPath, moduleName, 'config.json'));
						if (!silent) console.log(`[watch] copy finished`);
				} catch (e) {
						console.error(e);
				}
		};

		//if (isWatch) watch(modulePath, { recursive: true, filter: /\.json$/ }, reloadConfig);

		await esbuild.build({
				entryPoints: moduleEntryFiles.filter((x) => x),
				bundle: true,
				outdir: modulesInDataPath,
				logLevel: 'info',
				minify: true,
		});

		configFiles.forEach((path) => reloadConfig('', path, true));

		for (let i = 0; i < dataFolders.length; i++) {
				const pathName = dataFolders[i];
				const moduleName = pathName.split(path.sep).slice(-2, -1)[0];
				console.log(pathName, path.join(modulesInDataPath, moduleName, 'data'));
				await copyFolderRecursiveSync(pathName, path.join(modulesInDataPath, moduleName, 'data'));
		}

		if (!isWatch) process.exit();
})();
