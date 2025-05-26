import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/alerts.css";
import "../css/telaListaEspera.css";

export default function TelaCadastroListaEspera(props){

    return(
        <div>
            <PaginaGeral>
                <p></p>
                <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">Crianças na Lista de Espera</h2>
            </Alert>

            <div className="botoes-container">
                <Button as={Link} to="/cadastroListaEspera" className="botaoMenu" variant="secondary">
                    Cadastrar na Lista de Espera
                </Button>
                <Button as={Link} to="/relatorioListaEspera" className="botaoMenu" variant="secondary">
                    Relatório da Lista de Espera
                </Button>
            </div>
            </PaginaGeral>
        </div>
    )
}