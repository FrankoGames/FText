const socket = io();

const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const sendButton = document.getElementById('send');

sendButton.addEventListener('click', () => {
    socket.emit('chat', {
        message: messageInput.value,
        username: usernameInput.value
    });
    messageInput.value = '';
});

messageInput.addEventListener('keypress', () => {
    socket.emit('typing', usernameInput.value);
});

socket.on('chat', (data) => {
    feedback.innerHTML = '';
    output.innerHTML += `<p><strong>${data.username}:</strong> ${data.message}</p>`;
});

socket.on('typing', (data) => {
    feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;
});
