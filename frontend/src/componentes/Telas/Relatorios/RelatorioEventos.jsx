import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/alerts.css";
import { useEventos } from "../../../EventosContext";

export default function RelatorioEventos() {

    const { listaDeEventos, setListaDeEventos } = useEventos();
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const excluirEvento = (evento) => {
        if (window.confirm("Deseja realmente excluir o evento " + evento.nome)) {
            setListaDeEventos(listaDeEventos.filter((r) => r.id !== evento.id));
            setMensagem("Evento excluido com sucesso!");
            setTimeout(() => setMensagem(""), 3000);
        }
    };

    const editarEventos = (evento) => {
        navigate("/cadastroEvento", {
            state: { ...evento }
        });
    };


    const eventosFiltrados = pesquisaNome
        ? listaDeEventos.filter((evento) => evento.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeEventos;

    return (
        <>
            <PaginaGeral>

                <p></p>
                <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">LISTA DE EVENTOS</h2>
                </Alert>

                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontWeight: 400, color: 'white' }}>PESQUISE O EVENTO PELO NOME</Form.Label>
                        <InputGroup className="divInput">
                            <div>
                                <Form.Control className="formInput" type="text" placeholder="Pesquise o nome do evento"
                                    value={pesquisaNome}
                                    onChange={(e) => setPesquisaNome(e.target.value)} />
                            </div>
                            <div>
                                <Button className="botaoPesquisa" variant="secondary">
                                    Pesquisar
                                </Button>
                            </div>
                        </InputGroup>
                    </Form.Group>
                </Form>
                <br />
                {mensagem && <Alert className="mt-02 mb-02 green text-center" variant={
                    mensagem.includes("sucesso")
                        ? "success"
                        : mensagem.includes("Erro") || mensagem.includes("erro")
                            ? "danger"
                            : "warning"
                }>
                    {mensagem}
                </Alert>}
                <Container>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NOME</th>
                                <th>PERIODO</th>
                                <th>DATA</th>
                                <th>HORA INICIO</th>
                                <th>HORA FIM</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                eventosFiltrados?.map((evento) => {

                                    return (
                                        <tr>
                                            <td>{evento.id}</td>
                                            <td>{evento.nome}</td>
                                            <td>{evento.periodo}</td>
                                            <td>{evento.data}</td>
                                            <td>{evento.horaInicio}</td>
                                            <td>{evento.horaFim}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <Button onClick={() => editarEventos(evento)}
                                                        variant="warning">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button onClick={() => {
                                                        excluirEvento(evento);
                                                    }} variant="danger">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                        </svg>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <p>Quatidade de eventos cadastrados: {listaDeEventos.length}</p>
                </Container>
                <div>
                    <Button as={Link} to="/telaEvento" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                    <Button as={Link} to="/cadastroEvento" className="botaoPesquisa" variant="secondary">
                        Cadastrar novo evento
                    </Button>
                </div>
            </PaginaGeral>
        </>
    );
}
