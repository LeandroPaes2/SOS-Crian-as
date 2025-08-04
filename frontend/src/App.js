// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/fonts.css';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoginProvider } from './LoginContext';
import AppRoutes from './AppRoutes';

function App() {
    return (
        <LoginProvider>
            <Router>
                <div className="app-background">
                    <AppRoutes />
                </div>
            </Router>
        </LoginProvider>
    );
}

export default App;
