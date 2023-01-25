const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

//const newpair=Keypair.generate();
//console.log(JSON.stringify(newpair));
const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
    204,86,60,238,228,122,184,140,135,253,92,94,58,
    36,46,93,253,45,54,68,93,13,90,56,46,137,
    253,159,206,124,25,23,14,23,194,26,102,85,
    221,5,192,158,95,87,90,18,189,49,250,206,240,
    159,110,246,167,97,107,255,151,178,177,7,84,146
    ]   
 );
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const transferSol = async() => {
    
   
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    
    const to = Keypair.generate();

    
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature =await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL 
    );

    var walletsender=await getWalletBalance(from.publicKey);
        console.log(`Your Wallet balance: ${walletsender / LAMPORTS_PER_SOL} SOL`);
        var transferreceiver = BigInt(walletsender) / BigInt(2);

    let latestBlockHash = await connection.getLatestBlockhash();

   
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    


    console.log("Airdrop completed for the Sender account");
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: transferreceiver
        })
    );

    

        
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
   
    console.log('Signature is', signature);

    var receiverwallet = await getWalletBalance(to.publicKey);
	console.log(`Receiver balance :   ${receiverwallet / LAMPORTS_PER_SOL}  SOL`);

    async function getWalletBalance(thePublicKey) {
        try {
            
            const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
            const walletBalance = await connection.getBalance(new PublicKey(thePublicKey));
            return walletBalance;

        } catch (err) {
            console.log(err);
        }
   
    
}
}

transferSol();



 
