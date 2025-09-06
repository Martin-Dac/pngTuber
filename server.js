import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import WebSocket from "ws";
import "dotenv/config";

const obs = new OBSWebSocket();
const wss = new WebSocket.Server({ port: 8080 }); // Servidor para el widget

const idleImg = process.env.IDLE_IMG; // boca cerrada
const talkingImg = process.env.TALKING_IMG; // boca abierta
const port = process.env.PORT || 4455;
const password = process.env.PASSWORD || "1234";
const ip = process.env.IP || "localhost";
const HOLD_TIME = 1000;
const TALKING_THRESHOLD = 0.02; // Ajusta este valor según sea necesario
const SILENCE_THRESHOLD = 0.01; // Ajusta este valor según sea necesario

let holdUntil = 0;
let isTalking = false;
let imgName;

(async () => {
  try {
    await obs.connect(`ws://${ip}:${port}`, password, {
      eventSubscriptions: EventSubscription.InputVolumeMeters,
      rpcVersion: 1,
    }); // URL y contraseña
    console.log("Conectado a OBS");

    obs.on("InputVolumeMeters", (data) => {
      const mic = data.inputs.find((i) => i.inputName === "Mic/Aux");

      if (mic) {
        const flat = mic.inputLevelsMul.flat();
        const volume = Math.max(...flat);

        const now = Date.now();

        if (isTalking) {
          if (now > holdUntil) {
            if (volume < SILENCE_THRESHOLD) {
              // Si deja de hablar, cambio inmediato
              console.log(now, holdUntil);
              imgName = idleImg;
              isTalking = false;
            }
          }
        } else {
          if (volume > TALKING_THRESHOLD) {
            console.log(now, holdUntil);
            imgName = talkingImg;
            isTalking = true;
            holdUntil = now + HOLD_TIME;
          }
        }

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ image: imgName }));
          }
        });
      }
    });
  } catch (err) {
    console.log("Error de conexión a OBS:");
    console.error(err);
  }
})();
