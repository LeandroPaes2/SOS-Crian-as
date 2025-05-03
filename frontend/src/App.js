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
import RelatorioResponsaveis from './componentes/Telas/Relatorios/RelatorioResponsaveis';
import TelaCadastroResponsavel from './componentes/Telas/TelaCadastroResponsavel';
import FormCadResponsavel from './componentes/Telas/Formularios/FormCadResponsavel';
import TelaEvento from './componentes/Telas/TelaEvento';
import FormCadEvento from './componentes/Telas/Formularios/FormCadEvento';
import RelatorioEventos from './componentes/Telas/Relatorios/RelatorioEventos';
import RelatorioAlunos from './componentes/Telas/Relatorios/RelatorioAlunos';
import { EventosProvider } from './EventosContext';
import TelaCadastroHorario from './componentes/Telas/telaCadastroHorario';
import FormCadHorario from './componentes/Telas/Formularios/FormCadHorario';
import RelatorioHorario from './componentes/Telas/Relatorios/RelatorioHorario';
import TelaCadastroPresenca from './componentes/Telas/TelaCadastroPresenca';
import FormCadPresenca from './componentes/Telas/Formularios/FormCadPresenca';
import RelatorioPresenca from './componentes/Telas/Relatorios/RelatorioPresencas';

function App() {
    return (
        <EventosProvider>
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

                    <Route path="/cadastroEvento" element={
                            <FormCadEvento />
                        }/>
                    <Route path="/telaPresenca" element={<TelaCadastroPresenca/>}/>
                    <Route path="/cadastroPresenca" element={<FormCadPresenca/>}/>
                    <Route path="/relatorioPresenca" element={<RelatorioPresenca />} />
                </Routes>
            </div>
        </Router>
        </EventosProvider>
    );
}

export default App;