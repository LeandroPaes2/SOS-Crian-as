import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Button} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/telaEscola.css";

export default function TelaCadastroEscola(props){

    return(
        <div>
            <PaginaGeral>
                <br/>
                <Alert className = "mt-02 mb-02 dark text-center" variant="dark">
                    <h2>
                        Escolas
                    </h2>
                </Alert>
                <div>
                    <Button as={Link} to="/cadastroEscola" className="botaoPesquisa" variant="secondary">
                        Cadastrar escola
                    </Button>
                </div>
                <div>
                    <Button as={Link} to="/relatorioEscola" className="botaoPesquisa" variant="secondary">
                        Relatorio das escola
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    );
}