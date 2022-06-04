import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";

(async () => {
  // 1.
    const mnemonic = bip39.generateMnemonic();
    console.log(mnemonic);
  // 2.
  // const mnemonic = "accuse page hill pink real observe true output blue story hobby skate";

  const seed = bip39.mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)
  const keypair = Keypair.fromSeed(seed.slice(0, 32));
  console.log(`${keypair.publicKey.toBase58()}`); // 3BqV6oPRzMv65M8rzMyXRqHbZqMRQFtXRjEHeY3yYSKX
})();
