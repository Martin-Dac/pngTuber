# pngTuber
Pequeño projecto para configurar un pngtuber simple en obs

Para iniciar el proyecto es necesario tener instalado Node e instalar las dependencias

El .env debe estar compuesto por obligatoriamente por:

- IDLE_IMG
- TALKING_IMG

Y opcionalmente por:

- IP
- PORT
- PASSWORD

Si estos campos no estan los valores por defectos seran_

- IP = localhost
- PORT = 4455
- PASSWORD = 1234

Una vez configurado el .env, tambien obs y haber instalado las dependencias con() se podra correr el server para el websocket con:

` node server.js `