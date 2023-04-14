import React from "react";
import { SideMenu } from '../components/SideMenu.js'
import { Navbar } from '../components/Navbar.js'
import { SideChat } from '../components/SideChat.js';
import { Footer } from '../components/Footer.js';

import '../styles/battles.css'

function NFTsBattles() {
    return (

    <div className="App">
        <title>TID Case Battles</title>

        <SideMenu />

        <div className="battles-container">

            <Navbar />

            <div className="battles-content">

                <div className="battles-content-title">

                    <h1>NFTs Case Battles</h1>

                </div>

                <div className="battles-content-cards">

                    <div className="battles-content-description">

                        <div className="rounds">

                            <h2>Rounds</h2>

                        </div>

                        <div className="cases">

                            <h2>Cases</h2>

                        </div>

                        <div className="cost">

                            <h2>Cost</h2>

                        </div>

                        <div className="players">

                            <h2>Players</h2>

                        </div>

                        <div className="status">

                            <h2>Status</h2>

                        </div>

                    </div>

                    <div className="battle-card">

                        <div className="rounds">

                            <div className="polygon-number">

                                <h2>1</h2>

                            </div>

                            <div className="card-status">

                                <h4>PENDING</h4>

                            </div>

                        </div>

                        <div className="cases">

                            <div className="card-cases">
                            </div>

                        </div>

                        <div className="cost">
                        </div>

                        <div className="players">
                        </div>

                        <div className="status">
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

export default NFTsBattles;