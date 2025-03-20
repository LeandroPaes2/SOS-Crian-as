    // App.js
    import 'bootstrap/dist/css/bootstrap.min.css';
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import TelaGeral from './Telas/TelaGeral/telaGeral';
    import TelaLoginADM from './Telas/TelaLoginADM/telaLoginADM';
    import TelaCadastro from './Telas/TelaCadastro/telaCadastro';
    
    
    import './App.css'

    function App() {
        return (
            <Router>
                <div className="app-background"> 
                    <Routes>
                        <Route path="/" element={<TelaLoginADM />} />
                        <Route path="/cadastro" element={<TelaCadastro />} />
                        <Route path="/aaa" element={<TelaCadastro />} />
                    </Routes>
                </div>
            </Router>
        );
    }

    export default App;