import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

const WalletButton: React.FC = () => {
    const { connected, disconnect, publicKey, connect } = useWallet();

    const handleClick = async () => {
        if (!connected) {
            try {
                await connect();
            } catch (err) {
                console.log('Error connecting wallet:', err);
            }
        } else {
            try {
                await disconnect();
                toast.error('Wallet disconnected');
            } catch (err) {
                console.error('Error disconnecting wallet:', err);
            }
        }
    };

    return (
        <WalletMultiButton onClick={handleClick}>
            {connected ? `${publicKey?.toBase58()?.slice(0, 4)}...${publicKey?.toBase58()?.slice(-4)}` : 'Connect Wallet'}
        </WalletMultiButton>
    );
};

export { WalletButton };
