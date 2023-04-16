import React, { useEffect } from 'react';
import {
    ConnectionProvider,
    WalletProvider,
    useWallet,
    useConnection
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolongWalletAdapter } from '@solana/wallet-adapter-solong';
import { TrustWalletAdapter } from '@solana/wallet-adapter-trust';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/design/logo.png';

import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletAuthWrapperProps {
    children: React.ReactNode;
}

const useWalletEffect = () => {
    const { publicKey } = useWallet();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!publicKey) {
                toast(
                    <div className="toast-container">
                        <img src={logo} className="toast-image" alt="Logo" />
                        <span>Connect a wallet to get started!</span>
                    </div>,
                    {
                        className: 'toastify-toast'
                    }
                );
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [publicKey]);
};

const WalletAuthWrapper: React.FC<WalletAuthWrapperProps> = ({ children }) => {
    const endpoint = 'https://flashy-blissful-emerald.solana-mainnet.discover.quiknode.pro/5fa5cacd9e4a581e727c0bc7fa844c452f0c30cb/';
    const wallets = [
        new SolflareWalletAdapter(),
        new SolongWalletAdapter(),
        new TrustWalletAdapter(),
        new LedgerWalletAdapter(),
        new SolletWalletAdapter(),
    ];

    return (
        <WalletProvider wallets={wallets} autoConnect>
            <ConnectionProvider endpoint={endpoint}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </ConnectionProvider>
        </WalletProvider>
    );

};

export { WalletAuthWrapper, useWalletEffect };
