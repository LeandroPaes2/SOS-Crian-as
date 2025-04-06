import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/telaTurma.css";
import RelatorioResponsaveis from "./Relatorios/RelatorioResponsaveis";

export default function TelaCadastroResponsavel(props){

    return(
        <div>
            <PaginaGeral>
                <br />
                <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                    <h2>
                        Responsaveis
                    </h2>
                </Alert>

                <div>
                    <Button as={Link} to="/cadastroResponsavel" className="botaoPesquisa" variant="secondary">
                        Cadastrar responsavel
                    </Button>
                </div>
                <div>
                    <Button as={Link} to="/relatorioResponsavel" className="botaoPesquisa" variant="secondary">
                        Relatorio dos responsaveis
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    )
}