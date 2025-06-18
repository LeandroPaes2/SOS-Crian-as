import { Alert, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../css/telaTurma.css";

export default function FormCadmateria() {
    const [id, setId] = useState(""); // novo estado para id
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        if (location.state && location.state.id && location.state.nome && location.state.descricao) {
            setId(location.state.id); // seta o id recebido
            setNome(location.state.nome);
            setDescricao(location.state.descricao);
            setEditando(true);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nome || !descricao) {
            setMensagem("Preencha todos os campos!");
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        const materia = { id, nome, descricao }; // inclui o id no objeto (mesmo que esteja vazio em inclusão)
        // Se estiver editando, utiliza a URL com o id; caso contrário, a URL normal de cadastro
        const url = editando 
                      ? `http://localhost:3000/materias/${id}` 
                      : "http://localhost:3000/materias";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(materia),
            });

            if (response.ok) {
                setMensagem(editando ? "Matéria atualizada com sucesso!" : "Matéria cadastrada com sucesso!");
            } else {
                setMensagem("Erro ao cadastrar a matéria.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="cadastroTurma">
            <PaginaGeral>
                <Alert className="alert-custom" style={{ marginTop: '200px' }} variant="dark">
                    <h2 className="titulo-alert">Oficinas</h2>
                </Alert>
                <h2 className=" mb-3" style={{ position: 'absolute',marginLeft: '220px', marginTop: '50px' }}>
                    {editando ? 'Editar' : 'Cadastrar'}
                </h2>

                {mensagem && (
                    <div style={{ position: 'absolute', marginTop: '100px', marginLeft: '230px' }}>
                        <Alert className="alert-animado mt-2 mb-2"  variant={
                            mensagem.toLowerCase().includes("sucesso") ? "success" :
                                mensagem.toLowerCase().includes("erro") || mensagem.toLowerCase().includes("preencha") ? "danger" : "warning"
                        }>
                            {mensagem}
                        </Alert>
                        </div>
                    )}

                <Form onSubmit={handleSubmit} style={{ marginTop: '190px', marginRight: '170px', gap: '45px'}}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '500' }}>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="inputOficina"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '500' }}>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="inputOficina"
                        />
                    </Form.Group>

                    <Button as={Link} to="/telaMenu" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                    <Button className="botaoPesquisa" variant="primary" type="submit">
                        {editando ? "Atualizar" : "Cadastrar"}
                    </Button>
                </Form>
            </PaginaGeral>
        </div>
    );
}