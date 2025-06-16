import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';
import "../../css/telaEscola.css";

export default function RelatorioEscolas() {
  const [listaDeEscolas, setListaDeEscolas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [pesquisaNome, setPesquisaNome] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");


  useEffect(() => {
    const buscarEscolas = async () => {
      try {
        const response = await fetch("http://localhost:3000/escolas", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Erro ao buscar escolas");

        const dados = await response.json();
        setListaDeEscolas(dados);
      } catch (error) {
        console.error("Erro ao buscar escolas:", error);
        setMensagem("Erro ao carregar as escolas.");
      }
    };

    buscarEscolas();
  }, []);

  const excluirEscolas = async (escola) => {
    if (window.confirm("Deseja realmente excluir a escola " + escola.nome)) {
      if (!escola || !escola.id) {
        setMensagem("Erro: escola inválida!");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/escolas/${escola.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          setMensagem("Escola excluída com sucesso!");
          setListaDeEscolas(listaDeEscolas.filter(e => e.id !== escola.id));
        } else {
          setMensagem("Erro ao excluir a escola.");
        }
      } catch (error) {
        console.error("Erro ao conectar com o backend:", error);
        setMensagem("Erro de conexão com o servidor.");
      }
    }
  };

  const editarEscolas = (escola) => {
    navigate("/cadastroEscola", {
      state: {
        id: escola.id,
        nome: escola.nome,
        endereco: escola.endereco,
        telefone: escola.telefone,
        tipo: escola.tipo
      }
    });
  };

  const escolasFiltradas = pesquisaNome
    ? listaDeEscolas.filter((escola) =>
      escola.nome.toLowerCase().includes(pesquisaNome.toLowerCase())
    )
    : listaDeEscolas;

  return (
    <div className="topo">
      <>
        <PaginaGeral>
          <Container className="form-container mt-4">
            <Alert className="alert-custom text-center" variant="dark">
              <h2 className="titulo-alert">Escolas</h2>
            </Alert>

            <Form className="mb-4">
              <Form.Group controlId="formPesquisaNome">
                <Form.Label className="fw-semibold">Pesquise a escola pelo nome:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome da escola..."
                    value={pesquisaNome}
                    onChange={(e) => setPesquisaNome(e.target.value)}
                  />
                  <Button variant="secondary">Pesquisar</Button>
                </InputGroup>
              </Form.Group>
            </Form>

            {mensagem && (
              <Alert
                className="text-center"
                variant={
                  mensagem.toLowerCase().includes("sucesso")
                    ? "success"
                    : mensagem.toLowerCase().includes("erro")
                      ? "danger"
                      : "warning"
                }
              >
                {mensagem}
              </Alert>
            )}

            <Table responsive striped hover borderless className="mt-3">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {escolasFiltradas?.map((escola) => (
                  <tr key={escola.id}>
                    <td>{escola.nome}</td>
                    <td>{escola.endereco}</td>
                    <td>{escola.telefone}</td>
                    <td>{escola.tipo}</td>
                    <td>
                      <Button
                        onClick={() => editarEscolas(escola)}
                        variant="warning"
                        size="sm"
                        className="me-2"
                        title="Editar"
                      >
                        ✏️
                      </Button>
                      <Button
                        onClick={() => excluirEscolas(escola)}
                        variant="danger"
                        size="sm"
                        title="Excluir"
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div>
              <Button as={Link} to="/telaEscola" className="botaoPesquisa" variant="secondary">
                Voltar
              </Button>
            </div>
          </Container>
        </PaginaGeral>

      </>
    </div>
  );
}
