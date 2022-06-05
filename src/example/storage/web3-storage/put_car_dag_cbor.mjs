import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Web3Storage } from 'web3.storage'
import { CarReader } from '@ipld/car'
import * as cbor from '@ipld/dag-cbor'
import { encode } from 'multiformats/block'
import { sha256 } from 'multiformats/hashes/sha2'

import { importer } from 'ipfs-unixfs-importer'
import { MemoryBlockStore } from 'ipfs-car/blockstore/memory'


// This file has a few examples of uploading structured IPLD data to Web3.Storage
// by creating a Content Archive (CAR) and using the putCar client method.
//
// See https://web3.storage/docs/how-tos/work-with-car-files/#advanced-ipld-formats
// for more information.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let API_TOKEN

async function getToken() {
    const filepath = path.resolve(__dirname, '../../../../../web3storage-token.txt');
    return await fs.promises.readFile(filepath, { encoding: 'utf8' });
}

async function main() {
    API_TOKEN = await getToken()
    // console.log(API_TOKEN)

    // await simpleCborExample()
    // await cborLinkExample()
    await cborLinkToFileExample()
}

main()

/**
 * Stores a simple "hello world" object as IPLD data, encoded using dag-cbor.
 */
async function simpleCborExample() {
    // Web3.Storage client
    const storage = new Web3Storage({ token: API_TOKEN })

    // encode the value into an IPLD block and store with Web3.Storage
    const block = await encodeCborBlock({ hello: 'world' })
    // console.log(block)
    // console.log(block.cid)
    // console.log(block.cid.toString())
    const car = await makeCar(block.cid, [block])
    // console.log(car)

    // upload to Web3.Storage using putCar
    console.log('🤖 Storing simple CBOR object...')
    const cid = await storage.putCar(car)
    console.log(`🎉 Done storing simple CBOR object. CID: ${cid}`)
    console.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}\n`)
}

/**
 * Stores a CBOR object that links to another CBOR object by CID.
 */
async function cborLinkExample() {
    // Web3.Storage client
    const storage = new Web3Storage({ token: API_TOKEN })

    // Encode a simple object to get its CID
    const addressBlock = await encodeCborBlock({ email: 'zaphod@beeblebrox.galaxy' })
    // console.log(addressBlock)
    // console.log(addressBlock.cid)
    // console.log(addressBlock.cid.toString())

    // Now we can use the CID to link to the object from another object
    const personBlock = await encodeCborBlock({
        title: 'Galactic President',
        description: 'Just this guy, you know?',
        contact: addressBlock.cid
    })
    // console.log(personBlock)
    // console.log(personBlock.cid)
    // console.log(personBlock.cid.toString())

    // pack everything into a CAR
    const car = await makeCar(personBlock.cid, [personBlock, addressBlock])
    // console.log(car)

    // upload to Web3.Storage using putCar
    console.log('🤖 Storing CBOR objects with CID links between them...')
    const cid = await storage.putCar(car)
    console.log('🎉 Stored linked data using dag-cbor. Root CID:', cid)
    console.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}`)
    console.log(`🔗 You can also traverse the link by path: ipfs dag get ${cid}/contact\n`)
}


async function cborLinkToFileExample() {
    const source = [{
        path: 'example.txt',
        content: new TextEncoder().encode('Some plain text, encoded to UTF-8')
    }]
    const { root, blocks } = await makeUnixFsFile(source)
    const cborBlock = await encodeCborBlock({
        description: 'A CBOR object that references a UnixFS file object by CID',
        file: root.cid
    })

    blocks.push(cborBlock)
    const car = await makeCar(cborBlock.cid, blocks)

    // Web3.Storage client
    const storage = new Web3Storage({ token: API_TOKEN })

    console.log('🤖 Storing a CBOR object that links to a UnixFS file by CID...')
    const cid = await storage.putCar(car)
    console.log('🎉 Stored dag-cbor object that links to a unixfs file. Root CID: ', cid)
    console.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}`)
    console.log(`💾 You can view the linked file with ipfs: ipfs cat ${cid}/file`)
    console.log('🔗 View linked file via IPFS gateway: ', `https://${cid}.ipfs.dweb.link/file`)
}

async function makeUnixFsFile(source) {
    const blockstore = new MemoryBlockStore()
    // taken from https://github.com/web3-storage/ipfs-car/blob/main/src/pack/constants.ts
    // but with wrapWithDirectory overriden to false
    const unixFsOptions = {
        cidVersion: 1,
        chunker: 'fixed',
        maxChunkSize: 262144,
        hasher: sha256,
        rawLeaves: true,
        wrapWithDirectory: false,
        maxChildrenPerNode: 174
    }
    const importStream = await importer(source, blockstore, unixFsOptions)
    let root = null
    for await (const entry of importStream) {
        root = entry
    }
    const blocks = []
    for await (const block of blockstore.blocks()) {
        blocks.push(block)
    }
    await blockstore.close()
    return { root, blocks }
}


/**
 * Encodes an object into an IPLD block using the dag-cbor codec.
 * @param {any} value - any JS value that can be converted to CBOR (if it can be JSON.stringified, it will work)
 * @returns {Block} a block of encoded IPLD data.
 */
async function encodeCborBlock(value) {
    return await encode({ value, codec: cbor, hasher: sha256 })
}

/**
 * Takes a root CID and an iterable of encoded IPLD blocks, and returns a CarReader that
 * can be used with Web3.Storage.putCar
 * @param {string} rootCID the CID of the root block of the IPLD graph
 * @param {Iterable<Block>} ipldBlocks a collection of encoded IPLD blocks
 * @returns {CarReader} a CarReader for sending the CAR data to Web3.Storage
 */
async function makeCar(rootCID, ipldBlocks) {

    return new CarReader({ version: 1, roots: [rootCID] }, ipldBlocks)
}

