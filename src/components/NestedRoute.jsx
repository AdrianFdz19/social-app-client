import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppProvider'
import { Navigate, Outlet } from 'react-router-dom';

export default function NestedRoute() {

    const {tokenLoading, user} = useAppContext();
    const {isAuthenticated} = user;

    if(tokenLoading) {
        return <p>loading...</p>
    }

    if(!isAuthenticated) {
        return <Navigate to={`/sign-in`} />
    }

    return <Outlet />
}
