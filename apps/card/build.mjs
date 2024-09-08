#!/usr/bin/env node

import { writeFileSync } from 'fs';

import { context, build } from 'esbuild';
import { replaceTscAliasPaths } from 'tsc-alias';

const buildOptions = {
  entryPoints: ['./src/**/*'],
  globalName: 'module',
  logLevel: 'debug',
  metafile: true,
  platform: 'node',
  sourcemap: 'linked',
  sourcesContent: false,
  tsconfig: './tsconfig.build.json',
  format: 'esm',
  outdir: './dist',
  packages: 'external',
};

for (const arg of process.argv) {
  switch (arg) {
    case '-w':
    case '--watch':
      {
        const ctx = await context(buildOptions);
        replaceTscAliasPaths({resolveFullPaths: true, watch: true});
        await ctx.watch();
      }
      break;
    default:
      {
        const res = await build(buildOptions);
        replaceTscAliasPaths({resolveFullPaths: true});
        writeFileSync('./dist/meta.json', JSON.stringify(res.metafile));
      }
      break;
  }
}

