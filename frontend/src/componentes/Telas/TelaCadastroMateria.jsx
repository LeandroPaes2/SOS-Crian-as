import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import RelatorioMateria from "./Relatorios/RelatorioMaterias.jsx";

export default function TelaCadastroMateria(props){

    return(
        <div>
            <PaginaGeral>
                <br />
                <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                    <h2>
                        Materia
                    </h2>
                </Alert>

                <div>
                    <Button as={Link} to="/cadastroMateria" className="botaoPesquisa" variant="secondary">
                        Cadastrar materia
                    </Button>
                </div>
                <div>
                    <Button as={Link} to="/relatorioMateria" className="botaoPesquisa" variant="secondary">
                        Relatorio das materias
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    )
}