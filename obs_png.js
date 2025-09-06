
const avatar = document.getElementById("avatar");

// Conectamos al servidor WebSocket que corre en Node.js
const ws = new WebSocket("ws://localhost:8080");
console.log("Inicia");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.image) {
        avatar.src = data.image;
    }
};
