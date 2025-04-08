import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/telaFuncionario.css";
import RelatorioFuncionarios from "./Relatorios/RelatorioFuncionarios";

export default function TelaCadastroFuncionario(props){

    return(
        <div>
            <PaginaGeral>
                <br />
                <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                    <h2>
                        Funcionarios
                    </h2>
                </Alert>

                <div>
                    <Button as={Link} to="/cadastroFuncionario" className="botaoPesquisa" variant="secondary">
                        Cadastrar Funcionario
                    </Button>
                </div>
                <div>
                    <Button as={Link} to="/relatorioFuncionario" className="botaoPesquisa" variant="secondary">
                        Relatorio das Funcionarios
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    )
}