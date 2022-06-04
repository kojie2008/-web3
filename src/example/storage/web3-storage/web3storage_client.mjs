import { Web3Storage } from 'web3.storage'
import * as Name from 'web3.storage/name'
import fs from 'fs'

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMDUyQzRBRjc4OGRENDc4ODc5NDBhNGRkZERmNmI1NzkyM2ZkZjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQzNDU1NTgzMjAsIm5hbWUiOiJob25neWkifQ.r_VWwWwNnPOv4uXXrFuB6BKvypwrhwPSogQE2Aez1oA"

async function clientTest() {
    // Construct with token and endpoint
    const client = new Web3Storage({ token: API_TOKEN })

    const fileInput = document.querySelector('input[type="file"]')

    // Pack files into a CAR and send to web3.storage
    const rootCid = await client.put(fileInput.files) // Promise<CIDString>

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

async function main() {
    // await clientTest();

    // await createAndPublish();
    // await resolve();

    // await revisionUpdate();

    // await privateKeyToSign();

    await revisionSerDeser();

}

main();