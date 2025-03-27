import { Button } from 'react-bootstrap';
import "../css/menu.css";
import {Link} from 'react-router-dom';

export default function MenuInicial(props){

    return(
        <div className="divBotao">
            <Button className='botaoMenu' variant="secondary" size="lg">
                Alunos
            </Button>
            <br />
            <Button className='botaoMenu' variant="secondary" size="lg">
                Funcionarios
            </Button>
            <br />
            <Button as={Link} to="/telaTurma" className='botaoMenu' variant="secondary" size="lg">
                Turmas
            </Button>
            <br />
            <Button className='botaoMenu' variant="secondary" size="lg">
                Matérias
            </Button>
            <br />
            <Button as={Link} to="/telaEscola" className='botaoMenu' variant="secondary" size="lg">
                Escolas
            </Button>
        </div>
    )
}