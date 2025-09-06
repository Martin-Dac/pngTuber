
const avatar = document.getElementById("avatar");

// Conectamos al servidor WebSocket que corre en Node.js
const ws = new WebSocket("ws://localhost:8080");
console.log("Inicia");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.image) {
        console.log(data.image);
        avatar.src = data.image;
    }
};
