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
import RelatorioTurmas from './componentes/Telas/Relatorios/RelatorioTurmas';
import RelatorioEscolas from './componentes/Telas/Relatorios/RelatorioEscolas';
import TelaCadastroAluno from './componentes/Telas/TelaCadastroAluno';
import FormCadAluno from './componentes/Telas/Formularios/FormCadAluno';
import RelatorioResponsaveis from './componentes/Telas/Relatorios/RelatorioResponsaveis';
import TelaCadastroResponsavel from './componentes/Telas/TelaCadastroResponsavel';
import FormCadResponsavel from './componentes/Telas/Formularios/FormCadResponsavel';
import RelatorioAlunos from './componentes/Telas/Relatorios/RelatorioAlunos';
import RelatorioFuncionarios from './componentes/Telas/Relatorios/RelatorioFuncionarios';
import TelaCadastroFuncionario from './componentes/Telas/TelaCadastroFuncionario';
import FormCadFuncionario from './componentes/Telas/Formularios/FormCadFuncionario';




function App() {
    return (
        <Router>
            <div className="app-background"> 
                <Routes>
                    <Route path="/" element={<TelaMenu />} />
                    <Route path="/telaTurma" element={<TelaCadastroTurma />} />
                    <Route path="/cadastroTurma" element={<FormCadTurma />} />
                    <Route path="/telaFuncionario" element={<TelaCadastroFuncionario />} />
                    <Route path="/cadastroFuncionario" element={<FormCadFuncionario />} />
                    <Route path="/telaEscola" element={< TelaCadastroEscola/>}/>
                    <Route path="/cadastroEscola" element={<FormCadEscola />} />
                    <Route path="/telaAluno" element={<TelaCadastroAluno />} />
                    <Route path="/cadastroAluno" element={<FormCadAluno />} />
                    <Route path="/relatorioAluno" element={<RelatorioAlunos />} />
                    <Route path="/relatorioFuncionario" element={<RelatorioFuncionarios />} />
                    <Route path="/relatorioTurma" element={<RelatorioTurmas />} />
                    <Route path="/relatorioEscola" element={<RelatorioEscolas />} />
                    <Route path="/telaResponsavel" element={<TelaCadastroResponsavel />} />
                    <Route path="/cadastroResponsavel" element={<FormCadResponsavel />} />
                    <Route path="/relatorioResponsavel" element={<RelatorioResponsaveis/>}/>

                </Routes>
            </div>
        </Router>
    );
}

export default App;