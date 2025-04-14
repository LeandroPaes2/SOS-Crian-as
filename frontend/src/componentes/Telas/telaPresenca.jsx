import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/alerts.css";
import "../css/telaResponsavel.css";

export default function TelaPresenca(props){

    return(
        <div>
            <PaginaGeral>
                <p></p>
                <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">PRESENÇA</h2>
            </Alert>

            <div className="botoes-container">
                <Button as={Link} to="/cadastroPresenca" className="botaoMenu" variant="secondary">
                    Lista de Presença do Dia
                </Button>
                <Button as={Link} to="/relatorioPresenca" className="botaoMenu" variant="secondary">
                    Listas de Presença cadastradas
                </Button>
            </div>
            </PaginaGeral>
        </div>
    )
}