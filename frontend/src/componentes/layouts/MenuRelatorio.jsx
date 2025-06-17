import "../css/menu.css";
import { Link } from 'react-router-dom';
import alunos from '../imagens/alunos.png';
import responsavel from '../imagens/responsavel.png';
import funcionarios from '../imagens/funcionarios.png';
import turmas from '../imagens/turmas.png';
import materias from '../imagens/materias.png';
import escolas from '../imagens/escolas.png';
import eventos from '../imagens/eventos.png';
import horarios from '../imagens/horario.png';
import { useLogin } from "../../LoginContext.js";
import familia from '../imagens/familia.png';
import presenca from '../imagens/presenca.png';
import faltas from '../imagens/faltas.png';
export default function MenuRelatorio() {
    const { funcionario } = useLogin();

    return (
        <div>
            <div className="divBotao">
                {(funcionario?.nivel === 1 || funcionario?.nivel === 3 || funcionario?.nivel === 4) && (
<<<<<<< HEAD
                    <>
                        <Link to="/relatorioAluno" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={alunos} style={{ width: '100px' }} />
                                <span style={{ color: 'white' }}>Alunos</span>
                            </button>
                        </Link>

                        <Link to="/relatorioResponsavel" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={responsavel} style={{ width: '100px' }} />
                                <span style={{ color: 'white' }}>Responsáveis</span>
                            </button>
                        </Link>

                        <Link to="/relatorioEscola" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={escolas} style={{ width: '130px' }} />
                                <span style={{ color: 'white' }}>Escolas</span>
                            </button>
                        </Link>

                        <Link to="/relatorioFamilia" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={familia} style={{ width: '100px' }} />
                                <span style={{ color: 'white' }}>Famílias</span>
                            </button>
                        </Link>
                    </>
                )}

                {(funcionario?.nivel === 3 || funcionario?.nivel === 4 || funcionario?.nivel === 5 || funcionario?.nivel === 6) && (
                    <>
                        <Link to="/relatorioFuncionario" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={funcionarios} style={{ width: '100px' }} />
                                <span style={{ color: 'white' }}>Funcionários</span>
                            </button>
                        </Link>

                        {funcionario?.nivel === 4 && (
                            <Link to="/relatorioListaEspera" style={{ textDecoration: 'none' }}>
                                <button className="button1">
                                    <img src={funcionarios} style={{ width: '100px' }} />
                                    <span style={{ color: 'white' }}>Lista Espera</span>
                                </button>
                            </Link>
                        )}
                    </>
                )}

                {(funcionario?.nivel === 1 || funcionario?.nivel === 2) && (
                    <>
                        <Link to="/relatorioMateria" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={faltas} style={{ width: '100px' }} />
                                <span style={{ color: 'white' }}>Oficinas</span>
                            </button>
                        </Link>

                        <Link to="/relatorioHorario" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={horarios} style={{ width: '100px' }} />
                                <span style={{ color: 'white' }}>Horários</span>
                            </button>
                        </Link>

                        <Link to="/relatorioTurma" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={turmas} style={{ width: '100px' }} />
                                <span style={{ color: 'white' }}>Turmas</span>
                            </button>
                        </Link>

                        <Link to="/relatorioPresenca" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={presenca} style={{ width: '140px' }} />
                                <span style={{ color: 'white' }}>Presenças</span>
                            </button>
                        </Link>

                        <Link to="/relatorioFalta" style={{ textDecoration: 'none' }}>
                            <button className="button1">
                                <img src={materias} style={{ width: '100px' }} />
                                <span style={{ color: 'white' }}>Faltas</span>
                            </button>
                        </Link>
                    </>
                )}

                {funcionario?.nivel !== 4 && (
                    <Link to="/relatorioEvento" style={{ textDecoration: 'none' }}>
                        <button className="button1">
                            <img src={eventos} style={{ width: '100px' }} />
                            <span style={{ color: 'white' }}>Eventos</span>
                        </button>
                    </Link>
                )}
=======
                                
                                        <Link to="/relatorioAluno" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={alunos} style={{ width: '100px' }} />
                                                <span style={{ color: 'white' }}>Atendidos</span>
                                            </button>
                                        </Link>
                                )}
                
                                {(funcionario?.nivel === 1 || funcionario?.nivel === 2 || funcionario?.nivel === 3 || funcionario?.nivel === 6 || funcionario?.nivel === 4) && (
                                    <Link to="/relatorioPresenca" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={presenca} style={{ width: '140px' }} />
                
                                                <span style={{ color: 'white' }}>Presenças</span>
                                            </button>
                                        </Link>
                                )}
                
                                {(funcionario?.nivel === 3 || funcionario?.nivel === 4 || funcionario?.nivel === 5 || funcionario?.nivel === 6) && (
                                    <>
                                        <Link to="/relatorioFuncionario" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={funcionarios} style={{ width: '100px' }} />
                
                                                <span style={{ color: 'white' }}>Funcionários</span>
                                            </button>
                                        </Link>
                
                                            <Link to="/relatorioListaEspera" style={{ textDecoration: 'none' }}>
                                                <button className="button1">
                                                    <img src={funcionarios} style={{ width: '100px' }} />
                    
                                                    <span style={{ color: 'white' }}>Lista Espera</span>
                                                </button>
                                            </Link>
                                        
                                    </>
                                )}
                
                                {(funcionario?.nivel === 3 || funcionario?.nivel === 4) && (
                                    <>
                                    <Link to="/relatorioResponsavel" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={responsavel} style={{ width: '100px' }} />
                                                <span style={{ color: 'white' }}>Responsáveis</span>
                                            </button>
                                        </Link>
                
                                        <Link to="/relatorioEscola" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={escolas} style={{ width: '130px' }} />
                                                <span style={{ color: 'white' }}>Escolas</span>
                                            </button>
                                        </Link>
                
                                        
                                    </>
                                )}
                
                                {(funcionario?.nivel === 3 || funcionario?.nivel === 4 || funcionario?.nivel === 6) && (
                                    <Link to="/relatorioFamilia" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={familia} style={{ width: '100px' }} />
                
                                                <span style={{ color: 'white' }}>Famílias</span>
                                            </button>
                                        </Link>
                                )}
                
                                <Link to="/relatorioMateria" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={materias} style={{ width: '100px' }} />
                
                                                <span style={{ color: 'white' }}>Oficinas</span>
                                            </button>
                                        </Link>
                
                                        <Link to="/relatorioHorario" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={horarios} style={{ width: '100px' }} />
                
                                                <span style={{ color: 'white' }}>Horários</span>
                                            </button>
                                        </Link>
                
                                        <Link to="/relatorioTurma" style={{ textDecoration: 'none' }}>
                                            <button className="button1">
                                                <img src={turmas} style={{ width: '100px' }} />
                
                                                <span style={{ color: 'white' }}>Turmas</span>
                                            </button>
                                        </Link>
                                        <Link to="/relatorioEvento" style={{ textDecoration: 'none' }}>
                                        <button className="button1">
                                            <img src={eventos} style={{ width: '100px' }} />
                                            <span style={{ color: 'white' }}>Eventos</span>
                                        </button>
                                    </Link>
>>>>>>> a9cb9618c1b0c3fc843f831d089e3da332a6ba54
            </div>
        </div>
    );
}
