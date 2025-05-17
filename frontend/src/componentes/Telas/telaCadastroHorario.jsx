import PaginaGeral from "../layouts/PaginaGeral";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TelaCadastroHorario() {
    return (
        <PaginaGeral>
            <div className="topot">
                <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2>Grade de Horários</h2>
                </Alert>
                <div className="botoes-container">
                    <Button
                        as={Link}
                        to="/cadastroHorario"
                        className="botaoMenu"
                        variant="secondary"
                    >
                        Cadastrar horário
                    </Button>
                    <Button
                        as={Link}
                        to="/relatorioHorario"
                        className="botaoMenu"
                        variant="secondary"
                    >
                        Relatório dos horários
                    </Button>
                </div>
            </div>
        </PaginaGeral>
    );
}