import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import WebSocket from "ws";
import "dotenv/config";

const obs = new OBSWebSocket();
const wss = new WebSocket.Server({ port: 8080 }); // Servidor para el widget

const idleImg = process.env.IDLE_IMG; // boca cerrada
const talkingImg = process.env.TALKING_IMG; // boca abierta

(async () => {
  try {
    const port = process.env.PORT || 4455;
    const password = process.env.PASSWORD || "1234";
    const ip = process.env.IP || "localhost";

    await obs.connect(`ws://${ip}:${port}`, password, {
      eventSubscriptions: EventSubscription.InputVolumeMeters,
      rpcVersion: 1,
    }); // URL y contraseña
    console.log("Conectado a OBS");

    obs.on("InputVolumeMeters", (data) => {
      const mic = data.inputs.find((i) => i.inputName === "Mic/Aux");

      if (mic) {
        const volume = mic.inputLevelsMul[0];
        let imgName;

        if (volume > 0.02) {
          // Ajusta el umbral según tu micrófono
          console.log("Hablando", volume);
          imgName = talkingImg;
        } else {
          imgName = idleImg;
        }

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ image: imgName }));
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
