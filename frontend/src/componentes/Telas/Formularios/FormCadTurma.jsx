import { Alert, Form, Button, Row, Col } from "react-bootstrap";
import "../../css/telaTurma.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";


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
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <PaginaGeral>
                <Form onSubmit={handleSubmit} className="cadastroTurma">

                    <div className="TituloT">
                        <strong> <h2>Turmas</h2>  </strong>
                    </div>

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

                    <Row>
                        <Col md={6}>
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
                        </Col>

                        <Col md={6}>
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
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-4 margintop">
                        <Button
                            as={Link}
                            to="/telaMenu"
                            className="botaoPesquisa"
                            variant="secondary">
                            <IoArrowBackCircle size={20} />  Voltar
                        </Button>

                        <Button
                            as={Link}
                            to="/relatorioTurma"
                            className="botaoPesquisa"
                            variant="secondary"
                            style={{ backgroundColor: '#642ca9', borderColor: '#4f2f7fff' }}>
                            <TbReportSearch size={20} />  Relatórios
                        </Button>

                        <Button
                            className="botaoPesquisa"
                            variant="primary"
                            type="submit"
                            style={{ backgroundColor: '#ffba49', borderColor: '#e09722ff' }}>
                            <TbSend />
                            {editando ? "  Atualizar" : "  Cadastrar"}
                        </Button>
                    </div>
                </Form>
            </PaginaGeral>
        </div>
    );
}
