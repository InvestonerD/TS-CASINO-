import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";

import solana_currency from "../images/design/solana-currency.png";

import "../styles/deposit.css";

import io from "socket.io-client";

const socket = io("http://localhost:4000/general");

const SendBlazed: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handlePayment = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!publicKey) throw new WalletNotConnectedError();

        const toPublicKey = new PublicKey("AHiVeE85J8CWH4Kjgosje7DbBbtvoBtvNuvoMgtWUr3b");

        const inputElement = document.getElementById("deposit-input") as HTMLInputElement;
        const lamports = parseFloat(inputElement.value) * 1000000000;

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: toPublicKey,
            lamports,
          })
        );

        const signedTransaction = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signedTransaction);

        const usernameElement = document.getElementById("username") as HTMLElement;
        const username = usernameElement.innerHTML;

        socket.emit("deposit", {
          username: username,
          amount: lamports,
        });

        resolve("Solana sent successfully!");
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleClick = async () => {
    try {
      await toast.promise(handlePayment(), {
        pending: "Sending Solana...",
        success: "Solana sent successfully!",
        error: "Failed to send Solana.",
      });
    } catch (error: unknown) {
      let message = "Unknown error occurred.";
      if (error instanceof WalletNotConnectedError) {
        message = "Please connect your wallet.";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: number }).code === 4001
      ) {
        message = "User rejected the transaction.";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        (error as { message: string }).message.includes("User rejected the request.")
      ) {
        message = "Transaction rejected by user.";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        (error as { message: string }).message.includes("Phantom - RPC Error")
      ) {
        message = "Transaction rejected by Phantom wallet.";
      }
      toast.error(message);
    }
  };

  return (
    <div className="deposit-input">

      <div className="currency-select-container">

        <div className='left-side-container'>

          <div className='currency-amounts'>

            <input id='deposit' placeholder="0.00"></input>

          </div>

        </div>

        <div className='right-side-container'>

          <div className='currency-name'>

            <img src={solana_currency} alt="sol" />

            <h1>SOLANA</h1>

          </div>

          <div className='currency-comparison'>

            <span>1 <strong>SOL</strong> = <span>20</span> <strong>USD</strong></span>

          </div>

        </div>

      </div>

      <div className="deposit-button-container">

        <button onClick={handleClick}>Deposit</button>

      </div>

    </div>
  );
};

export default SendBlazed;
