import PaginaGeral from "../layouts/PaginaGeral";
import { Alert, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../css/telaResponsavel.css";

export default function TelaCadastroPresenca(){
    return (
        <div className="topo">
            <PaginaGeral>
                <br />
                <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Presencas</h2>
                </Alert>

                <div className="botoes-container">
                    <Button as={Link} to="/cadastroPresenca" className="botaoPesquisa" variant="secondary">
                        Cadastrar Presença do Dia
                    </Button>
                    <Button as={Link} to="/relatorioPresenca" className="botaoPesquisa" variant="secondary">
                        Lista de Presenças Cadastradas
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    );
}