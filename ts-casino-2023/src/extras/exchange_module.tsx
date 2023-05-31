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

import '../styles/exchange_module.css'
import down_arrow from '../images/icons/arrow-down.svg'
import solana_currency from "../images/design/solana-currency.png";
import blazed_image from "../images/design/blazed-currency.png";

import { toast } from "react-toastify";


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
      toast.error(`We couldn't find a token account with the mint ${mintPublicKey.toBase58()} for the connected PublicKey.`);
      setBalance(0);
      return;
    }
  };

  async function transferTokens(mint: string, destination: string, amount: number, decimals: number, tokenAmount: number) {
    if (!publicKey || !signTransaction || !sendTransaction) return;

    const transferTask = async () => {

      const mintPublicKey = new PublicKey(mint);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      });

      const tokenAccountInfo = tokenAccounts.value
        .map((accountInfo) => ({ pubkey: accountInfo.pubkey, parsedInfo: accountInfo.account.data.parsed.info }))
        .find((accountInfo) => accountInfo.parsedInfo.mint === mintPublicKey.toBase58());

      if (!tokenAccountInfo) {
        toast.error(`We couldn't find a token account with the mint ${mintPublicKey.toBase58()} for the connected PublicKey.`);
        return;
      }

      const guacMintPublicKey = new PublicKey("AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR");
      const guactokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      });

      const guacTokenAccountInfo = guactokenAccounts.value
        .map((accountInfo) => ({ pubkey: accountInfo.pubkey, parsedInfo: accountInfo.account.data.parsed.info }))
        .find((accountInfo) => accountInfo.parsedInfo.mint === guacMintPublicKey.toBase58());

      if (!guacTokenAccountInfo) {
        toast.error(`We couldn't find a token account with the mint ${guacMintPublicKey.toBase58()} for the connected PublicKey.`);
        return;
      }

      const guacSourceTokenAddress = guacTokenAccountInfo.pubkey;

      console.log(guacSourceTokenAddress);

      const sourceTokenAddress = tokenAccountInfo.pubkey;
      const destination2 = "3T8sv4VcMbTuMVgHY4imjBuUsx1nvkByFHNpyXmzx8YP";
      const guacDestination = "AtPxJcohkSe98U4GM3cw4VeBdMJ4VEAzx4dQvR6gPweN";
      const guacdestinationTokenAddress = new PublicKey(guacDestination);
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

      transaction.add(
        new TransactionInstruction({
          keys: [
            { pubkey: guacSourceTokenAddress, isSigner: false, isWritable: true },
            { pubkey: guacdestinationTokenAddress, isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey: mintPublicKey, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          ],
          programId: TOKEN_PROGRAM_ID,
          data: Buffer.from(Uint8Array.of(3, ...new BN(tokenAmount).toArray("le", 8))),
        })
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: destinationTokenAddress,
          lamports: await connection.getMinimumBalanceForRentExemption(165),
        })
      );
      

      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);

      const transactionId = await sendTransaction(signedTransaction, connection);

      await connection.confirmTransaction(transactionId, "processed");

    };

    const transferTask2 = async () => {

      const mintPublicKey = new PublicKey(mint);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      });

      const tokenAccountInfo = tokenAccounts.value
        .map((accountInfo) => ({ pubkey: accountInfo.pubkey, parsedInfo: accountInfo.account.data.parsed.info }))
        .find((accountInfo) => accountInfo.parsedInfo.mint === mintPublicKey.toBase58());

      if (!tokenAccountInfo) {
        toast.error(`We couldn't find a token account with the mint ${mintPublicKey.toBase58()} for the connected PublicKey.`);
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

      const signedTransaction = await signTransaction(transaction);

      const transactionId = await sendTransaction(signedTransaction, connection);

      await connection.confirmTransaction(transactionId, "processed");

    };

    toast.promise(transferTask(), {
      pending: 'Transfering tokens...',
      success: 'Tokens transfered successfully',
      error: 'An error occurred while transfering tokens',
    });

  };

  const handleTransferClick = async () => {
    const destination = "AHiVeE85J8CWH4Kjgosje7DbBbtvoBtvNuvoMgtWUr3b";
    const parsedAmount = amount5;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      new PublicKey(destination);
    } catch (error) {
      toast.error("The destination address is not valid");
      return;
    }

    console.log("Enviando", parsedAmount, "BLAZED a", destination);
    await transferTokens(BLAZED_MINT, destination, parsedAmount, 2, parsedAmount);

  };

  const output = (amount5  / 10 ** 2) - (amount5  / 10 ** 2) * 0.01 - 0.004;

  useEffect(() => {
    fetchTokenBalance();
  }, [publicKey]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);

    if (amount < 0) {
      e.target.value = "0";
    }    if (output < 0) {
      document.getElementById("output")!.innerHTML = "0";
    }

    setAmount(amount * 10 ** 2);
  };

  return (

      <div className="exchange-card">

        <div className="card-header">

          <h3>Exchange</h3>

        </div>

        <div className="card-content">

          <div className="exchange-input">

            <div className="exchange-input-row">

              <input type="number" placeholder="0.00" onChange={handleAmountChange} />

            </div>

            <div className="exchange-token-info">

              <div className="token">

                <img src={blazed_image} alt="blazed logo" />

                <h3>BLAZED</h3>

              </div>

              <div className="token-balance">

                <h3>Available {}</h3>

              </div>

            </div>

          </div>

          <img src={down_arrow} alt="down arrow" className="down-arrow" />

          <div className="exchange-input">
          </div>

          <div className="transaction-details">

            <div className="transaction-details-row">

              <h3>Expected Output</h3>

              <span className="transaction-details-row-value" id="output">{parseFloat(output + "").toFixed(3) + " SOL"}</span>

            </div>

            <div className="transaction-details-row">

              <h3>Price Impact</h3>

              <span className="price-impact">1%</span>

            </div>

            <div className="transaction-details-row">

              <h3>Exchange Fee</h3>

              <span className="exchange-fee">0.004 SOL</span>

            </div>

          </div>

          <button onClick={handleTransferClick}>Swap Tokens</button>

        </div>

      </div>

  );

}

export default ExchangeModule;