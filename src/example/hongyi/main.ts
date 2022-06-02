import { Keypair } from '@solana/web3.js';
import {getPayer, getRpcUrl, createKeypairFromFile} from '../../helper/utils';

async function main() {
  console.log("Let's say hello to a Solana account...");

  let payer: Keypair = await getPayer();
  console.log('{}', payer.publicKey);

  console.log('Success');
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
