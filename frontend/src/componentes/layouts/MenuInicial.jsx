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
export default function MenuInicial() {
    return (
        <div className="divBotao">
            <Button as={Link} to="/telaAluno" className='botaoMenu' variant="primary" size="lg">
                <img src={alunos} style={{width: '100px'}} />
                <br/>
                Alunos
            </Button>
            <Button as={Link} to="/telaResponsavel" className='botaoMenu' variant="primary" size="lg">
                <img src={responsavel} style={{width: '100px'}} />
                <br/>
                Responsáveis
            </Button>
            <Button className='botaoMenu' variant="primary" size="lg">
                <img src={funcionarios} style={{width: '100px'}} />
                <br/>
                Funcionários
            </Button>
            <Button as={Link} to="/telaTurma" className='botaoMenu' variant="primary" size="lg">
                <img src={turmas} style={{width: '100px'}} />
                <br/>
                Turmas
            </Button>
            <Button as={Link} to="/telaMateria" className='botaoMenu' variant="primary" size="lg">
                <img src={materias} style={{width: '100px'}} />
                <br/>
                Matérias
            </Button>
            <Button as={Link} to="/telaEscola" className='botaoMenu' variant="primary" size="lg">
                <img src={escolas} style={{width: '130px'}} />
                <br/>
                Escolas
            </Button>
            <Button as={Link} to="/telaEvento" className='botaoMenu' variant="primary" size="lg">
                <img src={eventos} style={{width: '100px'}} />
                <br/>
                Eventos
            </Button>
        </div>
    );
}