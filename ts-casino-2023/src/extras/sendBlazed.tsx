import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";

import "../styles/deposit.css";

const SendBlazed: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handlePayment = async (): Promise<string> => {
    if (!publicKey) throw new WalletNotConnectedError();

    const toPublicKey = new PublicKey("AHiVeE85J8CWH4Kjgosje7DbBbtvoBtvNuvoMgtWUr3b");

    const lamports = 1000000;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: toPublicKey,
        lamports,
      })
    );

    const signedTransaction = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signedTransaction);

    return "Solana sent successfully!";
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
    <div className="input-container">
      <button onClick={handleClick}>Send Solana</button>
    </div>
  );
};

export default SendBlazed;
