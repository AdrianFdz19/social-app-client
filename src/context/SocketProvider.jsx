import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAppContext } from './AppProvider';
const SocketContext = createContext();
export const useSocket = () => {
    return useContext(SocketContext);
};

export default function SocketProvider({children}) {

    const {serverUrl, user} = useAppContext();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const newSocket = io(serverUrl, {
            query :{
                userId: user.id
            }
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) newSocket.close();
        }
    }, [serverUrl, user]);

  return (
    <SocketContext.Provider value={socket} >
        {children}
    </SocketContext.Provider>
  )
}
