import React, { useState, useEffect } from "react";
import { SideMenu } from "../components/SideMenu.js";
import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";
import { SideChat } from "../components/SideChat.js";
import { toast } from "react-toastify";
import "animate.css";
import "../styles/coinflip.css";

import head from '../images/design/HEADS-CF.png';
import tails from '../images/design/BLAZED-CF.png';

function Coinflip() {

  const [winner, setWinner] = useState("");

  const flipCoin = () => {
    const random = Math.floor(Math.random() * 2);
    const coin = document.getElementById("coin");

    if (random === 0) {
      coin.classList.add("heads");
      setWinner("heads");
    } else {
      coin.classList.add("tails");
      setWinner("tails");
    }
  };

  useEffect(() => {
    if (winner !== "") {
      toast.success("The winner is " + winner + "!");
    }
  }, [winner]);

  return (
    <div className="App">
      <title>TID Coin Flip</title>
      <SideMenu />
      <div className="coinflip-container">
        <Navbar />
        <div className="coinflip-content">
          <div className="coinflip-content-area">
            <div className="coin-display">
              <div className="coin" id="coin">
                <img src={head} alt="heads" className="side-a" />
                <img src={tails} alt="tails" className="side-b" />
              </div>
            </div>
          </div>
          <button className="coinflip-button" id="coinflip-button" onClick={flipCoin}>Flip</button>
        </div>
        <Footer />
      </div>
      <SideChat />
    </div>
  );
}

export default Coinflip;
