import { Alert, Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/telaFamilia.css";

export default function FormCadFamilia() {
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [sexo, setSexo] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [grauParentesco, setGrauParentesco] = useState("");
    const [profissao, setProfissao] = useState("");
    const [escolaridade, setEscolaridade] = useState("");
    const [irmaos, setIrmaos] = useState("");
    const [temContato, setTemContato] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [editando, setEditando] = useState(false);
    const [isMaior, setIsMaior] = useState(true);
    const [ehMaiorDeIdade, setEhMaiorDeIdade] = useState(true);


    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const navigate = useNavigate();
    const location = useLocation();

    const rotaVoltar = editando ? "/relatorioFamilia" : "/telaMenu";

    useEffect(() => {
        if (location.state) {
            setId(location.state.id || "");
            setNome(location.state.nome || "");
            setSexo(location.state.sexo || "");
            setDataNascimento(location.state.dataNascimento || "");
            setGrauParentesco(location.state.grauParentesco || "");
            setProfissao(location.state.profissao || "");
            setEscolaridade(location.state.escolaridade || "");
            setIrmaos(location.state.irmaos || "");
            setTemContato(location.state.temContato || "");
            setEditando(true);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nome.trim() || !sexo.trim() || !dataNascimento.trim() || !grauParentesco.trim() || !profissao.trim() || !escolaridade.trim() || !irmaos.trim() || !temContato.trim()) {
            setMensagem("Preencha todos os campos!");
            setTimeout(() => setMensagem(""), 5000);
            return;
        }

        const familia = {
            nome,
            sexo,
            dataNascimento,
            grauParentesco,
            profissao,
            escolaridade,
            irmaos,
            temContato
        };


        const url = editando
            ? `http://localhost:3000/familias/${id}`
            : "http://localhost:3000/familias";

        const method = editando ? "PUT" : "POST";

        try {
            if (editando) {
                const confirmar = window.confirm(`Deseja realmente atualizar a familia: ${familia.nome}?`);
                if (!confirmar) return;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(familia)
            });

            if (response.ok) {
                setMensagem(editando
                    ? "Familia atualizada com sucesso!"
                    : "Familia cadastrada com sucesso!");

                setTimeout(() => {
                    setId(null);
                    setNome("");
                    setSexo("");
                    setDataNascimento("");
                    setGrauParentesco("");
                    setProfissao("");
                    setEscolaridade("");
                    setIrmaos("");
                    setTemContato("");
                    setEditando(false);
                }, 5000);
            } else {
                setMensagem("Erro ao cadastrar a familia.");
            }

        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
        setTimeout(() => setMensagem(""), 5000);
    }



    return (
        <div className="cadastroFamilia">
            <PaginaGeral>
                <Alert className="alert-custom" style={{ marginTop: '200px' }} variant="dark">
                    <h2 className="titulo-alert">Familias</h2>
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
                <Form onSubmit={handleSubmit} style={{ marginTop: '190px', marginRight: '100px' }}>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    isInvalid={mensagem && nome.trim() === ""}
                                    className="inputFamilia"
                                />
                                <Form.Control.Feedback type="invalid">
                                    O nome é obrigatório.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Sexo</Form.Label>
                                <Form.Select
                                    value={sexo}
                                    onChange={(e) => setSexo(e.target.value)}
                                    isInvalid={mensagem && sexo.trim() === ""}
                                    className="inputFamilia"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    O sexo é obrigatório.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Data de nascimento</Form.Label>
                                <Form.Control
    type="date"
    value={dataNascimento}
    onChange={(e) => {
        const data = e.target.value;
        setDataNascimento(data);

        const nascimento = new Date(data);
        const hoje = new Date();
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        const dia = hoje.getDate() - nascimento.getDate();

        const ehMaior =
            idade > 18 || (idade === 18 && (mes > 0 || (mes === 0 && dia >= 0)));

        setEhMaiorDeIdade(ehMaior);
    }}
    max={new Date().toISOString().split("T")[0]}
    isInvalid={mensagem && (!ehMaiorDeIdade || dataNascimento.trim() === "")}
    className="inputFamilia"
/>
<Form.Control.Feedback type="invalid">
    {dataNascimento.trim() === ""
        ? "A data de nascimento é obrigatória."
        : "A pessoa precisa ter 18 anos ou mais."}
</Form.Control.Feedback>


                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Grau de parentesco</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o grau de parentesco"
                                    value={grauParentesco}
                                    onChange={(e) => setGrauParentesco(e.target.value)}
                                    isInvalid={mensagem && grauParentesco.trim() === ""}
                                    className="inputFamilia"
                                />
                                <Form.Control.Feedback type="invalid">
                                    O grau de parentesco é obrigatório.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Profissão</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite a profissão"
                                    value={profissao}
                                    onChange={(e) => setProfissao(e.target.value)}
                                    isInvalid={mensagem && profissao.trim() === ""}
                                    className="inputFamilia"
                                />
                                <Form.Control.Feedback type="invalid">
                                    A profissão é obrigatória.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Escolaridade</Form.Label>
                                <Form.Select
                                    value={escolaridade}
                                    onChange={(e) => setEscolaridade(e.target.value)}
                                    isInvalid={mensagem && escolaridade.trim() === ""}
                                    className="inputFamilia"
                                >
                                    <option value="">Selecione a escolaridade</option>
                                    <option value="Ensino fundamental Incompleto">Fundamental Incompleto</option>
                                    <option value="Ensino fundamental Completo">Fundamental Completo</option>
                                    <option value="Ensino Medio Incompleto">Ensino Médio Incompleto</option>
                                    <option value="Ensino Medio Completo">Ensino Médio Completo</option>
                                    <option value="Superior Incompleto">Superior Incompleto</option>
                                    <option value="Superior Completo">Superior Completo</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    A escolaridade é obrigatória.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Tem contato?</Form.Label>
                                <Form.Select
                                    value={temContato}
                                    onChange={(e) => setTemContato(e.target.value)}
                                    isInvalid={mensagem && temContato.trim() === ""}
                                    className="inputFamilia"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Nao">Não</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    O contato é obrigatório.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Irmãos</Form.Label>
                                <Form.Select
                                    value={irmaos}
                                    onChange={(e) => setIrmaos(e.target.value)}
                                    isInvalid={mensagem && irmaos.trim() === ""}
                                    className="inputFamilia"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Mesmo pai e mãe">Mesmo pai e mãe</option>
                                    <option value="Por parte de pai">Por parte de pai</option>
                                    <option value="Por parte de mae">Por parte de mãe</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Nao">Não</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Se tem irmãos é obrigatório.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-between mt-4">
                        <Button as={Link} to={rotaVoltar} variant="secondary" className="botaoPesquisaFamilia">
                            Voltar
                        </Button>
                        <Button className="botaoPesquisaFamilia" variant="primary" type="submit">
                            {editando ? "Editar" : "Cadastrar"}
                        </Button>
                    </div>
                </Form>



            </PaginaGeral>
        </div>
    )
}