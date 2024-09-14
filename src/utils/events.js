export function joinChat (socket, chatId) {
    /* console.log(socket, chatId); */
    if(!socket || !chatId) return;

    if(socket) {
        return socket.emit('join-chat', chatId);
    }
}