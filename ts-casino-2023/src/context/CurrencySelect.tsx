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


interface CurrencySelectProps {
    currency: string;
    handleCurrencyChange: (currency: string) => void;
    handleCurrencySelect: () => void;
    handleCurrencySelectBack: () => void;
    handleDeposit: () => void;
    updateBalance: (balance: number) => void;
}

const socket = io("http://localhost:5174/general");
const CurrencySelect: React.FC<CurrencySelectProps> = ({ currency, handleCurrencyChange, handleCurrencySelect, handleCurrencySelectBack, handleDeposit, updateBalance, }) => {

    const { publicKey } = useWallet();
    const [blazedBalance, setBlazedBalance] = useState<number>(0);
    const [solanaBalance, setSolanaBalance] = useState<number>(0);
    const [solanaConvertedBalance, setSolanaConvertedBalance] = useState<number>(0);
    const [blazedConvertedBalance, setBlazedConvertedBalance] = useState<number>(0);
    const [blazedLockedBalance, setBlazedLockedBalance] = useState<number>(0);

    const updateValues = useCallback((data: any) => {
        const solanaPrice = parseFloat(data.solana.$numberDecimal);
        const blazedBalance = parseFloat(data.blazed.$numberDecimal);
        const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        const avatar = document.getElementById("avatar") as HTMLImageElement;
        const username = document.getElementById("username") as HTMLElement;
        const blazedElement = document.getElementById("balance") as HTMLElement;

        const solanaConvertedBalance = solanaPrice ? parseFloat(data.balance.$numberDecimal) / solanaPrice : 0;

        blazedElement.innerHTML = usdFormatter.format(blazedBalance);
        blazedElement.id = "blazed";
        setBlazedBalance(blazedBalance);
        setSolanaBalance(parseFloat(data.balance.$numberDecimal));
        setSolanaConvertedBalance(solanaConvertedBalance);
        setBlazedConvertedBalance(parseFloat(data.blazed.$numberDecimal));
        setBlazedLockedBalance(parseFloat(data.blazed_locked.$numberDecimal));
        avatar.src = data.avatar;
        username.innerHTML = data.username;

        const solanaConvertion = document.getElementById("sol-convertion") as HTMLElement;
        solanaConvertion.innerHTML = usdFormatter.format(solanaPrice);

        if (window.location.href.includes("/pvp-jackpot")) {
            const solanaBalanceElement = document.getElementById("blazed") as HTMLElement;
            handleCurrencyChange("solana");
            solanaBalanceElement.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
    }, [setBlazedBalance, setSolanaBalance, setSolanaConvertedBalance, setBlazedConvertedBalance, setBlazedLockedBalance]);

    useEffect(() => {
        if (publicKey) {
            socket.emit("wallet-connected", publicKey.toString());
        }
    }, [publicKey]);

    useEffect(() => {
        const handleUserData = (data: any) => {
            updateValues(data);
        };

        socket.on("user-data", handleUserData);

        return () => {
            socket.off("user-data", handleUserData);
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

                            <h1 id='solana'>{solanaConvertedBalance.toFixed(2)}</h1>

                            <span id='solana-convertion'>{solanaBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>

                        </div>

                    </div>

                    <div className='right-side-container'>

                        <div className='currency-name'>

                            <img src={solana_currency} alt="sol" />

                            <h1>SOLANA</h1>

                        </div>

                        <div className='currency-comparison'>

                            <span>1 <strong>SOL</strong> = <span id='sol-convertion'></span> <strong>USD</strong></span>

                        </div>

                    </div>

                </div>

                <div className={currency === "blazed" ? "currency-select-container selected" : "currency-select-container"} onClick={() => handleCurrencyChange("blazed")} >

                    <div className='left-side-container'>

                        <img src={currency === "blazed" ? selected : unselected} alt="selected" />

                        <div className='currency-amounts'>

                            <h1 id='blazed'>{blazedBalance.toFixed(2)}</h1>

                            <span id='blazed-convertion'>${blazedConvertedBalance.toFixed(2)}</span>

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

                            <h1>{blazedLockedBalance}</h1>

                            <span id='blazed-locked'>{blazedLockedBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>

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