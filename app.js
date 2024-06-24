import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('chat', async (data) => {
        if (data.message.startsWith('!p ')) {
            const prompt = data.message.slice(3).trim();
            console.log(JSON.stringify({ input: prompt }));
            try {
                // Make a POST request to the prediction endpoint
                const response = await fetch('http://localhost:4000/api/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ input: prompt })
                });

                if (!response.ok) {
                    throw new Error('Failed to predict');
                }

                const prediction = await response.json();
                console.log(prediction.prediction);  // Corrected access to prediction data
                io.sockets.emit('chat', { username: 'CodeAI', message: prediction.prediction });  // Emit the prediction message

            } catch (error) {
                console.error('Error predicting:', error.message);
                // Handle error response or emit an error event to the client
            }
        } else {
            // Broadcast chat message to all clients
            io.sockets.emit('chat', data);
            console.log("chat", data)
        }
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
});

const port = process.env.PORT || 3000;
server.listen(process.env.PORT || port, () => console.log(`Server running on port ${port}`));
