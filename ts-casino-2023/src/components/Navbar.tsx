import { useEffect, useState, useRef, useCallback } from 'react';
import "../styles/navbar.css";

import chat from "../images/icons/chat.svg";
import user from "../images/icons/user.svg";
import cross from "../images/icons/cross.svg";
import sol from "../images/design/sol.png";
import deposit from "../images/icons/deposit.svg";
import default_image from "../images/design/default_image.png";
import unverified from "../images/icons/unverified-badge.svg";
// import verified from "../images/icons/verified-badge.svg";
import edit from "../images/icons/edit.svg";
import badge from "../images/icons/badge.svg";
import arrow from "../images/icons/arrow.svg";
import back from "../images/icons/back.svg";
import statistics from "../images/icons/statistics.svg";
import raffles from "../images/icons/raffles.svg";
import dragon from "../images/icons/empty-dragon.svg";
import selected from "../images/design/selected.png";
import unselected from "../images/design/unselected.png";
import solana_currency from "../images/design/solana-currency.png";
import blazed_image from "../images/design/blazed-currency.png";
import locked from "../images/design/locked.png";

import { WalletButton } from '../context/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBalance } from '../context/BalanceContext';
import '@solana/wallet-adapter-react-ui/styles.css';
import 'animate.css';

// import SendBlazed from '../extras/depositSol.js';
// import WithdrawSol from '../extras/withdrawSol.js';

import io from "socket.io-client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const socket = io("casino-server.fly.dev/general");
const socket = io("http://localhost:4000/general");

interface Data {
    solana: { $numberDecimal: string };
    balance: { $numberDecimal: string };
    blazed: { $numberDecimal: string };
    blazed_locked: { $numberDecimal: string };
}

interface BalanceData {
    balance: number;
    updateBalance: (newBalance: number) => void;
}


export const Navbar = () => {

    const { publicKey } = useWallet();

    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [isUserOpen, setIsUserOpen] = useState<boolean>(false);

    const [currency, setCurrency] = useState<string>("solana");

    const [data, setData] = useState<Data>({
        solana: { $numberDecimal: "0" },
        balance: { $numberDecimal: "0" },
        blazed: { $numberDecimal: "0" },
        blazed_locked: { $numberDecimal: "0" },
    });

    const { balance, updateBalance } = useBalance() as BalanceData;

    const balanceRef = useRef<HTMLDivElement>(null);

    const updateValues = useCallback((data: any, currency: string) => {
        const solanaPrice = parseFloat(data.solana.$numberDecimal);
        const balanceEl = document.querySelector(".balance") as HTMLElement;
        const solana = document.getElementById("solana") as HTMLElement;
        const solanaConvertion = document.getElementById("solana-convertion") as HTMLElement;
        const blazed = document.getElementById("blazed") as HTMLElement;
        const blazedConvertion = document.getElementById("blazed-convertion") as HTMLElement;
        const blazedLocked = document.getElementById("blazed-locked") as HTMLElement;
        const username = document.getElementById("username") as HTMLElement;
        const avatar = document.getElementById("avatar") as HTMLImageElement;
        const currency_image = document.getElementById("currency-image") as HTMLImageElement;
    
        if (balanceRef.current) {
            balanceRef.current.innerHTML = parseFloat(data.blazed.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
    
        if (currency === "blazed") {
            updateBalance(parseFloat(data.blazed.$numberDecimal));
            solanaConvertion.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            blazedConvertion.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            blazedConvertion.innerHTML = blazed.innerHTML.substring(1);
            currency_image.src = blazed_image;
        } else if (currency === "solana") {
            updateBalance(parseFloat(data.balance.$numberDecimal));
            balanceEl.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            solana.innerHTML = (parseFloat(data.balance.$numberDecimal) / solanaPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            solana.innerHTML = solana.innerHTML.substring(1);
            solanaConvertion.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            currency_image.src = solana_currency;
        } else if (currency === "blazed_locked") {
            updateBalance(parseFloat(data.blazed_locked.$numberDecimal));
            balanceEl.innerHTML = parseFloat(data.blazed_locked.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            solanaConvertion.innerHTML = parseFloat(data.blazed_locked.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            currency_image.src = locked;
        }
    
        blazed.innerHTML = parseFloat(data.blazed.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        blazedLocked.innerHTML = parseFloat(data.blazed_locked.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        username.innerHTML = data.username;
    
        if (data.avatar) {
            avatar.src = data.avatar;
        } else {
            avatar.src = default_image;
        }
    }, [currency, updateBalance]);

    useEffect(() => {
        if (publicKey) {
            setIsConnected(true);
            socket.emit("wallet-connected", publicKey.toString());
        } else {
            setIsConnected(false);
        }
    }, [publicKey, currency]);

    useEffect(() => {
        socket.on("user-data", (data) => {
            updateValues(data, currency);
        });

        return () => {
            socket.off("user-data");
        }

    }, [currency, updateValues]);

    socket.on("updated-updated-balance-plus", (data) => {

        updateBalance(balance + data);

    });

    const toggleClassName = (selector: string, className: string) => {
        document.querySelector(selector)?.classList.toggle(className);
    };

    const handleUserClick = () => {
        setIsUserOpen(!isUserOpen);
    };

    const handleUsernameClick = useCallback(() => {
        toggleClassName('.user-username-change', 'closed');
        toggleClassName('.user-profile-card', 'open');
    }, []);

    const handleUsernameClickBack = useCallback(() => {
        toggleClassName('.user-username-change', 'closed');
        toggleClassName('.user-profile-card', 'open');
    }, []);

    const changeUsername = () => {
        const username = (document.getElementById('username-input') as HTMLInputElement)?.value;

        if (username && username.length > 0) {
            socket.emit('change-username', { username, publicKey });

            const usernamePromise = new Promise((resolve, reject) => {
                socket.on('username-changed', (data) => {
                    if (data === 'success') {
                        resolve('Username changed successfully!');

                        setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                    } else if (data === 'error') {
                        reject('Username already taken!');
                    }
                });
            });

            toast.promise(usernamePromise, {
                pending: 'Changing username...',
                success: 'Username changed successfully!',
                error: 'Username already taken!',
            });
        } else {
            toast.error('Please enter a username');
        }
    };

    const handleCurrencySelect = () => {
        document.querySelector('.currency-select')?.classList.toggle('closed');
        document.querySelector('.user-profile')?.classList.toggle('close');
        document.querySelector('.user-profile-card')?.classList.toggle('open');
    };

    const handleCurrencyChange = (currency: string) => {
        setCurrency(currency);
        const newBalance = getBalanceForCurrency(currency);
        updateBalance(newBalance);
    };

    const getBalanceForCurrency = (currency: string) => {
        let balance = 0;
        const solanaPrice = parseFloat(data.solana.$numberDecimal);
        if (currency === 'solana') {
            balance = +data.balance.$numberDecimal / solanaPrice;
        } else if (currency === "blazed") {
            balance = parseFloat(data.blazed.$numberDecimal);
        } else if (currency === "blazed_locked") {
            balance = parseFloat(data.blazed_locked.$numberDecimal);
        }
        return balance;
    };

    const handleCurrencySelectBack = () => {
        document.querySelector('.currency-select')?.classList.toggle('closed');
        document.querySelector('.user-profile')?.classList.toggle('close');
        document.querySelector('.user-profile-card')?.classList.toggle('open');
    };

    const handleDeposit = () => {
        document.querySelector('.currency-select')?.classList.toggle('closed');
        document.querySelector('.user-deposit')?.classList.toggle('closed');
    };

    const handleDepositBack = () => {
        document.querySelector('.user-deposit')?.classList.toggle('closed');
        document.querySelector('.currency-select')?.classList.toggle('closed');
    };

    const handleChatClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="navbar">
            <div className="left-row">
            </div>

            <div className="right-row">

                <div className={isConnected ? "user-balance connected" : "user-balance"} >

                    <img src={sol} alt="sol" className="sol-logo" id='currency-image' />

                    <span className="balance" ref={balanceRef} id='balance'></span>

                    <div className="deposit-icon" >

                        <img src={deposit} alt="deposit" className="deposit" onClick={handleCurrencySelect} />

                    </div>

                </div>

                <WalletButton />

                <div className={isConnected ? "icon-container connected" : "icon-container"} onClick={handleUserClick}>
                    <img src={user} alt="chat-icon" />
                </div>

                <div className={isOpen ? "icon-container open" : "icon-container"} onClick={handleChatClick}>
                    <img src={chat} alt="chat-icon" />
                </div>

            </div>

            <div className={isUserOpen ? "user-profile" : "user-profile close"}>

                <div className="user-profile-card open animate__animated animate__fadeIn">

                    <div className="user-profile-card-header">

                        <div className="user-profile-card-header-left">

                            <h1>Profile</h1>

                        </div>

                        <div className="user-profile-card-header-right">

                            <button onClick={handleUserClick}> <img src={cross} alt="x" /> </button>

                        </div>

                    </div>

                    <div className="user-profile-card-content">

                        <div className="user-data">

                            <div className="image">

                                <img src={default_image} alt="user" id='avatar' />

                                <img src={unverified} alt="unverified" className="unverified" onClick={() => { toast.info("Verification coming soon!") }} />

                            </div>

                            <div className="information">

                                <h1 id='username'>Username</h1>

                                <img src={edit} alt="edit" className="edit" onClick={handleUsernameClick} />

                            </div>

                        </div>

                        <div className="user-badges">

                            <div className="badges-header">

                                <div className='left-side'>

                                    <img src={badge} alt="badge" />

                                    <h1>Badges</h1>

                                </div>

                                <div className='right-side'>

                                    <p>Show</p>

                                    <img src={arrow} alt="arrow" />

                                </div>

                            </div>

                        </div>

                        <div className="user-statistics">

                            <div className="statistics-header">

                                <div className='left-side'>

                                    <img src={statistics} alt="badge" />

                                    <h1>Statistics</h1>

                                </div>

                                <div className='right-side'>

                                    <p>Show</p>

                                    <img src={arrow} alt="arrow" />

                                </div>

                            </div>

                            <div className='statistics-content'>

                                <div className="statistics-container">

                                    <h1>Total Wins</h1>

                                    <p>0</p>

                                </div>

                                <div className="statistics-container">

                                    <h1>Total Bets</h1>

                                    <p>0</p>

                                </div>

                                <div className="statistics-container">

                                    <h1>Total Wagered</h1>

                                    <p>0</p>

                                </div>

                            </div>

                        </div>

                        <div className="user-badges">
                        </div>

                        <div className="user-tickets">

                            <div className="tickets-header">

                                <div className='left-side'>

                                    <img src={raffles} alt="tickets" />

                                    <h1>Raffle Tickets</h1>

                                </div>

                                {/* <div className='right-side'>

                                    <p>Show</p>

                                    <img src={arrow} alt="arrow" />

                                </div> */}

                            </div>

                            <div className="tickets-content">

                                <img src={dragon} alt="empty-dragon" />

                                <p>There's nothing here...</p>

                            </div>

                        </div>

                        <div className="user-since">

                            <p id="user-since">Member since 03/14/2023</p>

                        </div>


                    </div>

                </div>

                <div className='user-username-change closed animate__animated animate__fadeIn'>

                    <div className="user-username-card-header">

                        <div className="user-username-card-header-left">

                            <button onClick={handleUsernameClickBack}> <img src={back} alt="x" /> </button>

                        </div>

                        <div className="user-username-card-header-right">

                            <h1>Username</h1>

                        </div>

                    </div>

                    <div className="user-username-card-content">

                        <div className="username-input">

                            <input type="text" placeholder="Enter new username" id='username-input' />

                        </div>

                        <div className="username-button">

                            <button id='change-username' onClick={changeUsername}>Change</button>

                        </div>

                    </div>

                </div>

                <div className='currency-select closed animate__animated animate__fadeIn'>

                    <div className="currency-select-card-header">

                        <div className="currency-select-card-header-left">

                            <h1>Bank</h1>

                        </div>

                        <div className="currency-select-card-header-right">

                            <button onClick={handleCurrencySelectBack}> <img src={cross} alt="x" /> </button>

                        </div>

                    </div>

                    <div className="currency-select-card-content">

                        <div className={currency === "solana" ? "currency-select-container selected" : "currency-select-container"} onClick={() => handleCurrencyChange("solana")}>

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

                        <div className={currency === "blazed" ? "currency-select-container selected" : "currency-select-container"} onClick={() => handleCurrencyChange("blazed")}>

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

                        <div className={currency === "blazed_locked" ? "currency-select-container selected locked" : "currency-select-container locked"} onClick={() => handleCurrencyChange("blazed_locked")}>

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

                            <button id='currency-withdraw-button' onClick={handleCurrencySelect}>Withdraw</button>

                            <button id='currency-deposit-button' onClick={handleDeposit}>Deposit</button>

                        </div>

                    </div>

                </div>

                <div className='user-deposit closed animate__animated animate__fadeIn'>

                    <div className="user-deposit-card-header">

                        <div className="user-deposit-card-header-left">

                            <button onClick={handleDepositBack}> <img src={back} alt="x" /> </button>

                        </div>

                        <div className="user-deposit-card-header-right">

                            <h1>Deposit</h1>

                        </div>

                    </div>

                    {/* <SendBlazed /> */}

                </div>

            </div>

        </div >
    );
};