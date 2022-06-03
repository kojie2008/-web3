import { Connection, Keypair, Transaction, SystemProgram, PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as bs58 from "bs58";
import { API_ENDPOINT, API_ENDPOINT_DEVNET } from "../../../helper/const";
import { getPayer, getRpcUrl, createKeypairFromFile } from '../../../helper/utils';

// connection
const connection = new Connection(API_ENDPOINT);

// 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
// const feePayer = Keypair.fromSecretKey(
//   bs58.decode("588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2")
// );

(async () => {
  const feePayer = await getPayer();
  console.log(`feePayer: ${feePayer.publicKey}`);

  // 使用deploy成功之后，返回的Program Id
  let programId = new PublicKey("GtisVwWRb7TcUeVk3t1SaS5isyFXZ71miwsZFc5TfZEn");

  // instruction is composed by
  // - program id
  // - account meta list
  // - data

  // in our first program, we don't parse any accounts and data. leave them emtpy here
  // we will make some changes later
  let ins = new TransactionInstruction({
    programId: programId,
    keys: [],
    data: Buffer.from([]),
  });

  let tx = new Transaction().add(ins);

  let txhash = await connection.sendTransaction(tx, [feePayer]);
  console.log(`txhash: ${txhash}`);
})();
