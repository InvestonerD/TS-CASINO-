import React from "react";
import { SideMenu } from '../components/SideMenu';
import { Navbar } from '../components/Navbar';
import { SideChat } from '../components/SideChat';
import { Footer } from '../components/Footer';
import '../styles/exchange.css';

import ExchangeModule from '../extras/exchange_module';

function Exchange(): JSX.Element {

  return (

    <div className='App'>

        <title>TID Exchange</title>

        <SideMenu />

        <div className='exchange-container'>

            <Navbar />

            <div className='exchange-content'>

                <ExchangeModule />

            </div>

            <Footer />

        </div>

        <SideChat />

    </div>

  );
}

export default Exchange;