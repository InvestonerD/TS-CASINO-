import { useState, useRef, useCallback, useEffect } from 'react';
import "../styles/navbar.css";

import chat from "../images/icons/chat.svg";
import user from "../images/icons/user.svg";
import cross from "../images/icons/cross.svg";
import sol from "../images/design/solana-currency.png";
import blazed from "../images/design/blazed-currency.png";
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

import { CurrencySelect } from '../context/CurrencySelect';
import { WalletButton } from '../context/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';
import 'animate.css';

import SendBlazed from '../extras/depositSol';
// import WithdrawSol from '../extras/withdrawSol.js';

import io from "socket.io-client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const socket = io("casino-server.fly.dev/general");
const socket = io("http://localhost:4000/general");

export const Navbar = () => {

    const { publicKey } = useWallet();

    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [isUserOpen, setIsUserOpen] = useState<boolean>(false);

    const balanceRef = useRef<HTMLDivElement>(null);

    const [currency, setCurrency] = useState<string>('blazed');

    const [balanceId, setBalanceId] = useState('balance');


    const handleCurrencyChange = (newCurrency: string) => {
        setCurrency(newCurrency);
        let newBalanceId = '';

        if (newCurrency === 'solana') {
            newBalanceId = 'solana';
            const solanaBalanceElement = document.getElementById('solana-convertion');
            const cleanBalance = solanaBalanceElement?.textContent?.replace(/[$,]/g, '');
            const numberBalance = parseFloat(cleanBalance || '0');
            document.querySelectorAll('.balance').forEach((balanceElement) => {
                balanceElement.textContent = '$' + numberBalance.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
                balanceElement.id = newBalanceId;
            });
            const currencyImage = document.getElementById('currency-image') as HTMLImageElement;
            currencyImage.src = sol;
        } else if (newCurrency === 'blazed') {
            newBalanceId = 'blazed';
            const blazedBalanceElement = document.getElementById('blazed-convertion');
            const newBalanceRef = document.getElementById(newBalanceId) as HTMLDivElement;
            if (balanceRef.current && newBalanceRef) {
                newBalanceRef.textContent = blazedBalanceElement ? blazedBalanceElement.textContent : '';
                balanceRef.current.id = newBalanceId;
            }
            document.querySelectorAll('.balance').forEach((balanceElement) => {
                balanceElement.id = newBalanceId;
                balanceElement.textContent = blazedBalanceElement ? blazedBalanceElement.textContent : '';
            });
            const currencyImage = document.getElementById('currency-image') as HTMLImageElement;
            currencyImage.src = blazed;
        } else if (newCurrency === 'blazed_locked') {
            newBalanceId = 'blazed-locked';
            const blazedLockedBalanceElement = document.getElementById('blazed-locked');
            const newBalanceRef = document.getElementById(newBalanceId) as HTMLDivElement;
            if (balanceRef.current && newBalanceRef) {
                newBalanceRef.textContent = blazedLockedBalanceElement ? blazedLockedBalanceElement.textContent : '';
                balanceRef.current.id = newBalanceId;
            }
            document.querySelectorAll('.balance').forEach((balanceElement) => {
                balanceElement.id = newBalanceId;
                balanceElement.textContent = blazedLockedBalanceElement ? blazedLockedBalanceElement.textContent : '';
            });
            const currencyImage = document.getElementById('currency-image') as HTMLImageElement;
            currencyImage.src = blazed;
        }

        setBalanceId(newBalanceId);
    };

    useEffect(() => {
        if (publicKey) {
            setIsConnected(true);
        } else {
            setIsConnected(false);
        }
    }, [publicKey]);

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

    const handleCurrencySelectBack = () => {
        document.querySelector('.currency-select')?.classList.toggle('closed');
        document.querySelector('.user-profile')?.classList.toggle('close');
        document.querySelector('.user-profile-card')?.classList.toggle('open');
    };

    const handleDepositBack = () => {
        document.querySelector('.user-deposit')?.classList.toggle('closed');
        document.querySelector('.currency-select')?.classList.toggle('closed');
    };

    const handleChatClick = () => {
        setIsOpen(!isOpen);
            document.querySelector('.side-chat')?.classList.toggle('close');
    };

    const handleDeposit = () => {
        document.querySelector('.user-deposit')?.classList.toggle('closed');
        document.querySelector('.currency-select')?.classList.toggle('closed');
    };

    return (
        <div className="navbar">
            <div className="left-row">
            </div>

            <div className="right-row">

                <div className={isConnected ? "user-balance connected" : "user-balance"} >

                    <img src={blazed} alt="sol" className="sol-logo" id='currency-image' />

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

                <CurrencySelect
                    currency={currency}
                    handleCurrencyChange={handleCurrencyChange}
                    handleCurrencySelect={handleCurrencySelect}
                    handleCurrencySelectBack={handleCurrencySelectBack}
                    handleDeposit={handleDeposit}
                    updateBalance={(balance: number) => {}}
                />

                <div className='user-deposit closed animate__animated animate__fadeIn'>

                    <div className="user-deposit-card-header">

                        <div className="user-deposit-card-header-left">

                            <button onClick={handleDepositBack}> <img src={back} alt="x" /> </button>

                        </div>

                        <div className="user-deposit-card-header-right">

                            <h1>Deposit</h1>

                        </div>

                    </div>

                    <SendBlazed />

                </div>

            </div>

        </div >
    );
};