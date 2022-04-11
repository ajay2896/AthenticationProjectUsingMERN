

import React from 'react'
import Layout from "./pages/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Contact from './pages/Contact';
import LoginReg from './pages/auth/LoginReg';
import SendPasswordResetName from './pages/auth/SendPasswordResetName';
import PasswordReset from './pages/auth/PasswordReset';
import Dashboard from './pages/Dashboard';
import { useSelector } from 'react-redux';

const App = () => {

  // Get Token From Redux Store
  const { token } = useSelector( (state) => state.userToken )

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={ <Layout/> }>

            <Route index element={ <Home/> } />
            <Route path="contact" element={ <Contact/> } />
            <Route path="login" element={ !token ? <LoginReg /> : <Navigate to="/dashboard" /> } />
            <Route path="sendpasswordresetemail" element={ <SendPasswordResetName/> } />
            <Route path="api/user/reset/:id/:token" element={ <PasswordReset /> } />
          </Route>

          <Route path="/dashboard" element={ token ? <Dashboard /> : <Navigate to="/login" /> } />
          <Route path="*" element={ <h1>Error 404 Page not Found...!!</h1> } />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
