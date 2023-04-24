import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";



function ExchangeModule(): JSX.Element {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const connection = new Connection("https://maximum-wild-cloud.solana-mainnet.discover.quiknode.pro/23e472715f752adf4c286795dc3f1c299ecd284d/");

  const getNfts = async () => {
    if (!publicKey) return;

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey(TOKEN_PROGRAM_ID) }
    );

    const nfts = tokenAccounts.value
      .map((accountInfo) => accountInfo.account.data.parsed.info)
      .filter((accountInfo) => accountInfo.mint !== TOKEN_PROGRAM_ID)
      .map((accountInfo) => ({
        mint: accountInfo.mint,
        balance: accountInfo.tokenAmount.uiAmount,
      }));

    console.log("NFTs:", nfts);
  };

  const transferNft = async (mint: string, destination: string, amount: number) => {
    if (!publicKey || !signTransaction || !sendTransaction) return;

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey(TOKEN_PROGRAM_ID),
    });

    const nftAccount = tokenAccounts.value
      .map((accountInfo) => accountInfo.account.data.parsed.info)
      .find((accountInfo) => accountInfo.mint === mint);

    if (!nftAccount) {
      console.error("No se encontró la cuenta NFT con el mint especificado");
      return;
    }

    const sourcePublicKey = new PublicKey(nftAccount.owner);
    const destinationPublicKey = new PublicKey(destination);
    const mintPublicKey = new PublicKey(mint);

    const transferIx = new TransactionInstruction({
      keys: [
        { pubkey: publicKey, isSigner: true, isWritable: false },
        { pubkey: sourcePublicKey, isSigner: false, isWritable: true },
        { pubkey: destinationPublicKey, isSigner: false, isWritable: true },
        { pubkey: mintPublicKey, isSigner: false, isWritable: false },
      ],
      programId: new PublicKey(TOKEN_PROGRAM_ID),
      data: Buffer.from(
        Uint8Array.of(1, ...new BN(amount).toArray("le", 8))
      ),
    });

    const transaction = new Transaction().add(transferIx);
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    const signedTransaction = await signTransaction(transaction);
    const transactionId = await sendTransaction(signedTransaction, connection);

    console.log("Transacción completada con éxito, ID de transacción:", transactionId);
  };

  const handleTransferClick = async () => {
    const mint = "BDSZUQpDRJzJtMvio1dYPfLRQbkA7qj3ktWq3PP4UKMh"; // Reemplace esto con el mint que desea transferir
    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAmount)) {
      console.error("La cantidad ingresada no es un número válido");
      return;
    }

    await transferNft(mint, destination, parsedAmount);
  };

  useEffect(() => {
    getNfts();
  }, [publicKey]);

  return (
    <div className="App">
      <title>TID Exchange</title>

      <div className="exchange-container">
        <div className="exchange-content">

        <input
            type="text"
            placeholder="Cantidad"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button onClick={handleTransferClick}>Enviar</button>

        </div>
      </div>
    </div>
  );
}

export default ExchangeModule;
