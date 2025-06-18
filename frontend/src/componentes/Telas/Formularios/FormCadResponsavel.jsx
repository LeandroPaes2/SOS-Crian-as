import { Alert, Form, Button, Row, Col } from "react-bootstrap";
import "../../css/telaTurma.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../css/alerts.css";
import { useNavigate } from 'react-router-dom';
import Cleave from 'cleave.js/react';
import "../../css/responsavel.css"

export default function FormCadResponsavel(props) {
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [sexo, setSexo] = useState("");
    const [dtNascimento, setDtNascimento] = useState("");
    const [estCivil, setEstCivil] = useState("");
    const [conjuge, setConjuge] = useState("");
    const [profissao, setProfissao] = useState("");
    const [situTrabalho, setSituTrabalho] = useState("");
    const [escolaridade, setEscolaridade] = useState("");
    const [rendaFamiliar, setRendaFamiliar] = useState("");
    const [valorRenda, setValorRenda] = useState(0);
    const [qtdeTrabalhadores, setQtdeTrabalhadores] = useState(0);
    const [pensaoAlimenticia, setPensaoAlimenticia] = useState("");
    const [valorPensao, setValorPensao] = useState(0);
    const [pagadorPensao, setPagadorPensao] = useState("");
    const [beneficioSocial, setBeneficioSocial] = useState("");
    const [tipoBeneficio, setTipoBeneficio] = useState("");
    const [valorBeneficio, setValorBeneficio] = useState(0);
    const [beneficiario, setBeneficiario] = useState("");
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        if (location.state && location.state.cpf && location.state.rg && location.state.nome && location.state.telefone && location.state.email && location.state.sexo && location.state.dtNascimento && location.state.estCivil && location.state.conjuge && location.state.situTrabalho && location.state.escolaridade && location.state.rendaFamiliar && location.state.qtdeTrabalhadores && location.state.pensaoAlimenticia && location.state.beneficioSocial) {
            setCpf(location.state.cpf);
            setRg(location.state.rg);
            setNome(location.state.nome);
            setTelefone(location.state.telefone);
            setEmail(location.state.email);
            setSexo(location.state.sexo);
            setDtNascimento(location.state.dtNascimento);
            setEstCivil(location.state.estCivil);
            setConjuge(location.state.conjuge);
            setSituTrabalho(location.state.situTrabalho);
            setProfissao(location.state.profissao);
            setEscolaridade(location.state.escolaridade);
            setRendaFamiliar(location.state.rendaFamiliar);
            setValorRenda(location.state.valorRenda);
            setQtdeTrabalhadores(location.state.qtdeTrabalhadores);
            setPensaoAlimenticia(location.state.pensaoAlimenticia);
            setValorPensao(location.state.valorPensao);
            setPagadorPensao(location.state.pagadorPensao);
            setBeneficioSocial(location.state.beneficioSocial);
            setTipoBeneficio(location.state.tipoBeneficio);
            setValorBeneficio(location.state.valorBeneficio);
            setBeneficiario(location.state.beneficiario);
            setEditando(true);  // Ativa o modo de edição
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita recarregar a página

        // Verifica se os campos estão preenchidos
        if (!cpf || !rg || !nome || !telefone || !email || !sexo || !dtNascimento || !estCivil || !conjuge || !situTrabalho || !escolaridade || !rendaFamiliar || !pensaoAlimenticia || !beneficioSocial) {
            setMensagem("Preencha todos os campos!");
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        const responsavel = { cpf, rg, nome, telefone, email, sexo, dtNascimento, estCivil, conjuge, profissao, situTrabalho, escolaridade, rendaFamiliar, valorRenda, qtdeTrabalhadores, pensaoAlimenticia, valorPensao, pagadorPensao, beneficioSocial, tipoBeneficio, valorBeneficio, beneficiario };
        const url = editando ? `http://localhost:3000/responsaveis/${cpf}` : "http://localhost:3000/responsaveis";
        const method = editando ? "PUT" : "POST";
        console.log(token);

        try {
            if (editando) {
                if (!window.confirm("Deseja realmente alterar o responsavel: " + responsavel.cpf)) {
                    return;
                }
            }
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(responsavel),
            });

            console.log(JSON.stringify(responsavel));

            if (response.ok) {
                setMensagem(editando ? "Responsavel atualizado com sucesso!" : "Responsavel cadastrado com sucesso!");
                setTimeout(() => setCpf(""), 3000);
                setTimeout(() => setRg(""), 3000);
                setTimeout(() => setNome(""), 3000);
                setTimeout(() => setTelefone(""), 3000);
                setTimeout(() => setEmail(""), 3000);
                setTimeout(() => setSexo(""), 3000);
                setTimeout(() => setDtNascimento(""), 3000);
                setTimeout(() => setEstCivil(""), 3000);
                setTimeout(() => setConjuge(""), 3000);
                setTimeout(() => setProfissao(""), 3000);
                setTimeout(() => setSituTrabalho(""), 3000);
                setTimeout(() => setEscolaridade(""), 3000);
                setTimeout(() => setRendaFamiliar(""), 3000);
                setTimeout(() => setValorRenda(0), 3000);
                setTimeout(() => setQtdeTrabalhadores(0), 3000);
                setTimeout(() => setPensaoAlimenticia(""), 3000);
                setTimeout(() => setValorPensao(0), 3000);
                setTimeout(() => setPagadorPensao(""), 3000);
                setTimeout(() => setBeneficioSocial(""), 3000);
                setTimeout(() => setTipoBeneficio(""), 3000);
                setTimeout(() => setValorBeneficio(0), 3000);
                setTimeout(() => setBeneficiario(""), 3000);
                setTimeout(() => setMensagem(""), 3000);

                    setTimeout(() => {
                        navigate("/relatorioResponsavel");
                    }, 3000);
                
                setEditando(false);
            } else {
                    const erroResposta = await response.json(); // 👈 Lê o JSON de erro
                    const mensagemErro = erroResposta?.mensagem || "Erro inesperado no servidor.";
                    setMensagem(mensagemErro);
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <PaginaGeral >
            <div className="TelaD">
                <div className="divTitulo">
                    <h2 className="titulo-alert">Responsavel</h2>
                </div>


                <h2 className=" mb-3" style={{ marginLeft: '100px', marginTop: '50px', justifyItems: 'center' }}>
                    {editando ? 'Editar' : 'Cadastrar'}
                </h2>


                <Form onSubmit={handleSubmit}  >





                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group id="cpf">
                                <Form.Label>CPF</Form.Label>
                                <Cleave
                                    className="form-control inputResponsavel"
                                    placeholder="000.000.000-00"
                                    options={{ delimiters: ['.', '.', '-'], blocks: [3, 3, 3, 2], numericOnly: true }}
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    disabled={editando}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group id="rg">
                                <Form.Label>RG</Form.Label>
                                <Cleave
                                    className="form-control inputResponsavel"
                                    placeholder="RG"
                                    value={rg}
                                    onChange={(e) => setRg(e.target.value)}
                                    disabled={editando}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group id="nome">
                                <Form.Label>Nome Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="inputResponsavel"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group id="telefone">
                                <Form.Label>Telefone</Form.Label>
                                <Cleave
                                    className="form-control inputResponsavel"
                                    placeholder="(00) 00000-0000"
                                    options={{ delimiters: ['(', ') ', '-'], blocks: [0, 2, 5, 4], numericOnly: true }}
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    disabled={editando}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Digite o email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="inputResponsavel"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group id="sexo">
                                <Form.Label>Sexo</Form.Label>
                                <Form.Select value={sexo} onChange={(e) => setSexo(e.target.value)} className="inputResponsavel" style={{ width: '100%' }}>
                                    <option value="">Selecione</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Outro">Outro</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group id="dataNascimento">
                                <Form.Label>Nascimento</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dtNascimento}
                                    onChange={(e) => setDtNascimento(e.target.value)}
                                    className="inputResponsavel"
                                    style={{ width: '100%' }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Exemplo com mais colunas */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group id="estCivil">
                                <Form.Label>Estado Civil</Form.Label>
                                <Form.Select value={estCivil} onChange={(e) => setEstCivil(e.target.value)} className="inputResponsavel">
                                    <option value="">Selecione</option>
                                    <option value="Solteiro">Solteiro</option>
                                    <option value="Casado">Casado</option>
                                    <option value="Separado">Separado</option>
                                    <option value="Divorciado">Divorciado</option>
                                    <option value="Viúvo">Viúvo</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group id="conjuge">
                                <Form.Label>Possui cônjuge?</Form.Label>
                                <Form.Select value={conjuge} onChange={(e) => setConjuge(e.target.value)} className="inputResponsavel">
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Nao">Não</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="situTrabalho">
                                <Form.Label>Situação de trabalho</Form.Label>
                                <Form.Select value={situTrabalho} onChange={(e) => setSituTrabalho(e.target.value)} className="inputResponsavel">
                                    <option value="">Selecione uma resposta</option>
                                    <option value="Empregado">Empregado</option>
                                    <option value="Desempregado">Desempregado</option>
                                    <option value="Bicos esporadicos">Bicos esporádicos</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {situTrabalho === "Empregado" && (
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Group controlId="profissao">
                                    <Form.Label>Profissão</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite a profissão"
                                        value={profissao}
                                        onChange={(e) => setProfissao(e.target.value)}
                                        className="inputResponsavel"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="escolaridade">
                                <Form.Label>Escolaridade</Form.Label>
                                <Form.Select value={escolaridade} onChange={(e) => setEscolaridade(e.target.value)} className="inputResponsavel">
                                    <option value="">Selecione uma escolaridade</option>
                                    <option value="Ensino fundamemntal incompleto">Ensino fundamental incompleto</option>
                                    <option value="Ensino fundamental completo">Ensino fundamental completo</option>
                                    <option value="Ensino medio incompleto">Ensino médio incompleto</option>
                                    <option value="Ensino medio completo">Ensino médio completo</option>
                                    <option value="Superior incompleto">Superior incompleto</option>
                                    <option value="Superior completo">Superior completo</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="rendaFamiliar">
                                <Form.Label>Renda familiar</Form.Label>
                                <Form.Select value={rendaFamiliar} onChange={(e) => setRendaFamiliar(e.target.value)} className="inputResponsavel">
                                    <option value="">Selecione uma opção</option>
                                    <option value="Nao possui renda">Não possui renda</option>
                                    <option value="1/2 salario">1/2 salário</option>
                                    <option value="1 salario minimo">1 salário mínimo</option>
                                    <option value="1 a 3 salarios minimos">1 a 3 salários mínimos</option>
                                    <option value="4 a 5 salarios minimos">4 a 5 salários mínimos</option>
                                    <option value="Acima de 6 salarios minimos">Acima de 6 salários mínimos</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {rendaFamiliar !== "Nao possui renda" && (
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="valorRenda">
                                    <Form.Label>Valor da renda familiar</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        placeholder="Digite o valor"
                                        value={valorRenda}
                                        onChange={(e) => setValorRenda(e.target.value === "" ? null : parseFloat(e.target.value))}
                                        className="inputResponsavel"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="qtdeTrabalhadores">
                                    <Form.Label>Quantos trabalham?</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Digite a quantidade"
                                        value={qtdeTrabalhadores}
                                        onChange={(e) => setQtdeTrabalhadores(e.target.value === "" ? null : parseInt(e.target.value))}
                                        className="inputResponsavel"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="pensaoAlimenticia">
                                <Form.Label>Possui pensão alimentícia?</Form.Label>
                                <Form.Select value={pensaoAlimenticia} onChange={(e) => setPensaoAlimenticia(e.target.value)} className="inputResponsavel">
                                    <option value="">Selecione uma resposta</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Nao">Não</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {pensaoAlimenticia === "Sim" && (
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group controlId="valorPensao">
                                    <Form.Label>Valor da pensão</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        placeholder="Digite o valor"
                                        value={valorPensao}
                                        onChange={(e) => setValorPensao(e.target.value === "" ? null : parseFloat(e.target.value))}
                                        className="inputResponsavel"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="pagadorPensao">
                                    <Form.Label>Quem fornece a pensão?</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o nome"
                                        value={pagadorPensao}
                                        onChange={(e) => setPagadorPensao(e.target.value)}
                                        className="inputResponsavel"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="beneficioSocial">
                                <Form.Label>Possui algum benefício social?</Form.Label>
                                <Form.Select value={beneficioSocial} onChange={(e) => setBeneficioSocial(e.target.value)} className="inputResponsavel">
                                    <option value="">Selecione uma resposta</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Nao">Não</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {beneficioSocial === "Sim" && (
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group controlId="tipoBeneficio">
                                    <Form.Label>Qual o benefício?</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o nome"
                                        value={tipoBeneficio}
                                        onChange={(e) => setTipoBeneficio(e.target.value)}
                                        className="inputResponsavel"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="valorBeneficio">
                                    <Form.Label>Valor do benefício</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        placeholder="Digite o valor"
                                        value={valorBeneficio}
                                        onChange={(e) => setValorBeneficio(e.target.value === "" ? null : parseFloat(e.target.value))}
                                        className="inputResponsavel"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="beneficiario">
                                    <Form.Label>Beneficiário</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o beneficiário"
                                        value={beneficiario}
                                        onChange={(e) => setBeneficiario(e.target.value)}
                                        className="inputResponsavel"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}
                    {mensagem && (
                        <div style={{ }}>
                            <Alert className="alert-animado mt-2 mb-2" variant={
                                mensagem.toLowerCase().includes("sucesso") ? "success" :
                                    mensagem.toLowerCase().includes("erro") || mensagem.toLowerCase().includes("preencha") ? "danger" : "warning"
                            }>
                                {mensagem}
                            </Alert>
                        </div>
                    )}

                    {/* Botões */}
                    <Row className="mt-4">
                        <Col md={4}>
                            <Button as={Link} to="/telaMenu" className="w-100 botaoPesquisa" variant="secondary">
                                Voltar
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Button as={Link} to="/relatorioResponsavel" className="w-100 botaoPesquisa" variant="secondary">
                                Relatório
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Button className="w-100 botaoPesquisa" variant="primary" type="submit">
                                {editando ? "Atualizar" : "Cadastrar"}
                            </Button>
                        </Col>
                    </Row>

                </Form>
            </div>


        </PaginaGeral>
    );
}
