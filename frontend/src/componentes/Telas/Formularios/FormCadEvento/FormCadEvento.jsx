import { Alert, Form, Button, Row, Col } from "react-bootstrap";
import "../../../css/telaTurma.css";
import { useState, useEffect, useRef } from "react";
import PaginaGeral from "../../../layouts/PaginaGeral";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../css/alerts.css";
import TabelaTurma from "./TabelaTurma";
import TabelaFuncionario from "./TabelaFuncionario";
import Swal from 'sweetalert2';

export default function FormCadEvento(props) {

    const [periodo, setPeriodo] = useState("");
    const [nome, setNome] = useState("");
    const [tipoEvento, setTipoEvento] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [id, setId] = useState(0);
    const [editando, setEditando] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const [dadosTurma, setDadosTurma] = useState([]);
    const [objTurma, setObjsTurma] = useState([]);
    const [dadosFunc, setDadosFunc] = useState([]);
    const [objFunc, setObjsFunc] = useState([]);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (location.state && location.state.id && location.state.nome && location.state.tipoEvento && location.state.dataInicio && location.state.dataFim && location.state.periodo && location.state.horaFim && location.state.horaInicio) {

            setId(location.state.id);
            setNome(location.state.nome);
            setTipoEvento(location.state.tipoEvento);
            setDataInicio(location.state.dataInicio);
            setDataFim(location.state.dataFim);
            setPeriodo(location.state.periodo);
            setHoraFim(location.state.horaFim);
            setHoraInicio(location.state.horaInicio);
            setEditando(true);
            if (location.state.listaTurmas && Array.isArray(location.state.listaTurmas)) {
            
                const turmasFormatadas = location.state.listaTurmas.map(turma => ({
                    disabled: true,     
                    status: 1,          
                    Turma: turma        
                }));
                setObjsTurma(turmasFormatadas);
            }
            if (location.state.listaFuncionario && Array.isArray(location.state.listaFuncionario)) {
            
                const funcFormatadas = location.state.listaFuncionario.map(func => ({
                    disabled: true,     
                    status: 1,          
                    Funcionario: func        
                }));
                setObjsFunc(funcFormatadas);
            }
        }
    }, [location.state]);
    

    useEffect(() => {
        async function carregarDadosTurma() {

            try {
                const res = await fetch("http://localhost:3000/turmas", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const vetorTurmas = await res.json();
                    let lista2 = [];
                    let i;
                    for (i = 0; i < vetorTurmas.length; i++) {
                        lista2.push(vetorTurmas[i]);

                    }
                    setDadosTurma(lista2);
                } else {
                    throw new Error("Erro ao buscar turmas");
                }
            } catch (error) {
                console.error("Erro ao carregar as Turmas:", error);
                // Se tiver um setMensagem ou algo parecido, pode usar aqui:
                // setMensagem("Erro ao carregar os Responsáveis.");
            }
        }

        carregarDadosTurma();
    }, []);

    useEffect(() => {
        async function carregarDadosFuncionario() {

            try {
                const res = await fetch("http://localhost:3000/funcionarios", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const vetorFunc = await res.json();
                    let lista2 = [];
                    let i;
                    for (i = 0; i < vetorFunc.length; i++) {
                        lista2.push(vetorFunc[i]);

                    }
                    setDadosFunc(lista2);
                } else {
                    throw new Error("Erro ao buscar funcionarios");
                }
            } catch (error) {
                console.error("Erro ao carregar as funcionarios:", error);
                // Se tiver um setMensagem ou algo parecido, pode usar aqui:
                // setMensagem("Erro ao carregar os Responsáveis.");
            }
        }

        carregarDadosFuncionario();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validação básica
        if (!dataInicio || !dataFim || !nome || !tipoEvento || !periodo || !horaFim || !horaInicio) {
            setMensagem("Preencha todos os campos!");
            setTimeout(() => setMensagem(""), 3000);
            return;
        }
        if(objTurma.length==0){
            setMensagem("Selecione ao menos um participante!");
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        const turmasValidas = objTurma.filter(t => t.Turma && t.Turma.id && t.Turma.id !== 0);
        const listaTurmasId = turmasValidas.map(t => t.Turma.id);

        const funcValidas = objFunc.filter(f => f.Funcionario && f.Funcionario.cpf && f.Funcionario.cpf !== "");
        const listaFuncCpf = funcValidas.map(f => f.Funcionario.cpf);

        const evento = {id, nome, tipoEvento, dataInicio, dataFim, periodo, horaInicio, horaFim, listaTurmas: listaTurmasId, listaFuncionario: listaFuncCpf};
        const url = editando ? `http://localhost:3000/eventos/${id}` : "http://localhost:3000/eventos";
        const method = editando ? "PUT" : "POST";

        try {
            if (editando) {
                if (!window.confirm("Deseja realmente alterar o evento: " + evento.nome)) {
                    return;
                }
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(evento),
            });

            const resultado = await response.json();

            if (response.ok && resultado.status) {
                setMensagem(editando ? "Evento atualizado com sucesso!" : "Evento cadastrado com sucesso!");

                setTimeout(() => {
                    setNome("");
                    setTipoEvento("");
                    setDataInicio("");
                    setDataFim("");
                    setPeriodo("");
                    setHoraInicio("");
                    setHoraFim("");
                    setMensagem("");
                }, 1000);

                    setTimeout(() => {
                        navigate("/relatorioEvento");
                    }, 3000);

                setEditando(false);
            } else {
                setMensagem(resultado.mensagem || "Erro ao salvar evento.");
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    setMensagem("");
                    timeoutRef.current = null;
                }, 5000);
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    const mudarPeriodo = (novoPeriodo) => {
    if (objTurma.length > 0) {
        Swal.fire({
            title: 'Tem certeza?',
            text: "As turmas selecionadas serão removidas. Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, mudar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setPeriodo(novoPeriodo);
                setObjsTurma([]);
                Swal.fire('Alterado!', 'O período foi atualizado.', 'success');
            }
        });
    } else {
        setPeriodo(novoPeriodo); // Se não tem turma selecionada, muda direto
    }
};


    return (
            <PaginaGeral>
                 <div className="TelaD">
                <Alert className="alert-custom" style={{ marginTop: '70px' }} variant="dark">
                    <h2 className="mb-3 text-center mt-4">Eventos</h2>
                </Alert>

            
                <div className="form-wrapper">
                <Form onSubmit={handleSubmit} className="formEvento">
                    {/* Identificação */}
                    <Form.Group className="mb-3" id="id">
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" value={id} readOnly className="inputEvento" />
                    </Form.Group>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3" id="nome">
                                <Form.Label>Nome/Descrição do Evento</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="inputEvento"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" id="tipoEvento">
                                <Form.Label>Tipo do Evento</Form.Label>
                                <Form.Select
                                    value={tipoEvento}
                                    onChange={(e) => setTipoEvento(e.target.value)}
                                    className="inputEvento"
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="Festa">Festa</option>
                                    <option value="Passeio">Passeio</option>
                                    <option value="Outro">Outro</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    {/* Datas */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" id="dataInicio">
                                <Form.Label>Data Início</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    className="inputEvento"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" id="dataFim">
                                <Form.Label>Data Fim</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    className="inputEvento"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Período e Horários */}
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3" id="periodo">
                                <Form.Label>Período</Form.Label>
                                <Form.Select
                                    value={periodo}
                                    onChange={(e) => mudarPeriodo(e.target.value)}
                                    className="inputEvento"
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Selecione o período</option>
                                    <option value="manha">Manhã</option>
                                    <option value="tarde">Tarde</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3" id="horaInicio">
                                <Form.Label>Hora Início</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={horaInicio}
                                    onChange={(e) => setHoraInicio(e.target.value)}
                                    className="inputEvento"
                                    style={{ width: '50%' }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4} >
                            <Form.Group className="mb-3" id="horaFim">
                                <Form.Label >Hora Fim</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={horaFim}
                                    onChange={(e) => setHoraFim(e.target.value)}
                                    className="inputEvento"
                                    style={{ width: '100%'}}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {periodo && (
                    <Row>
                        <div className="divResp">
                            <TabelaTurma
                                dadosTurma={dadosTurma.filter(turma => turma.periodo.toLowerCase() === periodo.toLowerCase())}
                                objTurma={objTurma}
                                setObjsTurma={setObjsTurma}
                                periodoSelecionado={periodo}
                            />

                        </div>
                    </Row>
                    )}
                    <Row>
                        <div className="divResp">
                            <TabelaFuncionario
                                dadosFunc={dadosFunc}
                                objFunc={objFunc}
                                setObjsFunc={setObjsFunc}
                            />

                        </div>
                    </Row>
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
                        <Button as={Link} to="/telaMenu" className="botaoPesquisa" variant="secondary">
                            Voltar
                        </Button>
                        </Col>
                        <Col md={4}>
                        <Button as={Link} to="/relatorioEvento" className="botaoPesquisa" variant="secondary">
                            Eventos Agendados
                        </Button>
                        </Col>
                        <Col md={4}>
                        <Button className="botaoPesquisa" variant="primary" type="submit">
                            {editando ? "Atualizar" : "Cadastrar"}
                        </Button>
                        </Col>
                    </Row>
                </Form>
                </div>
                </div>
            </PaginaGeral>
    );

}
