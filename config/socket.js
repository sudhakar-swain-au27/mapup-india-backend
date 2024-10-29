    import { Server } from 'socket.io';

    const configureSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('disconnect', () => console.log('Client disconnected'));
    });

    return io;
    };

    export default configureSocket;
