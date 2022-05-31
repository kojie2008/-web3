const web3 = require("@solana/web3.js");
// console.log(web3);

(async () => {

    let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    // console.log(connection);

    let slot = await connection.getSlot();
    console.log(slot);

    let blockTime = await connection.getBlockTime(slot);
    console.log(blockTime);

})();
