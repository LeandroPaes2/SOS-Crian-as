import { Button } from 'react-bootstrap';
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
import lista from '../imagens/lista_espera.png';
export default function MenuInicial() {

    const { funcionario } = useLogin();
    console.log(funcionario.nivel);

    return (
        <div>
            <div className="divBotao">

                {(funcionario?.nivel == 1 || funcionario?.nivel === 4 || funcionario?.nivel === 3) && (
                        <Button as={Link} to="/telaAluno" className='botaoMenu' variant="primary" size="lg">
                            <img src={alunos} style={{ width: '100px' }} />
                            <br />
                            Atendidos
                        </Button>
                )}

                {(funcionario?.nivel === 1 || funcionario?.nivel === 2 || funcionario?.nivel === 3 || funcionario?.nivel === 6 || funcionario?.nivel === 4) && (
                    <Button as={Link} to="/telaPresenca" className='botaoMenu' variant="primary" size="lg">
                            <img src={presenca} style={{ width: '140px' }} />
                            <br />
                            Presenças
                        </Button>
                )}
                    
                {(funcionario?.nivel === 6 || funcionario?.nivel === 5 || funcionario?.nivel === 3 || funcionario?.nivel === 4) && (
                    <>
                        <Button as={Link} to="/telaFuncionario" className='botaoMenu' variant="primary" size="lg">
                            <img src={funcionarios} style={{ width: '100px' }} />
                            <br />
                            Funcionários
                        </Button>
                        {(funcionario?.nivel === 4) && (
                            <Button as={Link} to="/telaListaEspera" className='botaoMenu' variant="primary" size="lg">
                                <img src={lista} style={{ width: '100px' }} />
                                <br />
                                Lista Espera
                            </Button>)}
                    </>
                )}
                 {(funcionario?.nivel === 3 || funcionario?.nivel === 4) && (
                    <>
                        <Button as={Link} to="/telaResponsavel" className='botaoMenu' variant="primary" size="lg">
                            <img src={responsavel} style={{ width: '100px' }} />
                            <br />
                            Responsáveis
                        </Button>
                        <Button as={Link} to="/telaEscola" className='botaoMenu' variant="primary" size="lg">
                            <img src={escolas} style={{ width: '130px' }} />
                            <br />
                            Escolas
                        </Button>
                    </>
                 )}
                {(funcionario?.nivel === 3 || funcionario?.nivel === 4 || funcionario?.nivel === 6) && (
                        
                        <Button as={Link} to="/telaFamilia" className='botaoMenu' variant="primary" size="lg">
                            <img src={familia} style={{ width: '100px' }} />
                            <br />
                            Familias
                        </Button>
                        
                )}
                <Button as={Link} to="/telaMateria" className='botaoMenu' variant="primary" size="lg">
                            <img src={materias} style={{ width: '100px' }} />
                            <br />
                            Oficinas
                        </Button>
                <Button as={Link} to="/telaHorario" className='botaoMenu' variant="primary" size="lg">
                            <img src={horarios} style={{ width: '100px' }} />
                            <br />
                            Horários
                        </Button>
                <Button as={Link} to="/telaTurma" className='botaoMenu' variant="primary" size="lg">
                            <img src={turmas} style={{ width: '100px' }} />
                            <br />
                            Turmas
                        </Button>
                <Button as={Link} to="/telaEvento" className='botaoMenu' variant="primary" size="lg">
                        <img src={eventos} style={{ width: '100px' }} />
                        <br />
                        Eventos
                    </Button>

            </div>
        </div>
    );
}