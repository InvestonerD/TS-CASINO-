import React, { useState, useEffect } from "react";
import { SideMenu } from '../components/SideMenu.js'
import { Navbar } from '../components/Navbar.js'
import { Footer } from '../components/Footer.js';
import { SideChat } from '../components/SideChat.js';

import RoulettePro from 'react-roulette-pro';
import 'react-roulette-pro/dist/index.css';

import { toast } from 'react-toastify';
import '../styles/jackpot.css'



const prizes = [
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "00",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200x.png",
    "text": "0x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "02",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.2x.png",
    "text": "0.2x"
  },
  {
    "id": "05",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%200.5x.png",
    "text": "0.5x"
  },
  {
    "id": "1",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%201x.png",
    "text": "1x"
  },
  {
    "id": "2",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%202x.png",
    "text": "2x"
  },
  {
    "id": "5",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%205x.png",
    "text": "5x"
  },
  {
    "id": "10",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%2010x.png",
    "text": "10x"
  },
  {
    "id": "25",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%2025x.png",
    "text": "25x"
  },
  {
    "id": "50",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%2050x.png",
    "text": "50x"
  },
  {
    "id": "100",
    "image": "https://raw.githubusercontent.com/InvestonerD/TIMD-images/main/FRAME%20100x.png",
    "text": "100x"
  }
];

const winPrizeIndex = 0;

const reproductionArray = (array = [], length = 0) => [
  ...Array(length)
    .fill('_')
    .map(() => array[Math.floor(Math.random() * array.length)]),
];

const reproducedPrizeList = [
  ...prizes,
  ...reproductionArray(prizes, prizes.length * 3),
  ...prizes,
  ...reproductionArray(prizes, prizes.length),
];

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;

const prizeList = reproducedPrizeList.map((prize) => ({
  ...prize,
  id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : generateId(),
}));


function Jackpot () {

  const [start, setStart] = useState(false);

  const prizeIndex = Math.floor(Math.random() * prizeList.length);

  const handleStart = () => {
    setStart((prevState) => !prevState);
  };

  const handlePrizeDefined = () => {
    toast.success('You won ' + prizeList[prizeIndex].text + ' your bet!');
  };

  return (
    <div className="App">
      
      <SideMenu />

      <div className="raffles-container">

        <Navbar />

        <div className="raffles-content">

          <RoulettePro
            prizes={prizeList}
            prizeIndex={prizeIndex}
            start={start}
            onPrizeDefined={handlePrizeDefined}
            spinningTime={5}
            onSpinStart={handleStart}
            winPrizeIndex={winPrizeIndex}

            options={{
              stopInCenter: false,
            }}
          />

          <button onClick={handleStart}>Start</button>

        </div>

        <Footer />

      </div>

      <SideChat />
    </div>
  );
}

export default Jackpot;