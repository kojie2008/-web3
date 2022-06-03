import { Connection, Keypair, Transaction, SystemProgram, PublicKey, TransactionInstruction } from "@solana/web3.js";
import path from 'path';
import { API_ENDPOINT, API_ENDPOINT_DEVNET } from "../../../helper/const";
import { getPayer, getProgramIdAndSoPath, createKeypairFromFile } from '../../../helper/utils';


(async () => {
  // connection
  const connection = new Connection(API_ENDPOINT);

  // 使用deploy成功之后，返回的Program Id
  const programIdAndSo = await getProgramIdAndSoPath(path.resolve(__dirname, '../program'));
  console.log(`programId: ${programIdAndSo.progranId}`);


  const feePayer = await getPayer();
  console.log(`feePayer: ${feePayer.publicKey}`);

  // instruction is composed by
  // - program id
  // - account meta list
  // - data

  // in our first program, we don't parse any accounts and data. leave them emtpy here
  // we will make some changes later
  let ins = new TransactionInstruction({
    programId: programIdAndSo.progranId,
    keys: [],
    data: Buffer.from([]),
  });

  let tx = new Transaction().add(ins);

  let txhash = await connection.sendTransaction(tx, [feePayer]);
  console.log(`txhash: ${txhash}`);
})();
