import React, { createContext, useContext, useState } from 'react'
const AppProvider = createContext();
export const useAppContext = () => {
    return useContext(AppProvider);
}

export default function AppContext({children}) {

    const [isDevServer, setIsDevServer] = useState(true);

    let data = {
        serverUrl: isDevServer ? "http://localhost:3000" : "",
    }

  return (
    <AppProvider.Provider value={data} >
        {children}
    </AppProvider.Provider>
  )
}
