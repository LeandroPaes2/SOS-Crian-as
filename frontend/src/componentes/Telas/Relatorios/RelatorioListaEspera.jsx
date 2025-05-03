import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';

export default function RelatorioListaEspera() {  

    const navigate = useNavigate();

    const [listaDeListaEspera, setListaDeListaEspera] = useState([]); 
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");

    useEffect(() => {
        const buscarListaEspera = async () => {
            try {
                const response = await fetch("http://localhost:3000/listasEspera");
                if (!response.ok) throw new Error("Erro ao buscar listaEspera");
                
                const dados = await response.json();
                setListaDeListaEspera(dados); 
            } catch (error) {
                console.error("Erro ao buscar listaEspera:", error);
                setMensagem("Erro ao carregar a lista de espera.");
            }
        };

        buscarListaEspera();
    }, []);

    /*const excluirListaEspera = async (listaEspera) => {
        if (window.confirm("Deseja realmente excluir a criança " + listaEspera.nome + " da lista de espera?")) {
            try {
                const response = await fetch("http://localhost:3000/listasEspera/" + listaEspera.id, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Excluído com sucesso!");
                    setListaDeListaEspera(listaDeListaEspera.filter(t => t.id !== listaEspera.id));
                } else {
                    setMensagem("Erro ao excluir.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    };

    const adicionarAluno = (listaEspera) => {
        navigate("/cadastroAluno", {
            state: {
                editando: true,
                nome: listaEspera.nome,
                dataNascimento: listaEspera.dataNascimento,
                responsavel: listaEspera.responsavel,
                rua: listaEspera.rua,
                numero: listaEspera.numero,
                escola: listaEspera.escola,
                telefone: listaEspera.telefone,
                periodoEscola: listaEspera.periodoEscola,
                realizaAcompanhamento: listaEspera.realizaAcompanhamento,
                possuiSindrome: listaEspera.possuiSindrome,
                descricao: listaEspera.descricao,
                dataInsercao: listaEspera.dataInsercao
            }
        });
    };*/


    const excluirListaEspera = async (listaEspera, confirmar = true) => {
        if (confirmar) {
            const confirmacao = window.confirm("Deseja realmente excluir a criança " + listaEspera.nome + " da lista de espera?");
            if (!confirmacao) return;
        }
    
        try {
            const response = await fetch("http://localhost:3000/listasEspera/" + listaEspera.id, {
                method: "DELETE"
            });
    
            if (response.ok) {
                setMensagem("Excluído com sucesso!");
                setListaDeListaEspera(listaDeListaEspera.filter(t => t.id !== listaEspera.id));
            } else {
                setMensagem("Erro ao excluir.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    
    const adicionarAluno = async (listaEspera) => {
        await excluirListaEspera(listaEspera, false); // Exclui direto, sem pedir confirmação
    
        navigate("/cadastroAluno", {
            state: {
                editando: true,
                nome: listaEspera.nome,
                dataNascimento: listaEspera.dataNascimento,
                responsavel: listaEspera.responsavel,
                rua: listaEspera.rua,
                numero: listaEspera.numero,
                escola: listaEspera.escola,
                telefone: listaEspera.telefone,
                periodoEscola: listaEspera.periodoEscola,
                realizaAcompanhamento: listaEspera.realizaAcompanhamento,
                possuiSindrome: listaEspera.possuiSindrome,
                descricao: listaEspera.descricao,
                dataInsercao: listaEspera.dataInsercao
            }
        });
    };
    

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // +1 porque Janeiro é 0
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };
    

    const listaEsperaFiltradas = pesquisaNome
        ? listaDeListaEspera.filter((listaEspera) => listaEspera.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeListaEspera;

    return (
        <PaginaGeral>
            <br />
            <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                <h2>Lista de Espera</h2>
            </Alert>
            <Form>
                <Form.Group className="form" controlId="exampleForm.ControlInput1">
                    <Form.Label>Pesquise a criança pelo nome</Form.Label>
                    <InputGroup className="divInput">
                        <Form.Control
                            className="formInput"
                            type="text"
                            placeholder="Nome da Criança"
                            value={pesquisaNome}
                            onChange={(e) => setPesquisaNome(e.target.value)}
                        />
                        <Button className="botaoPesquisa" variant="secondary">
                            Pesquisar
                        </Button>
                    </InputGroup>
                </Form.Group>
            </Form>
            <br />
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Responsável</th>
                            <th>Telefone</th>
                            <th>Data Inserção</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaEsperaFiltradas.map((listaEspera) => (
                            <tr key={listaEspera.id}>
                                <td>{listaEspera.id}</td>
                                <td>{listaEspera.nome}</td>
                                <td>{listaEspera.responsavel.nome}</td>
                                <td>{listaEspera.telefone}</td>
                                <td>{formatarData(listaEspera.dataInsercao)}</td>
                                <td>
                                    <Button
                                        as={Link}
                                        to="/cadastroListaEspera"
                                        state={{
                                            editando: true,
                                            id: listaEspera.id,
                                            nome: listaEspera.nome,
                                            dataNascimento: listaEspera.dataNascimento,
                                            responsavel: listaEspera.responsavel,
                                            rua: listaEspera.rua,
                                            numero: listaEspera.numero,
                                            escola: listaEspera.escola,
                                            telefone: listaEspera.telefone,
                                            periodoEscola: listaEspera.periodoEscola,
                                            realizaAcompanhamento: listaEspera.realizaAcompanhamento,
                                            possuiSindrome: listaEspera.possuiSindrome,
                                            descricao: listaEspera.descricao,
                                            dataInsercao: listaEspera.dataInsercao
                                        }}
                                        variant="warning"
                                        className="me-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                    </Button>

                                    <Button
                                        onClick={() => excluirListaEspera(listaEspera)}
                                        variant="danger"
                                        className="me-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </Button>

                                    <Button
                                        onClick={() => adicionarAluno(listaEspera)}
                                        variant="success"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                            <path d="M13.485 1.929a.75.75 0 0 1 1.06 1.06l-8.25 8.25-4.25-4.25a.75.75 0 0 1 1.06-1.06L6.5 8.69l7.485-7.485z"/>
                                        </svg>
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p>Quantidade de crianças cadastradas na lista de espera: {listaDeListaEspera.length}</p>
            </Container>

            <div className="mt-4">
                <Button as={Link} to="/telaListaEspera" variant="secondary" className="me-2">
                    Voltar
                </Button>
                <Button as={Link} to="/cadastroListaEspera" variant="secondary">
                    Cadastrar
                </Button>
            </div>
        </PaginaGeral>
    );
}
