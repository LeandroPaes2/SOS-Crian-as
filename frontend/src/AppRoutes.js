// AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLogin } from './LoginContext';

import TelaMenu from './componentes/Telas/TelaMenu';
import TelaLogin from './componentes/Telas/TelaLogin';
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
import RelatorioResponsaveis from './componentes/Telas/Relatorios/RelatorioResponsaveis';
import TelaCadastroResponsavel from './componentes/Telas/TelaCadastroResponsavel';
import FormCadResponsavel from './componentes/Telas/Formularios/FormCadResponsavel';
import TelaEvento from './componentes/Telas/TelaEvento';
import FormCadEvento from './componentes/Telas/Formularios/FormCadEvento';
import RelatorioEventos from './componentes/Telas/Relatorios/RelatorioEventos';
import RelatorioAlunos from './componentes/Telas/Relatorios/RelatorioAlunos';
import TelaCadastroHorario from './componentes/Telas/telaCadastroHorario';
import FormCadHorario from './componentes/Telas/Formularios/FormCadHorario';
import RelatorioHorario from './componentes/Telas/Relatorios/RelatorioHorario';
import TelaDadosUsuario from './componentes/Telas/TelaDadosUsuario';
import TelaVerificarEmail from './componentes/Telas/TelaVerificarEmail';
import TelaEmailSenha from './componentes/Telas/TelaEmailSenha';
import TelaAlterarSenha from './componentes/Telas/TelaAlterarSenha';


import RelatorioFuncionarios from './componentes/Telas/Relatorios/RelatorioFuncionarios';
import TelaCadastroFuncionario from './componentes/Telas/TelaCadastroFuncionario';
import FormCadFuncionario from './componentes/Telas/Formularios/FormCadFuncionario';
import RelatorioListaEspera from './componentes/Telas/Relatorios/RelatorioListaEspera';
import TelaCadastroListaEspera from './componentes/Telas/TelaCadastroListaEspera';
import FormCadListaEspera from './componentes/Telas/Formularios/FormCadListaEspera';

function AppRoutes() {
    const { isLogado } = useLogin();

    return (
        <Routes>
            <Route path="/" element={isLogado ? <Navigate to="/telaMenu" /> : <TelaLogin />} />
            <Route path="/verificarEmail" element={<TelaVerificarEmail/>}/>
            {isLogado && (
                <>
                    <Route path="/telaMenu" element={<TelaMenu />} />
                    <Route path="/telaTurma" element={<TelaCadastroTurma />} />
                    <Route path="/cadastroTurma" element={<FormCadTurma />} />
                    <Route path="/telaEscola" element={< TelaCadastroEscola/>}/>
                    <Route path="/cadastroEscola" element={<FormCadEscola />} />
                    <Route path="/telaAluno" element={<TelaCadastroAluno />} />
                    <Route path="/cadastroAluno" element={<FormCadAluno />} />
                    <Route path="/relatorioAluno" element={<RelatorioAlunos />} />
                    <Route path="/relatorioTurma" element={<RelatorioTurmas />} />
                    <Route path="/relatorioEscola" element={<RelatorioEscolas />} />
                    <Route path="/telaMateria" element={<TelaCadastroMateria />} />
                    <Route path="/cadastroMateria" element={<FormCadmateria/>} />
                    <Route path="/relatorioMateria" element={<RelatorioMateria />} />
                    <Route path="/telaResponsavel" element={<TelaCadastroResponsavel />} />
                    <Route path="/cadastroResponsavel" element={<FormCadResponsavel />} />
                    <Route path="/relatorioResponsavel" element={<RelatorioResponsaveis/>}/>                
                    <Route path="/relatorioEvento" element={<RelatorioEventos />}/>
                    <Route path="/telaEvento" element={<TelaEvento/>}/>
                    <Route path="/cadastroEvento" element={<FormCadEvento />}/>
                    <Route path="/telaHorario" element={<TelaCadastroHorario/>}/>
                    <Route path="/cadastroHorario" element={<FormCadHorario/>}/>
                    <Route path="/relatorioHorario" element={<RelatorioHorario/>}/>
                    <Route path="/dadosUsuario" element={<TelaDadosUsuario/>}/>
                    <Route path="/telaEmailSenha" element={<TelaEmailSenha/>}/>
                    <Route path="/alterarSenha" element={<TelaAlterarSenha/>}/>


                    <Route path="/telaFuncionario" element={<TelaCadastroFuncionario />} />
                    <Route path="/cadastroFuncionario" element={<FormCadFuncionario />} />
                    <Route path="/relatorioFuncionario" element={<RelatorioFuncionarios />} />
                    <Route path="/relatorioListaEspera" element={<RelatorioListaEspera />} />
                    <Route path='/telaListaEspera' element={<TelaCadastroListaEspera />} />
                    <Route path="/cadastroListaEspera" element={<FormCadListaEspera />} />
                </>
            )}
            {!isLogado && (
                <Route path="*" element={<Navigate to="/" />} />
            )}
        </Routes>
    );
}

export default AppRoutes;
