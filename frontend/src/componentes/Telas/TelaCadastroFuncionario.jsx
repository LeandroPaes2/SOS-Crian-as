import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/alerts.css";
import "../css/telaFuncionario.css";

export default function TelaCadastroFuncionario(props){

    return(
        <div>
            <PaginaGeral>
                <p></p>
                <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">Funcionarios</h2>
            </Alert>

            <div className="botoes-container">
                <Button as={Link} to="/cadastroFuncionario" className="botaoMenu" variant="secondary">
                    Cadastrar Funcionario
                </Button>
                <Button as={Link} to="/relatorioFuncionario" className="botaoMenu" variant="secondary">
                    Relatório dos Funcionarios
                </Button>
            </div>
            </PaginaGeral>
        </div>
    )
}