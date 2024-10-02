export function joinChat (socket, chatId) {
    /* console.log(socket, chatId); */
    if(!socket || !chatId) return;

    if(socket) {
        return socket.emit('join-chat', chatId);
    }
}

export function sendMessage (socket, message) {
    if(!socket || !message) return;

    if(socket) {
        return socket.emit('send-message', message);
    }
}

export function followNotification (socket, userId, targetId) {
    if(!socket || !userId || !targetId) return;

    if(socket) {
        return socket.emit('follow-notification', {userId, targetId});
    }
}