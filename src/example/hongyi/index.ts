import { Keypair } from '@solana/web3.js';
import { Buffer } from 'buffer';
import fs from 'mz/fs';
import path from 'path';
import { getPayer, getPayerByFileName, getTomlConfig, getCargoTomlBpfName } from '../../helper/utils';


async function keypair() {
  console.log("Let's say hello to a Solana account...");

  let payer: Keypair = await getPayer();
  console.log('{}', payer.publicKey);

  console.log('Success');
}

async function bufferTest() {
  const buf = Buffer.alloc(256);
  const len = buf.write('\u00bd + \u00bc = \u00be', 0);
  console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
  // Prints: 12 bytes: ½ + ¼ = ¾

  const buffer = Buffer.alloc(10);
  const length = buffer.write('abcd', 8);
  console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
  // Prints: 2 bytes: ab
}

async function utilTest() {
  // let payer: Keypair = await getPayerByFileName('devnet.json');
  // console.log('SIGNATURE', payer.publicKey.toBase58());

  const filepath = path.resolve(__dirname, '../../program-rust/helloworld/program');
  console.log(filepath);
  const filepath1 = path.resolve(filepath, 'Cargo.toml');
  console.log(filepath1);

  const bpfName = await getCargoTomlBpfName(filepath1);
  const PROGRAM_SO_PATH = path.join(filepath, `${bpfName}.so`);
  console.log(PROGRAM_SO_PATH);
}


async function main() {
  // await keypair();
  // await bufferTest();

  await utilTest();
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
