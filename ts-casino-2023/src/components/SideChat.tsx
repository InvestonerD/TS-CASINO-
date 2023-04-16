import React, { useState, useEffect } from "react";
import "../styles/sidechat.css";
import "animate.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import emoji from "../images/icons/emoji.svg";
import send from "../images/icons/send.svg";
import rain from "../images/icons/rain.svg";
import command from "../images/icons/command.svg";
import tips from "../images/icons/tips.svg";
import gifs from "../images/icons/gif.svg";
import avatar from "../images/design/avatar.png";

import io from "socket.io-client";
import { toast } from "react-toastify";

// const socket = io("casino-server.fly.dev/general");
const socket = io("http://192.168.100.41:4000/general");

socket.on("all-chat-messages", (data: { messages: { username: string, timestamp: number, message: string }[] }) => {
    data.messages.sort((a, b) => a.timestamp - b.timestamp);
    data.messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');

        const leftSideElement = document.createElement('div');
        leftSideElement.classList.add('left-side');
        messageElement.appendChild(leftSideElement);

        const avatarElement = document.createElement('div');
        avatarElement.classList.add('avatar');
        leftSideElement.appendChild(avatarElement);

        const avatarImageElement = document.createElement('img');
        avatarImageElement.src = avatar;
        avatarElement.appendChild(avatarImageElement);

        const rightSideElement = document.createElement('div');
        rightSideElement.classList.add('right-side');
        messageElement.appendChild(rightSideElement);

        const headerElement = document.createElement('div');
        headerElement.classList.add('header');
        rightSideElement.appendChild(headerElement);

        const usernameElement = document.createElement('div');
        usernameElement.classList.add('username');
        headerElement.appendChild(usernameElement);

        const usernameTextElement = document.createElement('p');
        usernameTextElement.classList.add('message-username');
        usernameTextElement.innerText = message.username;
        usernameElement.appendChild(usernameTextElement);

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        headerElement.appendChild(timeElement);

        const timeTextElement = document.createElement('p');
        timeTextElement.classList.add('message-time');
        const date = new Date(message.timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        timeTextElement.innerText = `${hours}:${minutes}`;
        timeElement.appendChild(timeTextElement);

        const messageContentElement = document.createElement('div');
        messageContentElement.classList.add('message');
        rightSideElement.appendChild(messageContentElement);

        const messageTextElement = document.createElement('p');
        messageTextElement.classList.add('message-text');
        messageTextElement.innerText = message.message;
        messageContentElement.appendChild(messageTextElement);

        const chatMessages = document.querySelector<HTMLElement>('.side-chat-body');
        if (chatMessages) {
            chatMessages.appendChild(messageElement);

            if (chatMessages.children.length > 30) {
                const firstChild = chatMessages.firstChild;
                if (firstChild) {
                    chatMessages.removeChild(firstChild);
                }
            }

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
});

socket.on("new-message", (data: { message: { username: string, timestamp: number, message: string } }) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');

    const leftSideElement = document.createElement('div');
    leftSideElement.classList.add('left-side');
    messageElement.appendChild(leftSideElement);

    const avatarElement = document.createElement('div');
    avatarElement.classList.add('avatar');
    leftSideElement.appendChild(avatarElement);

    const avatarImageElement = document.createElement('img');
    avatarImageElement.src = avatar;
    avatarElement.appendChild(avatarImageElement);

    const rightSideElement = document.createElement('div');
    rightSideElement.classList.add('right-side');
    messageElement.appendChild(rightSideElement);

    const headerElement = document.createElement('div');
    headerElement.classList.add('header');
    rightSideElement.appendChild(headerElement);

    const usernameElement = document.createElement('div');
    usernameElement.classList.add('username');
    headerElement.appendChild(usernameElement);

    const usernameTextElement = document.createElement('p');
    usernameTextElement.classList.add('message-username');
    usernameTextElement.innerText = data.message.username;
    usernameElement.appendChild(usernameTextElement);

    const timeElement = document.createElement('div');
    timeElement.classList.add('time');
    headerElement.appendChild(timeElement);

    const timeTextElement = document.createElement('p');
    timeTextElement.classList.add('message-time');
    const date = new Date(data.message.timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    timeTextElement.innerText = `${hours}:${minutes}`;
    timeElement.appendChild(timeTextElement);

    const messageContentElement = document.createElement('div');
    messageContentElement.classList.add('message');
    rightSideElement.appendChild(messageContentElement);

    const messageTextElement = document.createElement('p');
    messageTextElement.classList.add('message-text');
    messageTextElement.innerText = data.message.message;
    messageContentElement.appendChild(messageTextElement);

    const chatMessages = document.querySelector<HTMLElement>('.side-chat-body');
    if (chatMessages) {
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});


export const SideChat = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [buttonDisplay, setButtonDisplay] = useState("none");

    const handleEmojiSelect = (emoji: { native: string }) => {
        const newInputValue = inputValue + emoji.native;
        setInputValue(newInputValue);
        setShowPicker(false);
    };

    const handleSendMessage = () => {
        const usernameElement = document.getElementById("username");

        if (usernameElement) {
            const username = usernameElement.innerHTML;
            if (username === "Username") {
                toast.error("Please connect your wallet to send a message");
            } else if (inputValue === "") {
                toast.error("Please enter a message");
            } else {
                socket.emit('chat-message', {
                    message: inputValue,
                    username: username
                });
                setInputValue("");
            }
        }
    };

    useEffect(() => {
        if (inputValue !== "") {
            setButtonDisplay("flex");
        } else {
            setButtonDisplay("none");
        }

    }, [inputValue]);

    const emojiClass = showPicker ? "emoji-active" : "";

    if (showPicker) {
        const chatMessages = document.querySelector<HTMLElement>('.side-chat-body');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    return (

        <div className="side-chat close animate__animated animate__fadeInRight">

            <div className="side-chat-header">

                <div className="side-chat-header-title">

                    <p>Global Chat</p>

                </div>

            </div>

            <div className="side-chat-body">

                {showPicker && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}

            </div>

            <div className="side-chat-footer">

                <div className="side-chat-footer-input-section">

                    <div className="side-chat-footer-input">

                        <input
                            type="text"
                            placeholder="Type your message here"
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                        />

                        <img src={emoji} alt="emoji" onClick={() => setShowPicker(!showPicker)} className={emojiClass} />

                    </div>

                    <div className="side-chat-footer-button animate__animated animate__fadeInRight" style={{ display: buttonDisplay }}>

                        <button onClick={handleSendMessage}> <img src={send} alt="" /> </button>

                    </div>

                </div>

                <div className="side-chat-footer-extras-section">

                    <div className="side-chat-footer-extras-left-side">

                        <img src={rain} alt="rain" />

                        <img src={command} alt="/command" />

                        <img src={tips} alt="tips" />

                    </div>

                    <div className="side-chat-footer-extras-right-side">

                        <img src={gifs} alt="gifs" />

                    </div>

                </div>

            </div>

        </div>

    );

};
