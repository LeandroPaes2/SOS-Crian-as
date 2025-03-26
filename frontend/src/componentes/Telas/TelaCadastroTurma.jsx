import PaginaGeral from "../layouts/PaginaGeral"
import { Alert, Form, Button, InputGroup} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "../css/telaTurma.css";

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
                <Form>
                <Form.Group className="form" controlId="exampleForm.ControlInput1">
                    <Form.Label>Pesquise a turma pela cor</Form.Label>
                        <InputGroup className="divInput">
                            <div>
                                <Form.Control className="formInput" type="text" placeholder="Cor da turma" />
                                </div>
                            <div>
                                <Button className="botaoPesquisa" variant="secondary">
                                    Pesquisar
                                </Button>
                            </div>
                        </InputGroup>
                    </Form.Group>
                </Form>
                <div>
                    <Button as={Link} to="/cadastroTurma" className="botaoPesquisa" variant="secondary">
                        Cadastrar turma
                    </Button>
                </div>
                <div>
                    <Button className="botaoPesquisa" variant="secondary">
                        Relatorio das turmas
                    </Button>
                </div>
            </PaginaGeral>
        </div>
    )
}