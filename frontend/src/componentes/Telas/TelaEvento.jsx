import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/alerts.css";
import "../css/telaResponsavel.css";

export default function TelaEvento(props){

    return(
        <div>
            <PaginaGeral>
                <p></p>
                <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">EVENTOS</h2>
            </Alert>

            <div className="botoes-container">
                <Button as={Link} to="/cadastroEvento" className="botaoMenu" variant="secondary">
                    Cadastrar evento
                </Button>
                <Button as={Link} to="/relatorioEvento" className="botaoMenu" variant="secondary">
                    Eventos agendados
                </Button>
            </div>
            </PaginaGeral>
        </div>
    )
}