import React, { useEffect, useRef, useState } from "react";
import { SideMenu } from '../components/SideMenu.js'
import { Navbar } from '../components/Navbar.js'
import { Footer } from '../components/Footer.js';
import { SideChat } from '../components/SideChat.js';
import '../styles/crash.css'
import 'animate.css'

import green_circle from '../images/icons/green-circle.svg'
// import ImTimToo from '../images/design/ImTimToo.png'
import sol from '../images/design/sol.png'
import avatar from '../images/design/bet-avatar.png'

import io from 'socket.io-client';
import { toast } from "react-toastify";

// const crash = io('casino-server.fly.dev/crash');
const crash = io('http://localhost:4000/crash');

function Crash() {

    const [active_bet, setBet] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const waitForLoad = async () => {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    const loaded = document.getElementById('username')?.innerHTML;
                    if (loaded && loaded !== "Username") {
                        clearInterval(interval);
                        resolve();
                    }
                }, 500);
            });
        };

        const loadData = async () => {
            await waitForLoad();

            const currentBalance = document.querySelector('.balance')?.innerHTML;
            if (currentBalance) {
                const balanceFixed = currentBalance.replace('$', '').replace(',', '');
                const finalBalance = parseFloat(balanceFixed);
                if (setBalance) {
                    setBalance(parseFloat(finalBalance));
                    toast.success('Your balance is now ' + finalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
                }
            } else {
                toast.info('Please login to play');
            }
        };

        loadData();
    }, []);

    const crashBetsRef = useRef(null);

    const handleMouseOver = (e) => {
        const crashBets = crashBetsRef.current;
        const containerRect = crashBets.getBoundingClientRect();
        const mouseY = e.clientY - containerRect.top;
        const containerHeight = containerRect.bottom - containerRect.top;
        const scrollHeight = crashBets.scrollHeight - containerHeight;

        const scrollAmount = (mouseY / containerHeight) * scrollHeight;
        crashBets.scrollTop = scrollAmount;

        crashBets.addEventListener('mouseleave', () => {
            crashBets.scrollTop = 0;
        })

        crashBets.style.scrollBehavior = 'smooth';
    }

    const HandleBet = (e) => {
        e.preventDefault();
        const username = document.getElementById('username').innerHTML;

        const betAmount = document.getElementById('crash-amount').value;

        const userAvatar = document.getElementById('avatar').src;

        let amount_input = document.getElementById('crash-amount');
        let cash_out_input = document.getElementById('crash-cash-out');

        if (username === "Username") {
            toast.error("You must be logged in to bet!");
        } else if (betAmount === "") {
            toast.error("Please enter an amount to bet!");
        } else if (betAmount < 0.01) {
            toast.error("Bet amount must be greater than 0.01!");
        } else if (betAmount > balance) {
            toast.error("You don't have enough money to bet that amount! your balance is $" + balance);
        } else {
            crash.emit('bet', {
                amount: betAmount,
                username: username,
                avatar: userAvatar,
                cashedOut: false
            });
            toast.success("Bet placed!");
            amount_input.disabled = true;
            cash_out_input.disabled = true;

            amount_input.style.display = 'none';
            cash_out_input.style.display = 'none';

            document.getElementById('crash-amount').value = "";
            document.getElementById('crash-cash-out').value = "";
        }

    }

    const handleCashOut = (e) => {
        e.preventDefault();

        const username = document.getElementById('username').innerHTML;

        const cashOutAmount = document.getElementById('cashOut-button').innerHTML;

        crash.emit('cashOut', {
            username: username,
            cashOut: cashOutAmount
        });

        let cash_out_button = document.getElementById('cashOut-button');
        cash_out_button.style.display = 'none';

        toast.success("You Won " + cashOutAmount);

    }

    crash.on('countdown', (data) => {
        let countdown = document.getElementById('countdown');
        countdown.style.display = 'flex';
        countdown.innerHTML = 'Game starting in ' + data.countdown;

        if (data.countdown <= 0) {
            countdown.style.display = 'none';
        }

        if (data.countdown <= 3) {
            let amount_input = document.getElementById('crash-amount');
            let cash_out_input = document.getElementById('crash-cash-out');
            amount_input.disabled = true;
            cash_out_input.disabled = true;

            amount_input.style.display = 'none';
            cash_out_input.style.display = 'none';
        }
    });

    crash.on('update-counter', (data) => {

        let output = document.getElementById('random-output');
        let border = document.querySelector('.left-side-content-random-number');

        output.innerHTML = parseFloat(data.counter).toFixed(2);
        output.style.fontSize = '100px';
        border.style.border = '4px solid #0A0A0B';
        output.style.color = '#EDEAE5';

        crash.on('bet-cashed-out', (data) => {
            
        });

        if (data.counter >= 2.00) {
            output.style.animationIterationCount = 'infinite';
            border.style.border = '4px solid #44CE6B';
        }

        if (data.counter >= 10.00) {
            border.style.border = '4px solid #4F44CE';
        }

        if (data.counter >= 50.00) {
            border.style.border = '4px solid #FFCC3F';
        }


        let amount_input = document.getElementById('crash-amount');
        let cash_out_input = document.getElementById('crash-cash-out');

        amount_input.disabled = true;
        cash_out_input.disabled = true;

        amount_input.style.display = 'none';
        cash_out_input.style.display = 'none';

        let cash_out_button = document.getElementById('cashOut-button');
        let cashOutAmount = output.innerHTML.replace('$', '');
        cash_out_button.innerHTML = parseFloat(cashOutAmount * active_bet).toLocaleString('en-US', { style: 'currency', currency: 'USD' });





        setTimeout(() => {

            let bets = document.querySelectorAll('.bet');
            let usernameList = [];

            for (let i = 0; i < bets.length; i++) {
                let username = bets[i].querySelector('.player-info p').innerHTML;
                usernameList.push(username);
            }

            for (let i = 0; i < usernameList.length; i++) {
                let username = usernameList[i];
                let count = 0;
                for (let j = 0; j < bets.length; j++) {
                    let currentUsername = bets[j].querySelector('.player-info p').innerHTML;
                    if (currentUsername === username) {
                        count++;
                        if (count > 1) {
                            bets[j].remove();
                        }
                    }
                }
            }

        }, 200);

    });

    crash.on('round', (data) => {

        let parent_container = document.querySelector('.recent-crashes');

        data.crashes.forEach((crash) => {
            let recent_crash = document.createElement('div');
            recent_crash.classList.add('crash');
            recent_crash.classList.add('animate__animated', 'animate__fadeInLeft');
            // create a p element
            let crash_number = document.createElement('p');
            crash_number.innerHTML = crash.number;
            recent_crash.appendChild(crash_number);
            parent_container.appendChild(recent_crash);

            if (parent_container.childElementCount > 9) {
                parent_container.removeChild(parent_container.firstChild);
            }

            if (crash.number < 2.00) {
                crash_number.style.color = '#DD4742';
            }

            if (crash.number >= 2.00) {
                crash_number.style.color = '#44CE6B';
            }

            if (crash.number >= 10.00) {
                crash_number.style.color = '#4F44CE';
            }

            if (crash.number >= 50.00) {
                crash_number.style.color = '#FFCC3F';
            }

        }
        );
    });

    crash.on('updated-balance-minus', (data) => {

        setTimeout(() => {
            let balance = document.querySelector('.balance');
            balance.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            let fixed_Amount = data.balance.$numberDecimal.replace('$', '');
            let fixed_Amount2 = fixed_Amount.replace(',', '');
            let final_balance = parseFloat(fixed_Amount2);

            setBalance(final_balance);
        }, 1500);

    });

    crash.on('updated-balance-plus', (data) => {
        let balance = document.querySelector('.balance');
        balance.innerHTML = parseFloat(data.balance.$numberDecimal).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        let fixed_Amount = data.balance.$numberDecimal.replace('$', '');
        let fixed_Amount2 = fixed_Amount.replace(',', '');
        let final_balance = parseFloat(fixed_Amount2);

        setBalance(final_balance);
    });

    crash.on('crashed', (data) => {
        let output = document.getElementById('random-output');
        let border = document.querySelector('.left-side-content-random-number');
        output.innerHTML = "CRASHED AT " + parseFloat(data.randomNumber).toFixed(2) + "x";
        output.style.fontSize = '64px';

        output.style.animationIterationCount = 'unset';
        border.style.border = '4px solid #DD4742';
        output.style.color = '#DD4742';

        const crashBets = document.querySelector('.crash-bets');
        crashBets.querySelectorAll('*').forEach(n => n.remove());


        let amount_input = document.getElementById('crash-amount');
        let cash_out_input = document.getElementById('crash-cash-out');

        amount_input.style.display = 'flex';
        cash_out_input.style.display = 'flex';

        amount_input.disabled = false;
        cash_out_input.disabled = false;

        let cash_out_button = document.getElementById('cashOut-button');
        cash_out_button.style.display = 'none';

        setBet(0.00);

    });

    crash.on('active-bets', (data) => {

        let cash_out_button = document.getElementById('cashOut-button');


        cash_out_button.style.display = 'none';


        data.activeBets.forEach((bet) => {


            let active_bet = document.createElement('div');
            active_bet.classList.add('bet');
            active_bet.classList.add('animate__animated', 'animate__fadeInLeft');


            let bet_player_info = document.createElement('div');
            bet_player_info.classList.add('player-info');

            let bet_player_avatar = document.createElement('img');
            if (bet.avatar === null) {
                bet_player_avatar.src = avatar;
            } else {
                bet_player_avatar.src = bet.avatar;
            }

            let bet_player_username = document.createElement('p');
            bet_player_username.innerHTML = bet.username;

            bet_player_info.appendChild(bet_player_avatar);
            bet_player_info.appendChild(bet_player_username);


            let bet_amount_info = document.createElement('div');
            bet_amount_info.classList.add('amount-info');

            let bet_amount_sol = document.createElement('img');
            bet_amount_sol.src = sol;
            bet_amount_sol.style.width = '20px';
            bet_amount_sol.style.height = '20px';

            let bet_amount = document.createElement('p');
            bet_amount.innerHTML = parseFloat(bet.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            bet_amount_info.appendChild(bet_amount_sol);
            bet_amount_info.appendChild(bet_amount);

            let bet_profit_info = document.createElement('div');
            bet_profit_info.classList.add('profit-info');

            let bet_profit = document.createElement('p');
            bet_profit.innerHTML = 'in progress'
            bet_profit.classList.add('bet-profit');

            bet_profit_info.appendChild(bet_profit);

            active_bet.appendChild(bet_player_info);
            active_bet.appendChild(bet_amount_info);
            active_bet.appendChild(bet_profit_info);

            let active_bets_container = document.querySelector('.crash-bets');
            active_bets_container.appendChild(active_bet);

            if (bet.username === document.getElementById('username').innerHTML) {
                cash_out_button.innerHTML = bet.amount;
                setBet(bet.amount);

                cash_out_button.style.display = 'flex';
                cash_out_button.style.justifyContent = 'center';
                cash_out_button.style.alignItems = 'center';
            }

        });


    });

    return (
        <div className='App'>
            <title>TID Crash</title>

            <SideMenu />

            <div className='crash-container'>
                <Navbar />

                <div className='crash-content'>

                    <div className='crash-content-area'>

                        <div className='left-side'>

                            <div className='left-side-content'>

                                <div className='left-side-content-information'>

                                    <div className='bankroll'>

                                        <h3>Bankroll</h3>

                                        <p>$284,176,093</p>

                                    </div>

                                    <div className='recent-crashes'>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                        <div className='crash animate__animated animate__fadeInLeft'>

                                            <p>0.00x</p>

                                        </div>

                                    </div>

                                </div>

                                <div className='left-side-content-random-number'>

                                    <p id="random-output">0.00</p>

                                    <p id="countdown"></p>

                                </div>

                                <div className="left-side-content-bet-area">

                                    <div className="cash-out-button">

                                        <button id="cashOut-button" onClick={handleCashOut}>Cash Out</button>

                                    </div>

                                    <div className="betting-inputs">

                                        <div className="betting-input-amount">

                                            <div className="header">

                                                <p>Amount</p>

                                            </div>

                                            <div className="content">

                                                <div className="left-side-inputs">

                                                    <img src={sol} alt="sol" />

                                                    <input type="number" placeholder="0.00" id="crash-amount" />

                                                </div>

                                                <div className="right-side-inputs">

                                                    <button>/2</button>

                                                    <button>x2</button>

                                                    <button>Max</button>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="betting-input-cash-out">

                                            <div className="header">

                                                <p>Auto Cash Out</p>

                                            </div>

                                            <div className="content">

                                                <div className="left-side-cash">

                                                    <input type="number" placeholder="0.00" id="crash-cash-out" />

                                                </div>

                                                <div className="right-side-cash">

                                                    <p>X</p>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="betting-input-make-bet">

                                            <button onClick={HandleBet}>Make Bet</button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className='right-side'>

                            <div className='right-side-content'>

                                <div className='information'>

                                    <div className='information-players'>

                                        <div className='information-players-amount'>

                                            <img src={green_circle} alt='green_circle' />

                                            <div className="active-players">

                                                <p>0 / 0</p>

                                                <h1> Players</h1>

                                            </div>

                                        </div>

                                        <div className='information-players-total-bet-size'>

                                            <p className="user-bet-amount-total animate__animated animate__fadeIn">$0</p>

                                        </div>

                                    </div>

                                    <div className='information-descriptions'>

                                        <div className="player">

                                            <p>Player</p>

                                        </div>

                                        <div className="amount">

                                            <p>Amount</p>

                                        </div>

                                        <div className="profit">

                                            <p>Profit</p>

                                        </div>

                                    </div>

                                </div>

                                <div className="crash-bets" ref={crashBetsRef} onMouseOver={handleMouseOver}>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <Footer />

            </div>

            <SideChat />

        </div>
    );

}

export default Crash;