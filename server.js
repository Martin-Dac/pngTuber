require('dotenv').config();
const OBSWebSocket = require('obs-websocket-js').default;
const WebSocket = require('ws');

const obs = new OBSWebSocket();
const wss = new WebSocket.Server({ port: 8080 }); // Servidor para el widget

(async () => {
  try {
    port = process.env.PORT || 4455;
    password = process.env.PASSWORD || '1234';
    ip = process.env.IP || 'localhost';
    await obs.connect(`ws://${ip}:${port}`, password); // URL y contraseña
    console.log("Conectado a OBS");

    obs.on('InputVolumeMeters', data => {
      const mic = data.inputs.find(i => i.inputName === "Mic/Aux");
      if (mic) {
        const volume = mic.inputLevelsMul[0];
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ volume }));
          }
        });
      }
    });

    // Suscribirse a los eventos
    await obs.call('StartListeningToInputs'); // Este método activa InputVolumeMeters
  } catch (err) {
    console.error(err);
  }
})();
