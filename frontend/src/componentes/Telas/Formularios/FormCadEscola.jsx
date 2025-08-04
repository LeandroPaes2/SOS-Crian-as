import { Alert, Form, Button, Row, Col } from "react-bootstrap";
import "../../css/telaEscola.css";
import { useEffect, useState } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoArrowBackCircle, IoSave } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";


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
        <div style={{ height: "100vh", overflow: "hidden" }}>
            <PaginaGeral>
                <Form onSubmit={handleSubmit} className="cadastroEscola">
                    <div className="TituloF">
                        <strong> <h2>Escolas</h2>  </strong>
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
                        </Col>

                        <Col md={6}>
                            {/* Tipo */}
                            <Form.Group className="mb-4">
                                <Form.Label >Tipo</Form.Label>
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
                        </Col>

                    </Row>
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


                    {/* Botões */}
                    <div className="d-flex justify-content-between mt-4 margintop">
                        <Button
                            as={Link}
                            to={rotaVoltar}
                            className="botaoPesquisa"
                            variant="secondary">
                            <IoArrowBackCircle size={20} />  Voltar
                        </Button>

                        <Button
                            as={Link}
                            to="/relatorioEscola"
                            className="botaoPesquisa"
                            variant="secondary"
                            style={{ backgroundColor: '#642ca9', borderColor: '#4f2f7fff' }}>
                            <TbReportSearch size={20} />  Relatórios
                        </Button>

                        <Button
                            type="submit"
                            className="botaoPesquisa"
                            variant="primary"
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
