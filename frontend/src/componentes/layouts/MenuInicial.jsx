import { Button } from 'react-bootstrap';
import "../css/menu.css";
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaUsers, FaChalkboardTeacher, FaSchool, FaBook, FaUserTie } from 'react-icons/fa';

export default function MenuInicial() {
    return (
        <div className="divBotao">
            <Button as={Link} to="/telaAluno" className='botaoMenu' variant="secondary" size="lg">
                <FaUserGraduate style={{ marginRight: "10px" }} />
                Alunos
            </Button>
            <Button as={Link} to="/telaResponsavel" className='botaoMenu' variant="secondary" size="lg">
                <FaUsers style={{ marginRight: "10px" }} />
                Responsáveis
            </Button>
            <Button className='botaoMenu' variant="secondary" size="lg">
                <FaUserTie style={{ marginRight: "10px" }} />
                Funcionários
            </Button>
            <Button as={Link} to="/telaTurma" className='botaoMenu' variant="secondary" size="lg">
                <FaChalkboardTeacher style={{ marginRight: "10px" }} />
                Turmas
            </Button>
            <Button as={Link} to="/telaMateria"  className='botaoMenu' variant="secondary" size="lg">
                <FaBook style={{ marginRight: "10px" }} />
                Matérias
            </Button>
            <Button as={Link} to="/telaEscola" className='botaoMenu' variant="secondary" size="lg">
                <FaSchool style={{ marginRight: "10px" }} />
                Escolas
            </Button>

            <Button as={Link} to="/telaEvento" className='botaoMenu' variant="secondary" size="lg">
                Eventos
            </Button>
            
            <Button as={Link} to="/telaPresenca" className='botaoMenu' variant="secondary" size="lg">
                Presenças
            </Button>
        </div>
    );
}
