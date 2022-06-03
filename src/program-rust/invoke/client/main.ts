import { Connection, Keypair, Transaction, SystemProgram, PublicKey, TransactionInstruction } from "@solana/web3.js";
import path from 'path';
import { API_ENDPOINT, API_ENDPOINT_DEVNET } from "../../../helper/const";
import { getPayer, getPayerByFileName, getProgramIdAndSoPath, createKeypairFromFile } from '../../../helper/utils';


(async () => {
  // connection
  const connection = new Connection(API_ENDPOINT);

  // 使用deploy成功之后，返回的Program Id
  const programIdAndSo = await getProgramIdAndSoPath(path.resolve(__dirname, '../program'));
  console.log(`programId: ${programIdAndSo.progranId}`);

  const feePayer = await getPayer();
  console.log(`feePayer: ${feePayer.publicKey}`);

  const alice = await getPayerByFileName('devnet.json');
  console.log(`alice: ${alice.publicKey}`);

  // `invoke` allows us to call another program in our program

  // we need to pack all needed accounts and program in the same instruction so that we can composed them in our prgoram

  // here we try to use invoke in our program
  {
    console.log(`SystemProgram.programId: ${SystemProgram.programId}`);

    let ins = new TransactionInstruction({
      programId: programIdAndSo.progranId,
      keys: [
        {
          pubkey: feePayer.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: alice.publicKey,
          isSigner: true,
          isWritable: true,
        },
        // remember you also need to pack the invoke instruciton's program here
        // we want to call system program's transfer in our program
        // so we need to pack system program into instruction
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      // we pack `amount` into data. [1, 0, 0, 0, 0, 0, 0, 0] is a little endian u64 which value is 1
      data: Buffer.from([1, 0, 0, 0, 0, 0, 0, 0]),
    });

    let tx = new Transaction().add(ins);

    let txhash = await connection.sendTransaction(tx, [feePayer, alice]);
    console.log(`txhash: ${txhash}`);
  }
})();
