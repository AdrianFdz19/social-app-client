import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();
    const redirect = (route) => navigate(route);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Función para verificar el ancho de la ventana
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        // Ejecutar la función al cargar el componente
        handleResize();

        // Agregar un listener para escuchar cambios en el tamaño de la ventana
        window.addEventListener('resize', handleResize);

        // Limpiar el listener cuando se desmonte el componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
        redirect,
        isMobile
    };

  return (
    <AppContext.Provider value={data} >
        {children}
    </AppContext.Provider>
  )
}
