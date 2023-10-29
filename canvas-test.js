#!/usr/bin/env node

import { readFile, readdir as readDir, } from 'fs/promises';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join as pathJoin } from 'path';
import mime from 'mime';


const basePath = process.cwd();
const DEFAULT_PORT = 8000;
const DEFAULT_TEST_CASE_DIR = 'test-cases';

const [,, ...args] = process.argv;
const config = configFromArgs(args);


createServer(async (req, res) => {
    console.log(`Serving ${req.url}`);

    if (req.url === '/test-cases') {
        await serveTestCases(req, res);
    } else {
        await serveData(req, res);
    }
}).listen(config.port);

console.log(`Reading test cases from ${config.testCaseDir}`);
console.log(`Listening on port ${config.port}. canvas-test UI running at http://localhost:${config.port}/node_modules/@blparker/canvas-test/dist/index.html`);


async function serveTestCases(req, res) {
    try {
        const files = await readDir(config.testCaseDir);

        let fileContents = '';
        for (const file of files) {
            const contents = await readFile(pathJoin(config.testCaseDir, file));
            fileContents += contents;
        }

        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(fileContents)
    } catch (e) {
        console.error(e);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('An error occurred reading the test files directory.');
    }
}


async function serveData(req, res) {
    try {
        const filePath = pathJoin(basePath, req.url);
        console.log(`Serving ${filePath}`);

        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': mime.getType(req.url) });
        res.end(data);
    } catch (e) {
        console.error(e);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404: File not found');
    }
}


function configFromArgs(args) {
    if (args.length % 2 !== 0) {
        throw new Error('Arguments appear malformed');
    }

    const config = {};

    for (let i = 0; i < args.length; i += 2) {
        if (! args[i].startsWith('--')) {
            throw new Error(`Malformed argument ${args[i]}`);
        }

        config[args[i].substring(2)] = args[i + 1];
    }

    return {
        port: config.port || DEFAULT_PORT,
        testCaseDir: pathJoin(process.cwd(), config.testCaseDir || DEFAULT_TEST_CASE_DIR),
    }
}
