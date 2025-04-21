import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';

export default function RelatorioMateria(){
    const [listaDenomes, setListaDeNomes] = useState([]); 
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const buscarMateria = async () => {
            try {
                const response = await fetch("http://localhost:3000/materias");
                if (!response.ok) throw new Error("Erro ao buscar matéria");
                
                const dados = await response.json();
                setListaDeNomes(dados); // atualiza com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar matéria:", error);
                setMensagem("Erro ao carregar as matérias.");
            }
        };

        buscarMateria();
    }, []);

    const excluirMaterias = async (materia) => {
        if(window.confirm("Deseja realmente excluir a matéria " + materia.nome + "?")){
            if (!materia || !materia.id) {
                setMensagem("Erro: matéria inválida!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/materias/" + materia.id, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Matéria excluída com sucesso!");
                    setListaDeNomes(listaDenomes.filter(m => m.id !== materia.id));
                } else {
                    setMensagem("Erro ao excluir a matéria.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        // opcional: atualizar a página após a exclusão
        window.location.reload();
    };

    return (
        <>
            <PaginaGeral>
                <br />
                <Alert className="mt-02 mb-02 text-center" variant="dark">
                    <h2>Matérias</h2>
                </Alert>
                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label>PESQUISE A MATÉRIA PELO NOME</Form.Label>
                        <InputGroup className="divInput">
                            <div>
                                <Form.Control
                                    className="formInput"
                                    type="text"
                                    placeholder="nome da matéria"
                                    value={pesquisaNome} 
                                    onChange={(e) => setPesquisaNome(e.target.value)}  
                                />
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
                <Container>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                // filtra as matérias conforme o nome pesquisado
                                listaDenomes
                                    .filter((materia) => 
                                        pesquisaNome
                                            ? materia.nome.toLowerCase().includes(pesquisaNome.toLowerCase())
                                            : true
                                    )
                                    .map((materia) => {
                                        return (
                                            <tr key={materia.id}> 
                                                <td>{materia.id}</td>
                                                <td>{materia.nome}</td>
                                                <td>{materia.descricao}</td>
                                                <td>
                                                    <Button 
                                                        onClick={() => navigate("/cadastroMateria",  { state: { id: materia.id, nome: materia.nome, descricao: materia.descricao } })}
                                                        variant="warning"
                                                    >
                                                        Editar
                                                    </Button> 
                                                    <Button 
                                                        onClick={() => excluirMaterias(materia)}
                                                        variant="danger"
                                                    >
                                                        Excluir
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                            }
                        </tbody>
                    </Table>
                    <p>Quantidade de matérias cadastradas: {listaDenomes.length}</p>
                </Container>
                <div>
                    <Button as={Link} to="/telaMateria" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                </div>
            </PaginaGeral>
        </>
    );
}