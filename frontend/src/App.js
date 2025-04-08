// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TelaMenu from './componentes/Telas/TelaMenu';
import './App.css'
import TelaCadastroTurma from './componentes/Telas/TelaCadastroTurma';
import FormCadTurma from './componentes/Telas/Formularios/FormCadTurma';
import TelaCadastroEscola from './componentes/Telas/talaCadastroEscola';
import FormCadEscola from './componentes/Telas/Formularios/FormCadEscola';
import TelaCadastroFuncionario from './componentes/Telas/TelaCadastroFuncionario';
import FormCadFuncionario from './componentes/Telas/Formularios/FormCadFuncionario';
import RelatorioTurmas from './componentes/Telas/Relatorios/RelatorioTurmas';
import RelatorioEscolas from './componentes/Telas/Relatorios/RelatorioEscolas';
import RelatorioFuncionarios from './componentes/Telas/Relatorios/RelatorioFuncionarios';
import TelaCadastroAluno from './componentes/Telas/TelaCadastroAluno';
import FormCadAluno from './componentes/Telas/Formularios/FormCadAluno';

function App() {
    return (
        <Router>
            <div className="app-background"> 
                <Routes>
                    <Route path="/" element={<TelaMenu />} />
                    <Route path="/telaTurma" element={<TelaCadastroTurma />} />
                    <Route path="/cadastroTurma" element={<FormCadTurma />} />
                    <Route path="/telaEscola" element={< TelaCadastroEscola/>}/>
                    <Route path="/cadastroEscola" element={<FormCadEscola />} />
                    <Route path="/telaAluno" element={<TelaCadastroAluno />} />
                    <Route path="/cadastroAluno" element={<FormCadAluno />} />
                    <Route path="/telaFuncionario" element={<TelaCadastroFuncionario />} />
                    <Route path="/cadastroFuncionario" element={<FormCadFuncionario />} />
                    <Route path="/relatorioTurma" element={<RelatorioTurmas />} />
                    <Route path="/relatorioEscola" element={<RelatorioEscolas />} />
                    <Route path="/relatorioFuncionario" element={<RelatorioFuncionarios />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;