import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaEscola.css";
import { useEffect, useState } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function FormCadEscola() {
    const [nome, setNome] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipo, setTipo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [editando, setEditando] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const rotaVoltar = editando ? "/relatorioEscola" : "/telaEscola";

    useEffect(() => {
        if (location.state?.nome && location.state?.endereco) {
            setNome(location.state.nome);
            setEndereco(location.state.endereco);
            setTelefone(location.state.telefone || "");
            setTipo(location.state.tipo || "");
            setEditando(true);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nome.trim() || !endereco.trim() || !telefone.trim() || !tipo.trim()) {
            setMensagem("Preencha todos os campos obrigatórios!");
            return;
        }

        const escola = {
            nome: nome.trim(),
            endereco: endereco.trim(),
            telefone: telefone.trim(),
            tipo: tipo.trim(),
        };

        const url = editando
            ? `http://localhost:3000/escolas/${encodeURIComponent(nome)}`
            : "http://localhost:3000/escolas";
        const method = editando ? "PUT" : "POST";

        try {
            if (editando) {
                const confirmar = window.confirm(`Deseja realmente atualizar a escola: ${escola.nome}?`);
                if (!confirmar) return;
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(escola),
            });

            if (response.ok) {
                setMensagem(editando
                    ? "Escola atualizada com sucesso!"
                    : "Escola cadastrada com sucesso!");

                setTimeout(() => {
                    setNome("");
                    setEndereco("");
                    setTelefone("");
                    setTipo("");
                    setMensagem("");
                    setEditando(false);
                    navigate("/relatorioEscola");
                }, 2000);
            } else {
                setMensagem(editando
                    ? "Erro ao atualizar a escola."
                    : "Erro ao cadastrar a escola.");
            }

        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div>
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>{editando ? "Editar Escola" : "Cadastro de Escola"}</h2>
                </Alert>

                {mensagem && (
                    <Alert className="mt-2 mb-2 text-center" variant={
                        mensagem.toLowerCase().includes("sucesso") ? "success" :
                        mensagem.toLowerCase().includes("erro") || mensagem.toLowerCase().includes("preencha")
                            ? "danger" : "warning"
                    }>
                        {mensagem}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            isInvalid={mensagem && nome.trim() === ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            O nome é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o endereço"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            isInvalid={mensagem && endereco.trim() === ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            O endereço é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="(99) 99999-9999"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            isInvalid={mensagem && telefone.trim() === ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            O telefone é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            isInvalid={mensagem && tipo.trim() === ""}
                        >
                            <option value="">Selecione o tipo</option>
                            <option value="Pública">Pública</option>
                            <option value="Privada">Privada</option>
                            <option value="Filantrópica">Filantrópica</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            O tipo é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
                            Voltar
                        </Button>
                        <Button className="botaoPesquisa" variant="primary" type="submit">
                            {editando ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>
                </Form>
            </PaginaGeral>
        </div>
    );
}
