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

  // data is the most powerful part in an instruciton
  // we can pack everything into data, like number, pubkey ... whatever you want.

  // when we pack something into data, it should be a byte array
  // and a program will receive the same byte array as well.
  // how to serialize/deserialize is up to you. there are many different ways to make it.

  // here I use data to make a function selector, we will make a more complex example later.

  // our program will take the frist byte as a function selector
  // then print remains

  {
    let ins = new TransactionInstruction({
      programId: programIdAndSo.progranId,
      keys: [],
      data: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8]),
    });

    let tx = new Transaction().add(ins);

    let txhash = await connection.sendTransaction(tx, [feePayer]);
    console.log(`called first instruction txhash: ${txhash}`);
  }

  {
    let ins = new TransactionInstruction({
      programId: programIdAndSo.progranId,
      keys: [],
      data: Buffer.from([1, 8, 7, 6, 5, 4, 3, 2, 1]),
    });

    let tx = new Transaction().add(ins);

    let txhash = await connection.sendTransaction(tx, [feePayer]);
    console.log(`called second instruction txhash: ${txhash}`);
  }
})();
