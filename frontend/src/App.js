    // App.js
    import 'bootstrap/dist/css/bootstrap.min.css';
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import TelaMenu from './componentes/Telas/TelaMenu';
    //import TelaCadastro from './componentes/Telas/telaCadastro';
    import './App.css'
    import TelaCadastroTurma from './componentes/Telas/TelaCadastroTurma';
    import FormCadTurma from './componentes/Telas/Formularios/FormCadTurma';

    function App() {
        return (
            <Router>
                <div className="app-background"> 
                    <Routes>
                        <Route path="/" element={<TelaMenu />} />
                        <Route path="/telaTurma" element={<TelaCadastroTurma />} />
                        <Route path="/cadastroTurma" element={<FormCadTurma />} />
                    </Routes>
                </div>
            </Router>
        );
    }

    export default App;