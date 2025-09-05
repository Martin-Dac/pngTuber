require('dotenv').config();

const avatar = document.getElementById("avatar");
const idleImg = process.env.IDLE_IMG;     // boca cerrada
const talkingImg = process.env.TALKING_IMG; // boca abierta

    // Conectamos al servidor WebSocket que corre en Node.js
const ws = new WebSocket("ws://localhost:8080");

ws.onmessage = (event) => {
    const { volume } = JSON.parse(event.data);
    if (volume > 0.02) { // Ajusta el umbral según tu micrófono
    avatar.src = talkingImg;
    } else {
    avatar.src = idleImg;
    }
};