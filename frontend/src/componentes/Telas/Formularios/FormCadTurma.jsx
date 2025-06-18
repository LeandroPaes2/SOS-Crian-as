import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaTurma.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FormCadTurma() {
    const [cor, setCor] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [turma, setTurma] = useState(cor, periodo);
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        if (location.state?.id) {
            setId(location.state.id);
            setCor(location.state.cor);
            setPeriodo(location.state.periodo);
            setEditando(true);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();


        if (!cor.trim || !periodo.trim) {
            setMensagem("Preencha todos os campos obrigatórios!");
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        const turma = {
            cor: cor.trim(),
            periodo: periodo.trim()
        };
        const url = editando
            ? `http://localhost:3000/turmas/${id}`
            : "http://localhost:3000/turmas";
        const method = editando ? "PUT" : "POST";

        try {
            if (editando) {
                const confirmar = window.confirm(`Deseja realmente atualizar a turma: ${turma.cor}?`);
                if (!confirmar) return;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(turma)
            });

            if (response.ok) {
                setMensagem(editando
                    ? "Turma atualizada com sucesso!"
                    : "Turma cadastrada com sucesso!");

                setTimeout(() => {
                    setId(null);
                    setCor("");
                    setPeriodo("");
                    setEditando(false);
                    navigate("/relatorioTurma");
                }, 2000);
            } else {
                setMensagem(editando
                    ? "Erro ao atualizar a turma."
                    : "Erro ao cadastrar a turma.");
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
                    <h2 className="titulo-alert">Turmas</h2>
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
                        <Form.Label style={{ fontWeight: '500' }}>Cor</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a cor"
                            value={turma.cor}
                            onChange={(e) => setCor(e.target.value)}
                            disabled={editando}
                            className="inputTurma"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '500' }}>Período</Form.Label>
                        <Form.Select
                            value={turma.periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="inputTurma"
                        >
                            <option value="">Selecione um período</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button as={Link} to="/telaMenu" className="botaoPesquisa" variant="secondary">
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
