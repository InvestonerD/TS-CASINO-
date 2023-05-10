import React, { useState, useEffect } from "react";
import { SideMenu } from '../components/SideMenu.js'
import { Navbar } from '../components/Navbar.js'
import { Footer } from '../components/Footer.js';
import { SideChat } from '../components/SideChat.js';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import '../styles/raffles.css'

    // const socket = io('casino-server.fly.dev/raffles');
    const socket = io("http://localhost:4000/raffles");

function Raffles() {

    const [raffles, setRaffles] = useState([]);


        socket.on("raffles", (data) => {
            setRaffles(data.raffles);
        });


    return (

        <div className='App'>
            <title>TID Crash</title>

            <SideMenu />

            <div className='raffles-container'>

                <Navbar />

                <div className='raffles-content'>

                    <div className='raffles-content-title'>

                        <span>Raffles</span>

                    </div>

                    <div className='raffles-content-area'>

                        <div className='raffles-cards'>
                            {raffles.map((raffle) => (
                                <Link key={raffle._id} to={`/raffles/${raffle._id}`} className='raffle-card'>
                                    <div className='image-container' style={{ backgroundImage: `url(${raffle.image})` }}>
                                        <div className="price-tag">
                                            <h3 id="quantity">{raffle.price}</h3>
                                            <span>BLAZED</span>
                                        </div>
                                    </div>
                                    <div className='info-container'>
                                        <div className='NFT-name'>
                                            <span>{raffle.name}</span>
                                        </div>
                                        <div className='raffle-count'>
                                            <h3>{raffle.participants} / {raffle.maxParticipants}</h3>
                                            <span><strong>{raffle.winnerCount}</strong> Winner</span>
                                        </div>
                                    </div>
                                    <div className='raffle-button'>
                                        <span>Enter Raffle</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                    </div>

                </div>

                <Footer />

            </div>

            <SideChat />

        </div>

    );

}

export default Raffles;
