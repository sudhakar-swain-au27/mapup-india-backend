import http from 'http';
import app from './app.js';
import configureSocket from './config/socket.js';

const PORT = process.env.PORT || 9000;
const server = http.createServer(app);

configureSocket(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
