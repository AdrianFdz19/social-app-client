import React, { createContext, useContext, useEffect, useState } from 'react'
const AppContext = createContext();
export const useAppContext = () => {
    return useContext(AppContext);
}

export default function AppProvider({children}) {

    const [isDevServer, setIsDevServer] = useState(true);
    const [tokenLoading, setTokenLoading] = useState(true);
    const [user, setUser] = useState({
      id: null,
      username: '',
      email: '',
      imgs: {
        profilePic: '',
        bannerImg: ''
      },
      isAuthenticated: false,
    });

    useEffect(() => {
      const getAuthToken = async() => {
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
              try {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  if (payload) {
                      setUser({
                          id: payload.user_id,
                          username: payload.username,
                          email: payload.email,
                          imgs: {
                              profilePic: payload.profile_pic,
                              bannerImg: payload.banner_img
                          },
                          isAuthenticated: payload.is_authenticated
                      });
                  }
              } catch (err) {
                  console.error('Error decoding token or invalid token structure', err);
              }
          } else {
              console.error('No token found');
          }

        } catch(err) {
          console.error('Error retrieving auth token', err);
        } finally {
          setTokenLoading(false);
        }
      }; 
      getAuthToken();
    }, []);

    let data = {
        serverUrl: isDevServer ? "http://localhost:3000" : "",
        user, setUser,
        tokenLoading,
    };

  return (
    <AppContext.Provider value={data} >
        {children}
    </AppContext.Provider>
  )
}
