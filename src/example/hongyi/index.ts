import { Keypair } from '@solana/web3.js';

import { getPayerByFileName } from '../../helper/utils';

(async () => {

    let payer: Keypair = await getPayerByFileName('devnet.json');

    console.log('SIGNATURE', payer.publicKey.toBase58());

})();

