import PaginaGeral from "../layouts/PaginaGeral";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/telaResponsavel.css";

export default function TelaCadastroFamilia() {
    return (
        <div className="topo">
            <PaginaGeral>
                <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Familias</h2>
                </Alert>

                <div className="botoes-container">
                    <Button as={Link} to="/cadastroFamilia" className="botaoMenu" variant="secondary">
                        Cadastrar familia
                    </Button>
                    <Button as={Link} to="/relatorioFamilia" className="botaoMenu" variant="secondary">
                        Relatorio das familias
                    </Button>
                </div>
            </PaginaGeral>
        </div>


    )
}