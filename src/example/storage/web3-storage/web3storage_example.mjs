import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Name from 'web3.storage/name';
import { Web3Storage, getFilesFromPath, File } from 'web3.storage';
import { CarReader } from '@ipld/car';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// console.log(__dirname);

let API_TOKEN

async function clientPutFile() {
    // Construct with token and endpoint
    const client = new Web3Storage({ token: API_TOKEN })

    const pathFiles = await getFilesFromPath(path.resolve(__dirname, '../ipfs/docs/a.txt'))

    // Pack files into a CAR and send to web3.storage
    const rootCid = await client.put(pathFiles) // Promise<CIDString>

    // Get info on the Filecoin deals that the CID is stored in
    const info = await client.status(rootCid) // Promise<Status | undefined>

    // Fetch and verify files from web3.storage
    const res = await client.get(rootCid) // Promise<Web3Response | null>
    const files = await res.files() // Promise<Web3File[]>
    for (const file of files) {
        console.log(`${file.cid} ${file.name} ${file.size}`)
    }
}


async function createAndPublish() {
    const client = new Web3Storage({ token: API_TOKEN })

    const name = await Name.create()
    console.log('Name:', name.toString())
    // e.g. k51qzi5uqu5di29bs8ib0cm3rkhtxdfedhucifdg7ehst4ht963homdvcxw0dx

    // The value to publish
    const value = '/ipfs/bafybeiaq7n2itukqvvpyo2wzrpcjvizdxxzbi3cwgrw4wocwbjp52nfxra'
    const revision = await Name.v0(name, value)
    // console.log('revision:', revision)

    await Name.publish(client, revision, name.key)
}


async function resolve() {
    const client = new Web3Storage({ token: API_TOKEN })

    const name = Name.parse('k51qzi5uqu5di29bs8ib0cm3rkhtxdfedhucifdg7ehst4ht963homdvcxw0dx')
    const revision = await Name.resolve(client, name)

    console.log('Resolved value:', revision.value)
    // e.g. /ipfs/bafybeiaq7n2itukqvvpyo2wzrpcjvizdxxzbi3cwgrw4wocwbjp52nfxra
}

async function revisionUpdate() {
    const client = new Web3Storage({ token: API_TOKEN })

    const name = await Name.create()
    console.log('Name:', name.toString())

    const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    const revision = await Name.v0(name, value)

    await Name.publish(client, revision, name.key)

    // ...later

    const nextValue = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    // Make a revision to the current record (increments sequence number and sets value)
    const nextRevision = await Name.increment(revision, nextValue)

    await Name.publish(client, nextRevision, name.key)
}


async function privateKeyToSign() {

    // Creates a new "writable" name with a new signing key
    const name = await Name.create()
    console.log('Name:', name.toString())

    // Store the signing key to a file for use later
    await fs.promises.writeFile('priv.key', name.key.bytes)

    // ...later

    const bytes = await fs.promises.readFile('priv.key')

    const name1 = await Name.from(bytes)
    console.log('Name:', name1.toString())
    // e.g. k51qzi5uqu5divyse00teyorxgqvc730kawmq0xr0fjwvmncigli6baxubyrzv
}


async function revisionSerDeser() {
    const { Revision } = Name
    const name = await Name.create()
    console.log('Name:', name.toString())

    const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    const revision = await Name.v0(name, value)
    console.log('revision:', revision)

    // Store the record to a file for use later
    // Note: Revision.encode does NOT encode signing key data
    await fs.promises.writeFile('ipns.revision', Revision.encode(revision))

    // ...later

    const bytes = await fs.promises.readFile('ipns.revision')
    const revision1 = Revision.decode(bytes)
    console.log('revision:', revision1)
}

async function getToken() {
    const filepath = path.resolve(__dirname, '../../../../../web3storage-token.txt');
    return await fs.promises.readFile(filepath, { encoding: 'utf8' });
}


function makeFileObjects() {
    // You can create File objects from a Buffer of binary data
    // see: https://nodejs.org/api/buffer.html
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const buffer = Buffer.from(JSON.stringify({ hello: 'xueweb3 together' }))

    const files = [
        new File(['contents-of-file-1'], 'plain-utf8.txt'),
        new File([buffer], 'hello.json')
    ]
    return files
}

async function putStreamFromFs() {

    const client = new Web3Storage({ token: API_TOKEN })

    const stream = fs.createReadStream('../ipfs/docs/b.txt')
    const cid = await client.put([{ name: 'b.txt', stream: () => stream }])

    console.log('Content added with CID:', cid)
}

async function retrieve(cid) {
    const client = new Web3Storage({ token: API_TOKEN })

    const res = await client.get(cid)
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
        throw new Error(`failed to get ${cid}`)
    }
    // request succeeded! do something with the response object here...

    // unpack File objects from the response
    const files = await res.files()
    for (const file of files) {
        console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
    }
}


async function checkStatus(cid) {
    const client = new Web3Storage({ token: API_TOKEN })
    const status = await client.status(cid)
    console.log(status)
    if (status) {
        // your code to do something fun with the status info here
    }
}

async function listUploads() {
    const client = new Web3Storage({ token: API_TOKEN })
    for await (const upload of client.list()) {
        console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`)
    }
}


async function listWithLimits() {
    const client = new Web3Storage({ token: API_TOKEN })

    // get today's date and subtract 1 day
    const d = new Date()
    d.setDate(d.getDate() + 1)

    // the list method's before parameter accepts an ISO formatted string
    const before = d.toISOString()
    console.log(before)

    // limit to ten results
    const maxResults = 10

    for await (const upload of client.list({ before, maxResults })) {
        console.log(upload)
    }
}

async function storeCarFile() {
    const stream = fs.createReadStream('../ipfs/docs/c.car')

    const car = await CarReader.fromIterable(stream);
    // console.log(car)

    const client = new Web3Storage({ token: API_TOKEN })
    const cid = await client.putCar(car);
    console.log('Stored CAR file! CID:', cid);
}


async function main() {

    API_TOKEN = await getToken()
    // console.log(API_TOKEN);

    // await clientPutFile();

    // await createAndPublish();
    // await resolve();

    // await revisionUpdate();

    // await privateKeyToSign();

    // await revisionSerDeser();

    // await putStreamFromFs();

    const cid = 'bafybeiafu3y3s6ip3c45zbbd46b6il6jy4k6p5kpvtvkkhuuw5qped7r24'
    // await retrieve(cid);
    // await checkStatus(cid);

    // await listUploads();
    // await listWithLimits();

    await storeCarFile();
}

main();