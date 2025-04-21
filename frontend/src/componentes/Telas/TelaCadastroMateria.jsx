import PaginaGeral from "../layouts/PaginaGeral";
import { Alert, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../css/telaResponsavel.css";

export default function TelaCadastroMateria(){
    return (
        <div>
            <PaginaGeral>
                <br />
                <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Matérias</h2>
                </Alert>

                <div className="botoes-container">
                    <Button as={Link} to="/cadastroMateria" className="botaoPesquisa" variant="secondary">
                        Cadastrar Matéria
                    </Button>
                    <Button as={Link} to="/relatorioMateria" className="botaoPesquisa" variant="secondary">
                        Relatório das Matérias
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    );
}