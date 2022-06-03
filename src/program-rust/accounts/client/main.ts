import { Connection, Keypair, Transaction, SystemProgram, PublicKey, TransactionInstruction } from "@solana/web3.js";
import path from 'path';
import { API_ENDPOINT, API_ENDPOINT_DEVNET } from "../../../helper/const";
import { getPayer, getProgramIdAndSoPath, createKeypairFromFile, getCargoTomlBpfName } from '../../../helper/utils';


(async () => {
  // connection
  const connection = new Connection(API_ENDPOINT);

  /*
  首先，build bpf合约包，命令：cargo build-bpf --bpf-out-dir=dist
  其次，检查solana config参数中的RPC URL地址，
  RPC URL地址可以提前设置，命令：solana config set --url http://localhost:8899
  再次，deploy合约包，命令：solana program deploy dist/accounts.so
  合约包默认会部署到solana config get 返回的RPC URL地址
  或者部署到指定的公链地址，命令：solana program --url http://localhost:8899 deploy dist/accounts.so
  最后，部署成功之后，会返回Program Id，客户端就是通过该Program Id请求合约的
  */
  const programIdAndSo = await getProgramIdAndSoPath(path.resolve(__dirname, '../program'));
  console.log(`programId: ${programIdAndSo.progranId}`);

  // 支付gas账户要有SOL，如果没有SOL支付gas，则需要提前获取空投SOL，可以通过命令查看账户SOL余额：solana balance 8xJMUWYepTWvwALH7zDfwgxAEiAFQdBdusRagW5HYzB9
  // 可以通过命令获取空投SOL：solana airdrop 8xJMUWYepTWvwALH7zDfwgxAEiAFQdBdusRagW5HYzB9
  const feePayer = await getPayer();
  console.log(`feePayer: ${feePayer.publicKey}`);

  // an account meta list is an array and program will receive a same order account info list when loaded.

  // an account meta including
  // - isSigner
  // - isWritable

  // if you assign some account is a signer, the account need to sign the tx
  // if your account's data will be modified after this tx, you should assign this account is writable

  let firstAccount = Keypair.generate();
  console.log(`first account: ${firstAccount.publicKey.toBase58()}`);

  let secondAccount = Keypair.generate();
  console.log(`second account: ${secondAccount.publicKey.toBase58()}`);

  let ins = new TransactionInstruction({
    programId: programIdAndSo.progranId,
    keys: [
      {
        pubkey: firstAccount.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: secondAccount.publicKey,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.from([]),
  });

  let tx = new Transaction().add(ins);

  let txhash = await connection.sendTransaction(tx, [feePayer, firstAccount]); // you can try to remove firstAccount and see what will happen
  console.log(`txhash: ${txhash}`);
})();
