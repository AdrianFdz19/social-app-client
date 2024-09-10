import React, { createContext, useContext, useState } from 'react'
const AppProvider = createContext();
export const useAppContext = () => {
    return useContext(AppProvider);
}

export default function AppContext({children}) {

    const [isDevServer, setIsDevServer] = useState(true);
    const [loadingToken, setLoadingToken] = useState(false);
    const [user, setUser] = useState({
      username: '',
      email: '',
      imgs: {
        profilePic: '',
        bannerImg: ''
      },
    });

    let data = {
        serverUrl: isDevServer ? "http://localhost:3000" : "",
        user, setUser,
    };

  return (
    <AppProvider.Provider value={data} >
        {children}
    </AppProvider.Provider>
  )
}
