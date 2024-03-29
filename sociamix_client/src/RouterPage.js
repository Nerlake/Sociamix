import React, { useEffect, useState } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import SignIn from './pages/SignIn/SignIn'
import ProfilPage from './pages/profilpage/ProfilPage'
import Register from './pages/register/Register'
import Map from './components/map/Map'
import { useSelector } from 'react-redux'
import Messages from './pages/messages/Messages'
import FriendsRequests from './pages/FriendsRequests/FriendsRequests'
import Error from './components/error/Error'



export default function RouterPage() {

    const [token, setToken] = useState(localStorage.getItem('access-token'));
    const [isLogged, setIsLogged] = useState(false);
    const myProfile = useSelector((state) => state.user)


    useEffect(() => {
        const token = localStorage.getItem('session_token');
        setToken(token);
        if (!!token) {
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }
    }, [token]);

    const router = createBrowserRouter([
        { path: '/', element: isLogged ? <App /> : <SignIn /> },
        { path: '/:id', element: isLogged ? <ProfilPage /> : <SignIn /> },
        { path: '/profil', element: isLogged ? <ProfilPage userId={myProfile?._id} /> : <SignIn /> },
        { path: '/login', element: !isLogged ? <SignIn /> : <App /> },
        { path: '/register', element: !isLogged ? <Register /> : <App /> },
        // { path: '/map', element: isLogged ? <Map /> : <SignIn /> },
        { path: "/messages", element: isLogged ? <Messages /> : <SignIn /> },
        { path: "/friendsRequests", element: isLogged ? <FriendsRequests /> : <SignIn /> },
        { path: '*', element: <Error error={404} /> },
    ])
    return (
        <RouterProvider router={router} />
    )
}
