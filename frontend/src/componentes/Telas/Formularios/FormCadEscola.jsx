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
    const [id, setId] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [editando, setEditando] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const rotaVoltar = editando ? "/relatorioEscola" : "/telaMenu";

    useEffect(() => {
        if (location.state?.id) {
            setId(location.state.id);
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
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        const escola = {
            nome: nome.trim(),
            endereco: endereco.trim(),
            telefone: telefone.trim(),
            tipo: tipo.trim(),
        };

        const url = editando
            ? `http://localhost:3000/escolas/${id}`
            : "http://localhost:3000/escolas";

        const method = editando ? "PUT" : "POST";

        try {
            if (editando) {
                const confirmar = window.confirm(`Deseja realmente atualizar a escola: ${escola.nome}?`);
                if (!confirmar) return;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(escola),
            });

            if (response.ok) {
                setMensagem(editando
                    ? "Escola atualizada com sucesso!"
                    : "Escola cadastrada com sucesso!");

                setTimeout(() => {
                    setId(null);
                    setNome("");
                    setEndereco("");
                    setTelefone("");
                    setTipo("");
                    setMensagem("");
                    setEditando(false);
                    navigate("/relatorioEscola");
                }, 3000);
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

    const handleTelefoneChange = (e) => {
        let input = e.target.value.replace(/\D/g, "");

        if (input.length > 11) input = input.slice(0, 11);

        let formatted = input;

        if (input.length > 0) {
            formatted = `(${input.slice(0, 2)}`;
        }
        if (input.length >= 3) {
            formatted += `) ${input.slice(2, 7)}`;
        }
        if (input.length >= 8) {
            formatted += `-${input.slice(7, 11)}`;
        }

        setTelefone(formatted);
    };


    return (
        <div className="cadastroEscola" >
            <PaginaGeral>
                <Alert className="alert-custom" style={{ marginTop: '200px' }} variant="dark">
                    <h2 className="titulo-alert">Escolas</h2>
                </Alert>
                <h2 className=" mb-3" style={{ position: 'absolute', marginLeft: '220px', marginTop: '50px' }}>
                    {editando ? 'Editar' : 'Cadastrar'}
                </h2>

                {mensagem && (
                    <div style={{ position: 'absolute', marginTop: '100px', marginLeft: '230px' }}>
                        <Alert className="alert-animado mt-2 mb-2" variant={
                            mensagem.toLowerCase().includes("sucesso") ? "success" :
                                mensagem.toLowerCase().includes("erro") || mensagem.toLowerCase().includes("preencha") ? "danger" : "warning"
                        }>
                            {mensagem}
                        </Alert>
                    </div>
                )}
                <Form onSubmit={handleSubmit} style={{ marginTop: '190px', marginRight: '270px' }}>
                    {/* Nome */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '500' }}>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            isInvalid={mensagem && nome.trim() === ""}
                            className="inputEscola"
                        />
                        <Form.Control.Feedback type="invalid">
                            O nome é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Endereço */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '500' }}>Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o endereço"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            isInvalid={mensagem && endereco.trim() === ""}
                            className="inputEscola"
                        />
                        <Form.Control.Feedback type="invalid">
                            O endereço é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Telefone */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '500' }}>Telefone</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="(99) 99999-9999"
                            value={telefone}
                            onChange={handleTelefoneChange}
                            isInvalid={mensagem && telefone.trim() === ""}
                            className="inputEscola"
                        />
                        <Form.Control.Feedback type="invalid">
                            O telefone é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Tipo */}
                    <Form.Group className="mb-4">
                        <Form.Label style={{ fontWeight: '500' }}>Tipo</Form.Label>
                        <Form.Select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            isInvalid={mensagem && tipo.trim() === ""}
                            className="inputEscola"
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

                    {/* Botões */}
                    <div className="d-flex justify-content-between">
                        <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
                            Voltar
                        </Button>
                        <Button type="submit" className="botaoPesquisa" variant="primary">
                            {editando ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>
                </Form>

            </PaginaGeral>
        </div>
    );
}
