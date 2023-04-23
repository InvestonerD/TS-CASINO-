import React, { useState, useEffect } from 'react';
import { SideMenu } from '../components/SideMenu.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { SideChat } from '../components/SideChat.js';
import '../styles/pvpJackpot.css';

import sol from '../images/design/sol.png'
import defaultAvatar from '../images/design/logo.png'
import caret_up from '../images/icons/caret-up.svg'
import caret_down from '../images/icons/caret-down.svg'

import { Wheel } from 'react-custom-roulette';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

import { toast } from 'react-toastify';
import io from 'socket.io-client';

const socket = io('http://localhost:4000/pvp-jackpot');
// const socket = io('casino-server.fly.dev/pvp-jackpot');

interface SocketData {
    username: string;
    betAmount: string;
    avatar: string;
}

function PVPJackpot() {
    const [balance, setBalance] = useState<number>(0);
    const { width, height } = useWindowSize()
    const [mustSpin, setMustSpin] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [initialColors, setInitialColors] = useState(true);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [betVolume, setBetVolume] = useState(0);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const waitForLoad = async () => {
            return new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    const loaded = document.getElementById('username')?.innerHTML;
                    if (loaded && loaded !== 'Username') {
                        clearInterval(interval);
                        resolve();
                    }
                }, 500);
            });
        };

        const loadData = async () => {
            await waitForLoad();

            const currentBalance = document.getElementById('solana-convertion')?.innerHTML;
            if (currentBalance) {
                const balanceFixed = currentBalance.replace('$', '').replace(',', '');
                const finalBalance = parseFloat(balanceFixed).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                if (setBalance) {
                    setBalance(parseFloat(finalBalance));
                    toast.success('Your balance is ' + finalBalance);
                }
            } else {
                toast.info('Please login to play');
            }
        };

        loadData();
    }, [setBalance]);

    useEffect(() => {

        socket.on('get-data', (newData) => {

            if (newData.length === 0) {
                toast.error('No bets have been placed yet!');
                return;
            }

            if (Array.isArray(newData)) {
                setData(() => {
                    const totalBets = newData.reduce((total, item) => {
                        const betted = item.betted || { $numberDecimal: "0" };
                        return total + parseFloat(betted.$numberDecimal);
                    }, 0);

                    const extendedData = [];

                    newData.forEach((item, index) => {
                        const betValue = parseFloat(item.betted.$numberDecimal);
                        const percentage = (betValue / totalBets) * 100;
                        const repetitions = Math.round(percentage);

                        const username = document.getElementById('username')?.innerHTML;

                        if (username === item.option) {
                            setPercentage(percentage);
                        }

                        for (let i = 0; i < repetitions; i++) {
                            const backgroundColor = item.color || '';
                            const borderColor = backgroundColor;
                            extendedData.push({
                                option: item.option || '',
                                style: {
                                    backgroundColor,
                                    textColor: 'transparent',
                                    border: `1px solid ${borderColor}`,
                                },
                                bet: item.betted || {},
                                username: item.option || '',
                                avatar: item.avatar || '',
                            });
                        }

                        if (index < newData.length - 1 && item.color !== newData[index + 1].color) {
                            extendedData.push({
                                option: '',
                                style: {
                                    backgroundColor: '#0A0A0B',
                                    textColor: 'transparent',
                                    border: `1px solid #0A0A0B`,
                                },
                            });
                        }
                    });

                    if (newData.length > 0 && newData[0].color !== newData[newData.length - 1].color) {
                        extendedData.push({
                            option: '',
                            style: {
                                backgroundColor: '#0A0A0B',
                                textColor: 'transparent',
                            },
                        });
                    }

                    document.getElementById('total-value').innerHTML = totalBets.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                    setBetVolume(totalBets);

                    const options = newData.reduce((acc, curr) => {
                        if (acc.indexOf(curr.option) === -1) {
                            acc.push(curr.option);
                        }
                        return acc;
                    }, []);

                    const dataByOption = options.reduce((acc, curr) => {
                        acc[curr] = {
                            option: curr,
                            style: {
                                backgroundColor: '',
                                textColor: '',
                            },
                            bet: {
                                $numberDecimal: 0
                            },
                            username: newData.find(item => item.option === curr)?.option || '',
                            avatar: newData.find(item => item.option === curr)?.avatar || '',
                            betsArray: [],
                        };

                        newData.forEach((item) => {
                            if (item.option === curr) {
                                const optionData = acc[curr];
                                optionData.bet.$numberDecimal = parseFloat(optionData.bet.$numberDecimal) + parseFloat(item.betted.$numberDecimal);
                                optionData.username = item.option;
                                optionData.avatar = item.avatar;
                                const color = item.color || '#000000';
                                console.log(color);
                                optionData.style.backgroundColor = color;
                                optionData.style.textColor = initialColors ? 'transparent' : color;
                                optionData.betsArray.push(item);
                            }
                        });

                        return acc;
                    }, {});

                    function hexToRgb(hex) {
                        hex = hex.replace("#", "");
                        function rgbToCssString(rgb) {
                            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                        }

                        var r = parseInt(hex.substring(0, 2), 16);
                        var g = parseInt(hex.substring(2, 4), 16);
                        var b = parseInt(hex.substring(4, 6), 16);

                        return { r, g, b };
                    }

                    const playersContainer = document.querySelector('.players-container');
                    playersContainer.innerHTML = '';

                    options.forEach((option) => {
                        const optionData = dataByOption[option];

                        const playerWrapperElement = document.createElement('div');
                        playerWrapperElement.classList.add('player-wrapper');

                        const playerElement = document.createElement('div');
                        playerElement.classList.add('player');

                        const playerInfoElement = document.createElement('div');
                        playerInfoElement.classList.add('player-info');

                        const avatarElement = document.createElement('img');
                        avatarElement.src = optionData.avatar || defaultAvatar;
                        playerInfoElement.appendChild(avatarElement);

                        const usernameElement = document.createElement('h3');
                        usernameElement.innerText = optionData.username;
                        playerInfoElement.appendChild(usernameElement);

                        playerElement.appendChild(playerInfoElement);

                        const betInfoElement = document.createElement('div');
                        betInfoElement.classList.add('bet-info');

                        const betAmountElement = document.createElement('div');
                        betAmountElement.classList.add('bet-amount');

                        const betAmountImgElement = document.createElement('img');
                        betAmountImgElement.src = sol;
                        betAmountElement.appendChild(betAmountImgElement);

                        const betAmountSpanElement = document.createElement('span');
                        betAmountSpanElement.innerText = optionData.bet.$numberDecimal;
                        betAmountElement.appendChild(betAmountSpanElement);

                        betInfoElement.appendChild(betAmountElement);

                        const winPercentageElement = document.createElement('div');
                        winPercentageElement.classList.add('win-percentage');

                        const winPercentageSpanElement = document.createElement('span');
                        const betValue = parseFloat(optionData.bet.$numberDecimal);
                        const percentage = (betValue / totalBets) * 100;
                        winPercentageSpanElement.innerText = percentage.toFixed(2) + '%';
                        const rgbColor = hexToRgb(optionData.style.backgroundColor);
                        winPercentageSpanElement.style.color = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
                        winPercentageElement.appendChild(winPercentageSpanElement);

                        betInfoElement.appendChild(winPercentageElement);

                        playerElement.appendChild(betInfoElement);

                        playerWrapperElement.appendChild(playerElement);
                        playersContainer.appendChild(playerWrapperElement);
                    });

                    return extendedData;
                });
            } else {
                console.error('Received data is not iterable:', newData);
            }
        });

        socket.on('spin-start', (data) => {
            setRotationAngle(data.rotationAngle);
            setPrizeNumber(data.prizeNumber);
            setMustSpin(true);
        });

        socket.on('timer', (data: string) => {
            const timerElement = document.getElementById('timer') as HTMLElement;
            const progressBar = document.getElementById('progress') as HTMLElement;
            if (timerElement) {
                timerElement.style.display = 'flex';
                progressBar.style.width = `${((25 - Number(data)) / 25) * 100}%`;
            }

            const waitingElement = document.getElementById('waiting');
            if (waitingElement) {
                waitingElement.style.display = 'none';
            }

            if (data === '0') {
                if (timerElement) {
                    timerElement.style.display = 'none';
                }
                if (waitingElement) {
                    waitingElement.style.display = 'flex';
                }
            }
        });

    }, []);

    const [data, setData] = useState([
        { option: '1', style: { backgroundColor: '#0A0A0B', textColor: 'transparent' } },
    ]);

    const handleSpinFinished = () => {
        setMustSpin(false);

        const winningData = data[prizeNumber];
        const username = document.getElementById('username')?.innerHTML;

        socket.emit('spin-finished', {
            winningData,
            prize: betVolume,
            username: username || '',
        });

        if (winningData && document.getElementById('username').innerHTML === winningData.username) {
            setShowConfetti(true);
        }

        toast.success(`The winner is ${winningData.username}!`);

        const timerElement = document.getElementById('timer') as HTMLElement;
        const progressBar = document.getElementById('progress') as HTMLElement;

        if (timerElement) {
            timerElement.style.display = 'none';
        }

        if (progressBar) {
            progressBar.style.display = 'none';
        }

        const betVolume2 = document.getElementById('total-value');
        if (betVolume2) {
            betVolume2.innerHTML = '0.00';
        }

        setTimeout(() => {

        setData(prevData => {
            return prevData.map(item => {
                return {
                    ...item,
                    style: {
                        ...item.style,
                        backgroundColor: '#0A0A0B',
                    },
                };
            });
        });

    }, 5500);
    };

    const handleBet = () => {
        const username = document.getElementById('username')?.innerHTML;
        const betAmount = (document.getElementById('bet-amount') as HTMLInputElement).value;
        const avatar = document.getElementById('avatar')?.src;

        if (username === 'Username') {
            toast.error('You must be logged in to make a bet!');
            return;
        }

        if (betAmount === '') {
            toast.error('You must enter a bet amount!');
            return;
        }

        if (parseFloat(betAmount) <= 0) {
            toast.error('You must bet at least 0.1 SOL!');
            return;
        }

        if (parseFloat(betAmount) > balance) {
            toast.error('You do not have enough SOL to make this bet!');
            return;
        }

        const socketData: SocketData = {
            username: username,
            betAmount: betAmount,
            avatar: avatar,
            chance: percentage,
        };

        socket.emit('bet-sent', socketData);

        toast.success('Bet placed!');
    };

    socket.on('updated-balance-minus', (data) => {

        setTimeout(() => {
            let updated = document.getElementById('solana');
            updated.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            let fixed_Amount = data.balance.$numberDecimal.replace('$', '');
            let fixed_Amount2 = fixed_Amount.replace(',', '');
            let final_balance = parseFloat(fixed_Amount2);

            setBalance(final_balance);
        }, 1000);

    });

    socket.on('updated-balance-plus', (data) => {

        setTimeout(() => {
            let updated = document.getElementById('solana') as HTMLElement;
            updated.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            let fixed_Amount = data.balance.$numberDecimal.replace('$', '');
            let fixed_Amount2 = fixed_Amount.replace(',', '');
            let final_balance = parseFloat(fixed_Amount2);

            setBalance(final_balance);
        }, 1000);
        
    });

    socket.on('last-winner', (data) => {
        console.log(data);
    });

    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    return (

        <div className='App'>

            {showConfetti && <Confetti width={width} height={height} />}
            <title>PVP Jackpot</title>

            <SideMenu />

            <div className='pvp-jackpot-container'>

                <Navbar />

                <div className='jackpot-content'>

                    <div className='wheel-container'>

                        <div className='wheel'>

                            <Wheel
                                mustStartSpinning={mustSpin}
                                prizeNumber={prizeNumber}
                                rotationAngle={rotationAngle}
                                data={data}
                                textColors={['transparent', 'transparent']}
                                onStopSpinning={handleSpinFinished}
                                innerRadius={80}
                                radiusLineWidth={0}
                                radiusLineColor={'transparent'}
                                outerBorderColor={'#0A0A0B'}
                                outerBorderWidth={4}
                                fontColor={'transparent'}
                                pointerProps={{
                                    className: 'pointer',
                                    src: 'https://raw.githubusercontent.com/InvestonerD/2023-CASINO/main/tid-puchinos-casino/src/images/design/wheel-arrow.png',
                                    alt: 'pointer',
                                }}
                                style={{ zIndex: 1 }}
                            />

                            <div className='wheel-overlay'>

                                <div className='wheel-overlay-content'>

                                    <div className='wheel-overlay-title'>

                                        <h3>Total Volume</h3>

                                        <h1 id='total-value'>0.00</h1>

                                    </div>

                                    <div className='wheel-overlay-waiting'>

                                        <h3 id='waiting'>WAITING FOR PLAYERS</h3>

                                        <div id='timer'>

                                            <div className='progress' id='progress' />

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="bet-container">

                            <div className="bet-input-area">

                                <div className="bet-title">

                                    <h1>Amount</h1>

                                </div>

                                <div className="bet-input-amount">

                                    <div className="left-side-inputs">

                                        <img src={sol} alt="sol" />

                                        <input type="number" placeholder="0.00" id="bet-amount" />

                                    </div>

                                    <div className="right-side-inputs">

                                        <button className="mini-button">/2</button>

                                        <button className="mini-button">x2</button>

                                        <button className="mini-button">Max</button>

                                    </div>

                                </div>

                            </div>

                            <div className="bet-button-area">

                                <button className="bet-button" onClick={handleBet}>Make Bet</button>

                            </div>

                        </div>

                    </div>

                    <div className="active-players-container">

                        <div className="title">

                            <span>Active Players</span>

                        </div>

                        <div className="content">

                            <div className="players">

                                <div className='players-container'>

                                </div>

                                <div className='arrows'>

                                    <img src={caret_up} alt='caret-up' />

                                    <img src={caret_down} alt='caret-down' />

                                </div>

                            </div>

                            <div className='last-won'>

                                <div className='container'>

                                    <div className='user'>
                                    </div>

                                    <div className='won'>
                                    </div>

                                    <div className='chance'>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <Footer />

                </div>

            </div>

            <SideChat />

        </div>

    );

}

export default PVPJackpot;
