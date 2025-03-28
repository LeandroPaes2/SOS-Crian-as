// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TelaMenu from './componentes/Telas/TelaMenu';
import './App.css';
import TelaCadastroTurma from './componentes/Telas/TelaCadastroTurma';
import FormCadTurma from './componentes/Telas/Formularios/FormCadTurma';
import TelaCadastroEscola from './componentes/Telas/talaCadastroEscola';
import FormCadEscola from './componentes/Telas/Formularios/FormCadEscola';
import RelatorioTurmas from './componentes/Telas/Relatorios/RelatorioTurmas';
import RelatorioEscolas from './componentes/Telas/Relatorios/RelatorioEscolas';
import TelaCadastroAluno from './componentes/Telas/TelaCadastroAluno';
import FormCadAluno from './componentes/Telas/Formularios/FormCadAluno';
import TelaCadastroMateria from './componentes/Telas/TelaCadastroMateria';
import FormCadmateria from './componentes/Telas/Formularios/FromCadMateria';
import RelatorioMateria from './componentes/Telas/Relatorios/RelatorioMaterias';
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
                    <Route path="/relatorioTurma" element={<RelatorioTurmas />} />
                    <Route path="/relatorioEscola" element={<RelatorioEscolas />} />
                    <Route path="/telaMateria" element={<TelaCadastroMateria />} />
                    <Route path="/cadastroMateria" element={<FormCadmateria/>} />
                    <Route path="/relatorioMateria" element={<RelatorioMateria />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;