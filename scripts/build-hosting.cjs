'use strict';

const {execFileSync} = require('node:child_process');
const {cpSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, realpathSync, renameSync, rmSync} = require('node:fs');
const {dirname, extname, join, resolve} = require('node:path');

const root = realpathSync(resolve(__dirname, '..'));
const temporary = mkdtempSync(join(root, '.hosting-build-'));
const output = join(root, 'dist');
const staged = join(temporary, 'dist');
const crimsonSource = join(temporary, 'crimson');

function copyFile(source, destination) {
  if (!lstatSync(source).isFile()) throw new Error('Expected a non-symlink file at ' + source);
  mkdirSync(dirname(destination), {recursive: true});
  cpSync(source, destination, {errorOnExist: true, force: false});
}

function copyAssets(source, destination, extensions) {
  for (const entry of readdirSync(source, {withFileTypes: true})) {
    if (entry.name.startsWith('.')) continue;
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) copyAssets(from, to, extensions);
    else if (extensions.has(extname(entry.name))) copyFile(from, to);
  }
}

try {
  const crimson = join(root, 'crimson');
  mkdirSync(crimsonSource);
  for (const path of ['build.cjs', 'admin.html', 'firebase-setup.html', 'guide.html', 'position-guide.html']) {
    copyFile(join(crimson, path), join(crimsonSource, path));
  }
  const playAssets = new Set(['.js']);
  copyAssets(join(crimson, 'content'), join(crimsonSource, 'content'), playAssets);
  copyAssets(join(crimson, 'lessons'), join(crimsonSource, 'lessons'), new Set(['.cjs']));
  mkdirSync(join(crimsonSource, 'assets'));
  execFileSync(process.execPath, [join(crimsonSource, 'build.cjs')], {stdio: 'inherit'});

  for (const path of [
    'index.html', 'individuals.html', 'business.html', 'certifications.html', 'privacy.html',
    'app.js', 'navigation.js', 'account-navigation.js', 'styles.css', 'assets/logo.jpg',
    'admin/index.html', 'admin/instructor-guide.html', 'admin/admin.css', 'admin/admin.js',
    'admin/deployment.js', 'admin/firebase.js', 'admin/firebase-config.js'
  ]) {
    copyFile(join(root, path), join(staged, path));
  }

  const crimsonOutput = join(staged, 'crimson');
  copyFile(join(crimsonSource, 'index.html'), join(crimsonOutput, 'index.html'));
  for (const entry of readdirSync(crimsonSource, {withFileTypes: true})) {
    if (!entry.isDirectory() || ['assets', 'content', 'lessons'].includes(entry.name)) continue;
    const page = join(entry.name, 'index.html');
    copyFile(join(crimsonSource, page), join(crimsonOutput, page));
  }
  const crimsonAssets = new Set(['.js', '.css', '.jpg', '.jpeg', '.png', '.webp', '.svg']);
  const runtimeAssets = join(crimsonOutput, 'assets');
  copyAssets(join(crimson, 'assets'), runtimeAssets, crimsonAssets);
  copyFile(join(crimson, 'assets', 'drill-timer.html'), join(runtimeAssets, 'drill-timer.html'));
  cpSync(join(crimsonSource, 'assets', 'catalog.js'), join(runtimeAssets, 'catalog.js'));
  copyAssets(join(crimsonSource, 'content'), join(crimsonOutput, 'content'), playAssets);

  // The setup guide offers this file as a download. Hosting does not deploy these database rules.
  copyFile(join(crimson, 'firestore.rules'), join(crimsonOutput, 'firestore.rules'));
  copyFile(join(crimson, 'WhitakerTest', 'index.html'), join(crimsonOutput, 'WhitakerTest', 'index.html'));
  copyAssets(join(crimson, 'WhitakerTest', 'assets'), join(crimsonOutput, 'WhitakerTest', 'assets'), new Set(['.webm']));

  if (dirname(output) !== root || lstatSync(output, {throwIfNoEntry: false})?.isSymbolicLink()) {
    throw new Error('The Hosting output must be a local dist directory.');
  }
  rmSync(output, {recursive: true, force: true});
  renameSync(staged, output);
  console.log('Firebase Hosting artifact built in dist.');
} finally {
  if (dirname(temporary) === root) rmSync(temporary, {recursive: true, force: true});
}
