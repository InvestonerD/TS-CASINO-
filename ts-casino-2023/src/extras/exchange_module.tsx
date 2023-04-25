import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";

interface TransferParams {
  sourcePublicKey: PublicKey;
  destinationPublicKey: PublicKey;
  amount: number;
  decimals: number;
}


function ExchangeModule(): JSX.Element {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [amount5, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const connection = new Connection("https://maximum-wild-cloud.solana-mainnet.discover.quiknode.pro/23e472715f752adf4c286795dc3f1c299ecd284d/");

  const BLAZED_MINT = "BDSZUQpDRJzJtMvio1dYPfLRQbkA7qj3ktWq3PP4UKMh";

  const fetchTokenBalance = async () => {
    if (!publicKey) return;

    const mintPublicKey = new PublicKey(BLAZED_MINT);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey(TOKEN_PROGRAM_ID),
    });

    const tokenAccount = tokenAccounts.value
      .map((accountInfo) => accountInfo.account.data.parsed.info)
      .find((accountInfo) => accountInfo.mint === mintPublicKey.toBase58());

    if (!tokenAccount) {
      console.error(`No se encontró una cuenta de token con el mint ${mintPublicKey.toBase58()} para la PublicKey conectada.`);
      setBalance(0);
      return;
    }
  };

  async function getAssociatedTokenAddress(walletAddress: PublicKey, mintAddress: PublicKey): Promise<PublicKey> {
    const [associatedTokenAddress] = await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer(),
      ],
      SystemProgram.programId
    );
    return associatedTokenAddress;
  }

  async function transferTokens(mint: string, destination: string, amount: number, decimals: number, tokenAmount: number) {
    if (!publicKey || !signTransaction || !sendTransaction) return;
  
    const mintPublicKey = new PublicKey(mint);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey(TOKEN_PROGRAM_ID),
    });
  
    const tokenAccountInfo = tokenAccounts.value
      .map((accountInfo) => ({ pubkey: accountInfo.pubkey, parsedInfo: accountInfo.account.data.parsed.info }))
      .find((accountInfo) => accountInfo.parsedInfo.mint === mintPublicKey.toBase58());
  
    if (!tokenAccountInfo) {
      console.error(`No se encontró una cuenta de token con el mint ${mint} para la PublicKey conectada.`);
      return;
    }
  
    const sourceTokenAddress = tokenAccountInfo.pubkey;
    const destination2 = "3T8sv4VcMbTuMVgHY4imjBuUsx1nvkByFHNpyXmzx8YP";
    const destinationTokenAddress = new PublicKey(destination2);


    const transaction = new Transaction();
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;

    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: sourceTokenAddress, isSigner: false, isWritable: true },
          { pubkey: destinationTokenAddress, isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: true, isWritable: false },
          { pubkey: mintPublicKey, isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: TOKEN_PROGRAM_ID,
        data: Buffer.from(Uint8Array.of(3, ...new BN(amount5).toArray("le", 8))),
      })
    );

 

    transaction.feePayer = publicKey;

  
    console.log("Transacción construida: transfer tokens", transaction);

  
    const signedTransaction = await signTransaction(transaction);
  
    console.log("Transacción firmada:", signedTransaction);
  
    const transactionId = await sendTransaction(signedTransaction, connection);
  
    console.log("Transacción enviada con éxito, ID de transacción:", transactionId);
  
    await connection.confirmTransaction(transactionId, "processed");
  
    setBalance(balance - tokenAmount);
  }
  

  const handleTransferClick = async () => {
    const destination = "AHiVeE85J8CWH4Kjgosje7DbBbtvoBtvNuvoMgtWUr3b";
    const parsedAmount = amount5;

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    console.error("La cantidad ingresada no es un número válido o es menor o igual a 0");
    return;
  }

  try {
    new PublicKey(destination);
  } catch (error) {
    console.error("La dirección de destino no es válida:", error);
    return;
  }

  console.log("Enviando", parsedAmount, "BLAZED a", destination);
  await transferTokens(BLAZED_MINT, destination, parsedAmount, 2, parsedAmount);

  };

  useEffect(() => {
    fetchTokenBalance();
  }, [publicKey]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    // busca la manera en que sea numero entero pero con opcion de poner decimales
    if (isNaN(amount) || amount < 0) {
      console.error("La cantidad ingresada no es un número válido o es menor o igual a 0");
      return;
    }

    setAmount(amount * 10 ** 2);
  };

  return (
    <div className="App">
    <title>TID Exchange</title>
    <div className="exchange-container">
    <div className="exchange-content">
      <h4>Saldo de BLAZED: {balance}</h4>
      <input
        type="number"
        placeholder="Cantidad"
        onChange={handleAmountChange}
      />
      <button onClick={handleTransferClick}>Transferir</button>
    </div>
    </div>
    </div>
  );
}

export default ExchangeModule;