import { Alert, Form, Button, Row, Col, Container } from "react-bootstrap";
import "../../css/telaFuncionario.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/funcionarioForm.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";

export default function FormCadFuncionario() {
    const navigate = useNavigate();
    const [funcionario, setFuncionario] = useState({
        nome: "",
        cpf: "",
        cargo: "",
        nivel: 0,
        email: "",
        senha: ""
    });
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(location.state?.editando || false);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        if (editando && location.state) {
            setFuncionario({
                nome: location.state.nome,
                cpf: location.state.cpf,
                cargo: location.state.cargo,
                nivel: location.state.nivel,
                email: location.state.email,
                senha: location.state.senha
            });
        }
    }, [editando, location.state]);

    function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;

        // Atualiza o estado normalmente
        const novoFuncionario = { ...funcionario, [elemento]: valor };

        // Se o campo alterado for o cargo, atualize o nível automaticamente
        if (elemento === "cargo") {
            switch (valor) {
                case "ASSITENTE SOCIAL":
                    novoFuncionario.nivel = 1;
                    break;
                case "AUXILIAR ADMINISTRATIVO":
                    novoFuncionario.nivel = 2;
                    break;
                case "EDUCADOR SOCIAL I":
                    novoFuncionario.nivel = 4;
                    break;
                case "PSICOLOGO":
                case "RH":
                    novoFuncionario.nivel = 5;
                    break;
                case "EDUCADOR":
                    novoFuncionario.nivel = 6;
                    break;
                case "COORDENADOR":
                    novoFuncionario.nivel = 3;
                    break;
                default:
                    novoFuncionario.nivel = "";
            }
        }

        setFuncionario(novoFuncionario);
    }


    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verifique se todos os campos necessários estão preenchidos
        if (!funcionario.nome || !funcionario.cpf || !funcionario.cargo || !funcionario.email || !funcionario.senha) {
            setMensagem("Preencha todos os campos!");
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        // Verifique se o CPF é válido
        if (!validarCPF(funcionario.cpf)) {
            setMensagem("CPF inválido");
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        const url = editando ? `http://localhost:3000/funcionarios/${funcionario.cpf}` : "http://localhost:3000/funcionarios";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(funcionario)
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar dados.");
            }

            setMensagem(editando ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
            setTimeout(() => navigate("/relatorioFuncionario"), 2000);

        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };


    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <PaginaGeral>
                <Form onSubmit={handleSubmit} className="cadastroFuncionario">
                    <div className="TituloF">
                        <strong> <h2>Funcionários</h2>  </strong>
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


                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="nome"
                                    placeholder="Digite o nome"
                                    value={funcionario.nome}
                                    name="nome"
                                    onChange={manipularMudanca}
                                    className="inputFuncionario"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>CPF</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="cpf"
                                    placeholder="Digite o CPF"
                                    value={funcionario.cpf}
                                    name="cpf"
                                    onChange={manipularMudanca}
                                    disabled={editando}
                                    className="inputFuncionario"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Cargo</Form.Label>
                                <Form.Select
                                    value={funcionario.cargo}
                                    id="cargo"
                                    name="cargo"
                                    onChange={manipularMudanca}
                                    className="inputFuncionario"
                                >
                                    <option value="">Selecione um cargo</option>
                                    <option value="ASSITENTE SOCIAL">ASSISTENTE SOCIAL</option>
                                    <option value="AUXILIAR ADMINISTRATIVO">AUXILIAR ADMINISTRATIVO</option>
                                    <option value="COORDENADOR">COORDENADOR</option>
                                    <option value="EDUCADOR">EDUCADOR</option>
                                    <option value="EDUCADOR SOCIAL I">EDUCADOR SOCIAL I</option>
                                    <option value="PSICOLOGO">PSICÓLOGO</option>
                                    <option value="RH">RH</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Nível</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="nivel"
                                    value={funcionario.nivel}
                                    readOnly
                                    className="inputFuncionario"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    id="email"
                                    placeholder="xxxx@gmail.com"
                                    value={funcionario.email}
                                    name="email"
                                    onChange={manipularMudanca}
                                    className="inputFuncionario"
                                />
                            </Form.Group>
                        </Col>

                        {!editando && (
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        id="senha"
                                        placeholder="Digite a senha"
                                        value={funcionario.senha}
                                        name="senha"
                                        onChange={manipularMudanca}
                                        className="inputFuncionario"
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>

                    <div className="d-flex justify-content-between mt-4 margintop">
                        <Button
                            as={Link}
                            to="/telaMenu"
                            className="botaoPesquisa"
                            variant="secondary">
                            <IoArrowBackCircle size={20} /> Voltar
                        </Button>

                        <Button
                            as={Link}
                            to="/relatorioFuncionario"
                            className="botaoPesquisa"
                            variant="secondary"
                            style={{ backgroundColor: '#642ca9', borderColor: '#4f2f7fff' }}>
                            <TbReportSearch size={20} /> Relatorios
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
