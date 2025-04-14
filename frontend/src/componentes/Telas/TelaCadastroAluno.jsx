import PaginaGeral from "../layouts/PaginaGeral";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TelaCadastroAluno() {
    return (
        <div>
            <PaginaGeral>
                <br />
                <Alert className="alert-custom text-center mt-4 mb-4" >
                    <h2 className="titulo-alert">Alunos</h2>
                </Alert>

                <div className="botoes-container">
                    <Button as={Link} to="/cadastroAluno" variant="secondary" className="botaoMenu">
                        Cadastrar Aluno
                    </Button>

                    <Button as={Link} to="/relatorioAluno" variant="secondary" className="botaoMenu">
                        Relatório dos Alunos
                    </Button>
                </div>
            </PaginaGeral>


        </div>

    );
}
