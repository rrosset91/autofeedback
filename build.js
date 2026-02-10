#!/usr/bin/env node

import { spawn } from 'child_process';

const vite = spawn('npx', ['vite', 'build', '--logLevel', 'info'], {
	stdio: 'inherit',
	shell: true
});

vite.on('error', (error) => {
	console.error('Build process error:', error);
	process.exit(1);
});

vite.on('exit', (code) => {
	if (code !== 0) {
		console.error(`Build failed with exit code ${code}`);
		process.exit(code);
	}
	process.exit(0);
});
