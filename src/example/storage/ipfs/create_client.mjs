import { create, globSource, urlSource } from 'ipfs-http-client'

(async () => {

  console.log("HI, IPFS.....");

  // await addString();
  // await addFromGlob();
  // await addFromUrl();

})();

async function addFromUrl() {
  const client = create('http://127.0.0.1:5002');

  const file = await client.add(urlSource('https://img.alicdn.com/tfs/TB1R5fsgyDsXe8jSZR0XXXK6FXa-281-80.jpg'))
  console.log(file)

  /*
  {
    path: 'TB1R5fsgyDsXe8jSZR0XXXK6FXa-281-80.jpg',
    cid: CID(Qme83DoW5ygGb1qnCtjXemscgW8JKrNXVboVYaWdBc3sMD),
    size: 23645,
    mode: 420
  }
  */
}


async function addFromGlob() {

  const client = create('http://127.0.0.1:5002');

  for await (const file of client.addAll(globSource('./docs', '**/*'))) {
    console.log(file)
  }
  /*
  {
    path: 'a.txt',
    cid: CID(QmPrReMrZHGviDH1hxsvCNr5jpvgddjGVSA4WvNiT2o9wp),
    size: 25,
    mode: 420
  }
  {
    path: 'b.txt',
    cid: CID(QmTJK4ehTdD5zZtQCCwxUuEP1UrwpfCJPwa5WDJnXALiTb),
    size: 25,
    mode: 420
  }
  ...
  */

}

async function addString() {

  // 1. connect to the default API address http://localhost:5001
  // const client = create();

  // 2. connect to a different ipfs daemon API server
  // const client = create('http://127.0.0.1:5002');

  // 3. connect using a URL
  // Command: jsipfs config Addresses.API
  // Command: jsipfs config show
  const client = create(new URL('http://127.0.0.1:5002'));

  // 4. or connect with multiaddr
  // const client = create('/ip4/127.0.0.1/tcp/5002');

  // 5. or using options
  // const client = create({ host: '127.0.0.1', port: '5002', protocol: 'http' })

  // 6. or specifying a specific API path
  // const client = create({ host: '1.1.1.1', port: '80', apiPath: '/ipfs/api/v0' })

  // call Core API methods
  const { cid } = await client.add('Hello world!'); // QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY
  console.log(`${cid}`);

}