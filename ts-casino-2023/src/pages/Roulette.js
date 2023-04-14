import React, { useEffect, useState } from 'react';
import { SideMenu } from '../components/SideMenu.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { SideChat } from '../components/SideChat.js';
import '../styles/roulette.css';

import { Wheel } from 'react-custom-roulette';

import { toast } from 'react-toastify';

import arrow from '../images/design/wheel-arrow.svg';

const data = [
    { option: '100x', style: { backgroundColor: '#FFCC3F', textColor: 'transparent', id: 'Yellow' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '3x', style: { backgroundColor: '#DD4742', textColor: 'transparent', id: 'Red' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
    { option: '5x', style: { backgroundColor: '#529EC7', textColor: 'transparent', id: 'Blue' } },
    { option: '2x', style: { backgroundColor: '#6E6E78', textColor: 'transparent', id: 'Gray' } },
];

function Roulette() {

    const [mustSpin, setMustSpin] = useState(false);

    const prizeNumber = Math.floor(Math.random() * data.length);

    const handleSpinComplete = () => {
        setMustSpin(true);

        const arrow = document.querySelector('.roulette-arrow');

        arrow.style.filter = 'brightness(0) saturate(100%) invert(89%) sepia(19%) saturate(46%) hue-rotate(359deg) brightness(101%) contrast(96%)'
    };

    const handleReset = () => {
        setMustSpin(false);
        toast.success(`You won ${data[prizeNumber].option}!`);

        const arrow = document.querySelector('.roulette-arrow');

        if (data[prizeNumber].style.id === 'Gray') {
            arrow.style.filter = 'brightness(0) saturate(100%) invert(53%) sepia(2%) saturate(1741%) hue-rotate(202deg) brightness(81%) contrast(92%)'
        } else if (data[prizeNumber].style.id === 'Red') {
            arrow.style.filter = 'brightness(0) saturate(100%) invert(49%) sepia(68%) saturate(3490%) hue-rotate(331deg) brightness(86%) contrast(102%)'
        } else if (data[prizeNumber].style.id === 'Blue') {
            arrow.style.filter = 'brightness(0) saturate(100%) invert(70%) sepia(16%) saturate(1293%) hue-rotate(160deg) brightness(79%) contrast(96%)'
        } else if (data[prizeNumber].style.id === 'Yellow') {
            arrow.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(13%) saturate(6489%) hue-rotate(328deg) brightness(115%) contrast(111%)'
        }

    };

    return (

        <div className='App'>
            <title>TID Roulette</title>

            <SideMenu />

            <div className='roulette-container'>

                <Navbar />

                <div className='roulette-content'>

                    <div className='roulette-content-area'>

                        <div className='roulette-wheel'>

                            <Wheel className='wheel'
                                mustStartSpinning={mustSpin}
                                prizeNumber={prizeNumber}
                                data={data}
                                textColors={['transparent', 'transparent']}
                                onStopSpinning={handleReset}
                                innerRadius={95}
                                radiusLineWidth={4}
                                radiusLineColor={'#131315'}
                                outerBorderColor={'transparent'}
                                fontColor={'transparent'}
                            />

                            <img className='roulette-arrow' src={arrow} alt='arrow' />

                        </div>

                        <button className='roulette-button' onClick={handleSpinComplete}>Spin</button>

                    </div>

                </div>

                <Footer />

            </div>

            <SideChat />

        </div>

    );

}

export default Roulette