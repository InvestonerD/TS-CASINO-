import React, { useCallback, useEffect, useRef, useState } from "react";
import cross from "../images/icons/cross.svg";
import selected from "../images/design/selected.png";
import unselected from "../images/design/unselected.png";
import solana_currency from "../images/design/solana-currency.png";
import blazed_image from "../images/design/blazed-currency.png";
import locked from "../images/design/locked.png";
import default_image from "../images/design/default_image.png";

import io from "socket.io-client";
import { useWallet } from '@solana/wallet-adapter-react';

import { toast } from "react-toastify";

const socket = io("http://localhost:4000/general");

interface CurrencySelectProps {
    currency: string;
    handleCurrencyChange: (currency: string) => void;
    handleCurrencySelect: () => void;
    handleCurrencySelectBack: () => void;
    handleDeposit: () => void;
    updateBalance: (balance: number) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ currency, handleCurrencyChange, handleCurrencySelect, handleCurrencySelectBack, handleDeposit, updateBalance, }) => {

    const balanceRef = useRef<HTMLElement>(null);

    const { publicKey } = useWallet();
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [blazedBalance, setBlazedBalance] = useState<number>(0);
    const [solanaBalance, setSolanaBalance] = useState<number>(0);

    // const updateValues = useCallback(
    //     (data: any, currency: string) => {
    //         console.log(data);
    //         const solanaPrice = parseFloat(data.solana.$numberDecimal);
    //         const balanceEl = document.querySelector(".balance") as HTMLElement;
    //         const solana = document.getElementById("solana") as HTMLElement;
    //         const solanaConvertion = document.getElementById("solana-convertion") as HTMLElement;
    //         const blazed = document.getElementById("blazed") as HTMLElement;
    //         const blazedConvertion = document.getElementById("blazed-convertion") as HTMLElement;
    //         const blazedLocked = document.getElementById("blazed-locked") as HTMLElement;
    //         const username = document.getElementById("username") as HTMLElement;
    //         const avatar = document.getElementById("avatar") as HTMLImageElement;
    //         const currency_image = document.getElementById("currency-image") as HTMLImageElement;

    //         if (balanceRef.current) {
    //             balanceRef.current.innerHTML = parseFloat(data.blazed.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //         }

    //         if (currency === "blazed") {
    //             updateBalance(parseFloat(data.blazed.$numberDecimal));
    //             solanaConvertion.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //             blazedConvertion.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //             blazedConvertion.innerHTML = blazed.innerHTML.substring(1);
    //             currency_image.src = blazed_image;
    //         } else if (currency === "solana") {
    //             updateBalance(parseFloat(data.balance.$numberDecimal));
    //             balanceEl.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //             solana.innerHTML = (parseFloat(data.balance.$numberDecimal) / solanaPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //             solana.innerHTML = solana.innerHTML.substring(1);
    //             solanaConvertion.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //             currency_image.src = solana_currency;
    //         } else if (currency === "blazed_locked") {
    //             updateBalance(parseFloat(data.blazed_locked.$numberDecimal));
    //             balanceEl.innerHTML = parseFloat(data.blazed_locked.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //             solanaConvertion.innerHTML = parseFloat(data.blazed_locked.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //             currency_image.src = locked;
    //         }

    //         blazed.innerHTML = parseFloat(data.blazed.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //         blazedLocked.innerHTML = parseFloat(data.blazed_locked.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //         username.innerHTML = data.username;

    //         if (data.avatar) {
    //             avatar.src = data.avatar;
    //         } else {
    //             avatar.src = default_image;
    //         }
    // }, [currency]);

    const updateValues = useCallback(
        (data: any, currency: string) => {
            const solanaPrice = parseFloat(data.solana.$numberDecimal);
            if (currency === "blazed") {
                setBlazedBalance(parseFloat(data.blazed.$numberDecimal));
            } else if (currency === "solana") {
                setSolanaBalance(parseFloat(data.balance.$numberDecimal));
            } else if (currency === "blazed_locked") {
                setBlazedBalance(parseFloat(data.blazed_locked.$numberDecimal));
            }
        },
        []
    );

    useEffect(() => {
        if (publicKey) {
            setIsConnected(true);
            socket.emit("wallet-connected", publicKey.toString());
            toast.success("Connected to crash server!");
        } else {
            setIsConnected(false);
        }
    }, [publicKey]);

    useEffect(() => {
        socket.on("user-data", (data) => {
            updateValues(data, currency);
        });

        return () => {
            socket.off("user-data");
        };
    }, [currency, updateValues]);

    return (
        <div className="currency-select closed animate__animated animate__fadeIn">
            <div className="currency-select-card-header">
                <div className="currency-select-card-header-left">
                    <h1>Bank</h1>
                </div>
                <div className="currency-select-card-header-right">
                    <button onClick={handleCurrencySelectBack}>
                        <img src={cross} alt="x" />
                    </button>
                </div>
            </div>

            <div className="currency-select-card-content">

                <div className={currency === "solana" ? "currency-select-container selected" : "currency-select-container"} onClick={() => handleCurrencyChange("solana")} >

                    <div className='left-side-container'>

                        <img src={currency === "solana" ? selected : unselected} alt="selected" />

                        <div className='currency-amounts'>

                            <h1 id='solana'>0.00</h1>

                            <span id='solana-convertion'>$0.00</span>

                        </div>

                    </div>

                    <div className='right-side-container'>

                        <div className='currency-name'>

                            <img src={solana_currency} alt="sol" />

                            <h1>SOLANA</h1>

                        </div>

                        <div className='currency-comparison'>

                            <span>1 <strong>SOL</strong> = <span id='convertion'></span> <strong>USD</strong></span>

                        </div>

                    </div>

                </div>

                <div className={currency === "blazed" ? "currency-select-container selected" : "currency-select-container"} onClick={() => handleCurrencyChange("blazed")} >

                    <div className='left-side-container'>

                        <img src={currency === "blazed" ? selected : unselected} alt="selected" />

                        <div className='currency-amounts'>

                            <h1 id='blazed'>0.00</h1>

                            <span id='blazed-convertion'>$0.00</span>

                        </div>

                    </div>

                    <div className='right-side-container'>

                        <div className='currency-name'>

                            <img src={blazed_image} alt="blazed" />

                            <h1>BLAZED</h1>

                        </div>

                        <div className='currency-comparison'>

                            <span>1 <strong>BLAZED</strong> = 1 <strong>USD</strong></span>

                        </div>

                    </div>

                </div>

                <div className={currency === "blazed_locked" ? "currency-select-container selected locked" : "currency-select-container locked"} onClick={() => handleCurrencyChange("blazed_locked")} >

                    <div className='left-side-container'>

                        <img src={currency === "blazed_locked" ? selected : unselected} alt="selected" />

                        <div className='currency-amounts'>

                            <h1>0.00</h1>

                            <span id='blazed-locked'>$0.00</span>

                        </div>

                    </div>

                    <div className='right-side-container locked'>

                        <div className='currency-name'>

                            <img src={blazed_image} alt="blazed" />

                            <h1>BLAZED</h1>

                        </div>

                        <img src={locked} alt="locked" />

                    </div>

                </div>

                <div className="currency-select-card-buttons">
                    <button id="currency-withdraw-button" onClick={handleCurrencySelect}>
                        Withdraw
                    </button>
                    <button id="currency-deposit-button" onClick={handleDeposit}>
                        Deposit
                    </button>
                </div>

            </div>

        </div>
    );

};


export { CurrencySelect };