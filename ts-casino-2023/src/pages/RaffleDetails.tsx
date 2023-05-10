import React, { useState, useEffect } from "react";
import { SideMenu } from '../components/SideMenu.js'
import { Navbar } from '../components/Navbar.js'
import { Footer } from '../components/Footer.js';
import { SideChat } from '../components/SideChat.js';
import { useParams } from "react-router-dom";
import io from "socket.io-client";

import '../styles/raffledetails.css'
import { toast } from "react-toastify";

  // const socket = io('casino-server.fly.dev/raffles');
  const socket = io("http://localhost:4000/raffles");

function RaffleDetails() {
  const [raffle, setRaffle] = useState(null);
  const { id } = useParams();

  const [raffles_info, setRafflesInfo] = useState([]);

  useEffect(() => {

    socket.emit("raffle-details", { id });

    socket.on("raffle-details", (data) => {
      setRaffle(true);
      setRafflesInfo(data.raffle);
    });

  }, [id, socket]);

  const handleMinusTicket = () => {
    const ticketQuantity = document.getElementById('ticket-quantity');
    if (ticketQuantity.value > 1) {
      ticketQuantity.value = parseInt(ticketQuantity.value) - 1;
    } else {
      toast.error('You can\'t buy less than 1 ticket');
    }
  }

  const handlePlusTicket = () => {
    const ticketQuantity = document.getElementById('ticket-quantity');
    if (ticketQuantity.value < 10) {
      ticketQuantity.value = parseInt(ticketQuantity.value) + 1;
    } else {
      toast.error('You can\'t buy more than 10 tickets');
    }
  }

  const handleGetTickets = () => {
    const ticketQuantity = document.getElementById('ticket-quantity');
    const username = document.getElementById('username').innerHTML;

    if (username === 'Username') {
      toast.error('You need to login to buy tickets');
    } else {
      toast.promise(
        new Promise((resolve, reject) => {
          socket.emit("buy-tickets", { id, username: username, tickets: ticketQuantity.value });
          socket.on("tickets-bought", (data) => {
            if (data.error) {
              reject(data.error);
            } else {
              resolve(data.success);
            }
          });
        }),
        {
          pending: "Buying tickets...",
          success: "Tickets bought successfully!",
          error: "Error buying tickets",
        }
      );
    }
  }

  if (raffle === null) {
    return (
      <div className='App'>
        <title>TID Crash</title>

        <SideMenu />

        <div className='raffle-details-container'>

          <Navbar />

          <div className='raffle-details-content loading'>

            <span class="loader"></span>

          </div>

          <Footer />

        </div>

        <SideChat />

      </div>
    );
  }

  return (
    <div className='App'>
      <title>TID Crash</title>

      <SideMenu />

      <div className='raffle-details-container'>

        <Navbar />

        <div className='raffle-details-content'>

          <div className='raffles-content-title'>

            <h2>Raffles</h2>

          </div>

          <div className='raffles-content-area'>

            <div className='raffle-information'>

              <div className='raffle-image'>

                <img src={raffles_info.image} alt='Raffle' />

              </div>

              <div className='raffle-info'>

                <div className="NFT-creator">

                  <img src={raffles_info.creator_logo} alt="Creator" />

                  <div className="NFT-creator-info">

                    <h3>{raffles_info.name}</h3>

                    <p>By {raffles_info.creator}</p>

                  </div>

                  <div className="NFT-rank">

                    <p>Rank {raffles_info.rank}</p>

                  </div>

                </div>

                <div className="raffle-data">

                  <div className="left-side-raffle-data">

                    <div className="raffle-data-cost">

                      <h3> <strong>{raffles_info.price}</strong> BLAZED </h3>

                    </div>

                    <div className="raffle-data-participants">

                      <h3> {raffles_info.participants} / {raffles_info.maxParticipants}</h3>

                    </div>

                  </div>

                  <div className="right-side-raffle-data">

                    <div className="raffle-data-tickets">

                      <button onClick={handleMinusTicket} >-</button>

                      <input type="number" value="1" id="ticket-quantity" />

                      <button onClick={handlePlusTicket} >+</button>

                    </div>

                    <button className="raffle-data-buy" onClick={handleGetTickets}>Get Tickets</button>

                  </div>

                </div>

                <div className="NFT-attributes">

                  <div className="NFT-attributes-title">

                    <h3>Attributes</h3>

                  </div>

                  <div className="NFT-attributes-list">

                    {raffles_info.attributes.map((attribute) => (

                      <div className="NFT-attributes-list-item">

                        <div className="NFT-attributes-list-item-header">

                            <h3>{attribute.section}</h3>

                            <span>{attribute.percentage}</span>

                        </div>

                        <div className="NFT-attributes-list-item-value">

                          <span>{attribute.id}</span>

                        </div>

                      </div>

                    ))}

                  </div>

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

export default RaffleDetails;
