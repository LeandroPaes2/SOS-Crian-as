import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/alerts.css";
import "../css/telaResponsavel.css";

export default function TelaCadastroResponsavel(props){

    return(
        <div>
            <PaginaGeral>
                <p></p>
                <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">Responsáveis</h2>
            </Alert>

            <div className="botoes-container">
                <Button as={Link} to="/cadastroResponsavel" className="botaoMenu" variant="secondary">
                    Cadastrar responsável
                </Button>
                <Button as={Link} to="/relatorioResponsavel" className="botaoMenu" variant="secondary">
                    Relatório dos responsáveis
                </Button>
            </div>
            </PaginaGeral>
        </div>
    )
}