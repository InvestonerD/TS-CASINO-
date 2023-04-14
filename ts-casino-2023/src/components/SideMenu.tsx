import { useState, useLayoutEffect } from "react";
import '../styles/sidemenu.css'
import 'animate.css';
import hamburger_menu from '../images/icons/menu-burger.svg'
import close_menu from '../images/icons/cross.svg'
import TID_logo from '../images/icons/TID.png'
import cards from '../images/icons/cards.svg'
import sports from '../images/icons/sports.svg'
import tickets from '../images/icons/tickets.svg'
import exchange from '../images/icons/exchange.svg'
import promotions from '../images/icons/promotions.svg'
import vip from '../images/icons/vip.svg'
import affiliates from '../images/icons/affiliates.svg'
import case_battles from '../images/icons/case-battles.svg'
import probably_fair from '../images/icons/probably-fair.svg'
import information from '../images/icons/information.svg'
import sponsorships from '../images/icons/sponsorships.svg'
import live_support from '../images/icons/live-support.svg'
import world from '../images/icons/global.svg'

const SideMenu = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [homeContainerWidth, setHomeContainerWidth] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("");

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    const handleIconClick = (iconName: string, pageUrl: string) => {
        setSelectedIcon(iconName);
        window.location.href = pageUrl;
    };

    useLayoutEffect(() => {
        if (isOpen) {
            setHomeContainerWidth("calc(100% - 64px)");
        } else {
            setHomeContainerWidth("calc(100% - 260px)");
        }

        if (!isOpen && document.querySelector(".side-chat")?.classList.contains("close")) {
            setHomeContainerWidth("calc(100% - 620px)");
        }
    }, [isOpen]);

    return (

        <div className={isOpen ? "side-menu open animate__animated animate__fadeInLeft" : "side-menu animate__animated animate__fadeInLeft"}>

            <div className="first-module">

                <div className="icon-container" onClick={handleMenuClick}>

                    <img src={hamburger_menu} alt="hamburger_menu" />

                    <img src={close_menu} alt="hamburger_menu" />

                </div>

                <div className="title">

                    <p className="animate__animated animate__fadeIn" onClick={() => window.location.href = '/'}>TID CASINO</p>

                </div>

            </div>

            <div className="module-container">

                <div className="second-module">

                    <div className="icon-container">

                        <img src={TID_logo} alt="TID_logo" />

                        <p>Dashboard</p>

                    </div>

                </div>

                <div className="third-module">

                    <div className="icon-container">
                        <img src={cards} alt="TID_logo" />
                        <p className={`animate__animated animate__fadeIn ${selectedIcon === "Casino" ? "selected" : ""}`} onClick={() => handleIconClick("Casino", "/casino")}>Casino</p>
                    </div>

                    <div className="icon-container">
                        <img src={sports} alt="TID_logo" />
                        <p className={`animate__animated animate__fadeIn ${selectedIcon === "Sports" ? "selected" : ""}`} onClick={() => handleIconClick("Sports", "/sports")}>Sports</p>
                    </div>

                    <div className="icon-container" onClick={() => handleIconClick("Raffles", "/raffles")}>
                        <img src={tickets} alt="TID_logo" />
                        <p className={`animate__animated animate__fadeIn ${selectedIcon === "Raffles" ? "selected" : ""}`}>Raffles</p>
                    </div>

                </div>

                <div className="fourth-module">

                    <div className="icon-container">

                        <img src={exchange} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Exchange</p>

                    </div>

                    <div className="icon-container">

                        <img src={promotions} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Promotions</p>

                    </div>

                    <div className="icon-container">

                        <img src={vip} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">VIP</p>

                    </div>

                    <div className="icon-container">

                        <img src={affiliates} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Affiliates</p>

                    </div>

                    <div className="icon-container">

                        <img src={case_battles} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Battles</p>

                    </div>

                    <div className="icon-container">

                        <img src={probably_fair} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Fairness</p>

                    </div>

                    <div className="icon-container">

                        <img src={information} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Information</p>

                    </div>

                </div>

                <div className="fifth-module">

                    <div className="icon-container">

                        <img src={sponsorships} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Sponsorships</p>

                    </div>

                    <div className="icon-container">

                        <img src={live_support} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Support</p>

                    </div>

                </div>

                <div className="six-module">

                    <div className="icon-container">

                        <img src={world} alt="TID_logo" />

                        <p className="animate__animated animate__fadeIn">Language</p>

                    </div>

                </div>

            </div>

        </div>


    )

}

export { SideMenu };