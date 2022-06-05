import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function es6Dirname() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    console.log(__dirname);

    console.log(path.resolve(__dirname, '../', '../'));
}

async function main() {

    await es6Dirname();

}

main();