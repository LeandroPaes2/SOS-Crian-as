import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Button } from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/telaTurma.css";
import RelatorioTurmas from "./Relatorios/RelatorioTurmas";

export default function TelaCadastroTurma(props){

    return(
        <div>
            <PaginaGeral>
                <br />
                <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                    <h2>
                        Turmas
                    </h2>
                </Alert>

                <div>
                    <Button as={Link} to="/cadastroTurma" className="botaoPesquisa" variant="secondary">
                        Cadastrar turma
                    </Button>
                </div>
                <div>
                    <Button as={Link} to="/relatorioTurma" className="botaoPesquisa" variant="secondary">
                        Relatorio das turmas
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    )
}