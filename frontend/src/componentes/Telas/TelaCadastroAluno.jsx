import PaginaGeral from "../layouts/PaginaGeral";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import RelatorioAlunos from "./Relatorios/RelatorioAlunos";

export default function TelaCadastroAluno(props) {
    return (
        <div>
            <PaginaGeral>
                <br />
                <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                    <h2>
                        Alunos
                    </h2>
                </Alert>

                <div>
                    <Button as={Link} to="/cadastroAluno" className="botaoPesquisa" variant="secondary">
                        Cadastrar aluno
                    </Button>
                </div>
                <div>
                    <Button as={Link} to="/relatorioAluno" className="botaoPesquisa" variant="secondary">
                        Relatório dos alunos
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    );
}
