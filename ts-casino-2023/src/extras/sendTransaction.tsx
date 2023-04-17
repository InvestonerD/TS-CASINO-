import React, { useState } from 'react';
import { TokenInstructions } from '@project-serum/serum';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Account, Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token-registry';

interface SendTransactionProps {
  recipientAddress: string;
  tokenMintAddress: string;
  tokenAmount: number;
}

const SendTransaction: React.FC<SendTransactionProps> = ({ recipientAddress, tokenMintAddress, tokenAmount }) => {
  const { publicKey, connected } = useWallet();
  const connection = useConnection();
  const [transactionStatus, setTransactionStatus] = useState<string>('');

  const sendToken = async () => {
    if (!connected || !publicKey) {
      setTransactionStatus('Por favor, conecta tu billetera primero.');
      return;
    }

    setTransactionStatus('Enviando transacción...');

    try {
      const tokenMintPublicKey = new PublicKey(tokenMintAddress);
      const recipientPublicKey = new PublicKey(recipientAddress);

      const token = new Token(connection, tokenMintPublicKey, TOKEN_PROGRAM_ID, new Account());

      const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(publicKey);
      const toTokenAccount = await Token.getAssociatedTokenAddress(TokenInstructions.ASSOCIATED_TOKEN_PROGRAM_ID, TokenInstructions.TOKEN_PROGRAM_ID, tokenMintPublicKey, recipientPublicKey);

      const transaction = new Transaction().add(
        Token.createTransferInstruction(TokenInstructions.TOKEN_PROGRAM_ID, fromTokenAccount.address, toTokenAccount, publicKey, [], tokenAmount)
      );

      const signature = await sendAndConfirmTransaction(connection, transaction, [publicKey], { commitment: 'confirmed', preflightCommitment: 'confirmed' });

      setTransactionStatus(`Transacción completada con éxito. Firma: ${signature}`);
    } catch (error) {
      console.error(error);
      setTransactionStatus('Error al enviar la transacción.');
    }
  };

  return (
    <div>
      <h2>Enviar tokens BLAZED</h2>
      {connected ? (
        <button onClick={sendToken} disabled={!connected}>
          Enviar tokens
        </button>
      ) : (
        <p>Por favor, conecta tu billetera para enviar tokens.</p>
      )}
      <p>{transactionStatus}</p>
    </div>
  );
};

export default SendTransaction;
