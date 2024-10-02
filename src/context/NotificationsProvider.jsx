import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { useAppContext } from './AppProvider';

const NotificationsContext = createContext();
export const useNotifications = () => {
    return useContext(NotificationsContext);
}

export default function NotificationsProvider({children}) {

    const { serverUrl, user } = useAppContext();
    const socket = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [notCount, setNotCount] = useState(0);

    // Recibir las notificaciones
    useEffect(() => {
        const getNotifications = async() => {
            try {
                const response = await fetch(`${serverUrl}/user/notifications/${user?.id}`);
                if(response.ok) {
                    const data = await response.json();
                    const notifications = data?.notifications;
                    
                    setNotifications(notifications);

                    // Filtrar solo las notificaciones no leídas (read: null o false)
                    const unreadNotifications = notifications.filter(not => !not.read);
                    setNotCount(unreadNotifications.length); // Contar solo las no leídas
                } else {
                    console.error('Server internal error');
                }
            } catch(err) {  
                console.error(err);
            }
        };
        if(user.id) getNotifications();
    }, [serverUrl, user]);

    // Manejar los sockets
    useEffect(() => {
        if(socket) {
            socket.on('follow-notification', (notification) => {
                const {user_id, source_id, source_name, source_pic, type_not, content, read, date} = notification;
                
                console.log(user_id, source_id, source_name, source_pic, type_not, content, read, date);

                setNotifications((prev) => ([
                    ...prev,
                    {
                        source_name,
                        source_pic,
                        source_id,
                        type: type_not,
                        content,
                        read, 
                        date
                    }
                ]));

                // Si la notificación no está leída, incrementa el contador
                if (!read) {
                    setNotCount(prevCount => prevCount + 1);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('follow-notification');
            }
        };

    }, [socket]);

    let data = {
        notifications, 
        setNotifications,
        notCount,   // notCount ahora es solo de notificaciones no leídas
        setNotCount
    };

    return (
        <NotificationsContext.Provider value={data}>
            {children}
        </NotificationsContext.Provider>
    );
}
