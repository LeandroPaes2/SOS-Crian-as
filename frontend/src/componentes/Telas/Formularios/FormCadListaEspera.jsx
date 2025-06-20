import { Alert, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/listaEsperaForm.css";

export default function FormCadListaEspera() {
    const navigate = useNavigate();
    const location = useLocation();
    const [editando, setEditando] = useState(location.state?.editando || false);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const [listaEspera, setListaEspera] = useState({
        num: 0,
        id: 0,
        aluno: {
            id: 0,
            nome: "",
            dataNascimento: "",
            responsavel: {
                cpf: "",
                nome: "",
                telefone: ""
            },
            rua: "",
            numero: "",
            escola: {
                id: "",
                nome: "",
                endereco: "",
                telefone: "",
                tipo: ""
            },
            telefone: "",
            periodoEscola: "",
            realizaAcompanhamento: "",
            possuiSindrome: "",
            descricao: "",
            dataInsercao: "",
            rg: "",
            formularioSaude: {},
            ficha: {},
            dataInsercaoProjeto: "",
            status: 0,
            periodoProjeto: ""
        },
        dataInsercao: "",
        cor: "",
        status: 0
    });

    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        if (editando && location.state) {
            setListaEspera({ ...location.state });
        }
    }, [editando, location.state]);

    useEffect(() => {
        if (listaEspera.aluno.nome && listaEspera.aluno.rg) {
            buscarAluno(listaEspera.aluno.nome, listaEspera.aluno.rg);
        }
    }, [listaEspera.aluno.nome, listaEspera.aluno.rg]);

    function manipularMudanca(evento) {
        const { name, value } = evento.target;
        setListaEspera({ ...listaEspera, [name]: value });
    }

    function manipularMudancaAluno(evento) {
        const { name, value } = evento.target;
        setListaEspera(prev => ({
            ...prev,
            aluno: { ...prev.aluno, [name]: value }
        }));
    }

    async function buscarAluno(nome, rg) {
        try {
            const resposta = await fetch("http://localhost:3000/alunos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

            if (!resposta.ok) throw new Error('Erro ao consultar o servidor.');

            const resultado = await resposta.json();

            const alunoEncontrado = resultado.find(
                aluno => aluno.nome === nome && aluno.rg === rg
            );

            if (!alunoEncontrado) {
                throw new Error('Nenhum aluno encontrado com o nome e RG informados.');
            }

            setListaEspera(prev => ({
                ...prev,
                aluno: { ...alunoEncontrado }
            }));

            setMensagem('Aluno encontrado com sucesso!');
            return alunoEncontrado;

        } catch (erro) {
            console.error("Erro ao buscar aluno:", erro);
            setMensagem(erro.message);
            return null;
        }
    }

    async function buscarListaEsperaPorAluno(idAluno) {
        try {
            //const resposta = await fetch("http://localhost:3000/listasEspera");
            const resposta = await fetch("http://localhost:3000/listasEspera", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

            if (!resposta.ok) throw new Error('Erro ao consultar o servidor.');

            const listas = await resposta.json();

            const jaCadastrado = listas.find(
                lista => lista.aluno?.id === idAluno && lista.status !== 0
            );

            if (jaCadastrado) {
                throw new Error('Aluno já está na lista de espera');
            }

            return true;

        } catch (erro) {
            console.error("Erro ao verificar lista de espera:", erro);
            setMensagem(erro.message);
            return false;
        }
    }

    const handleSubmit = async (evento) => {
        evento.preventDefault();

        const alunoEncontrado = await buscarAluno(listaEspera.aluno.nome, listaEspera.aluno.rg);
        if (!alunoEncontrado) return;

        setListaEspera(prev => ({
            ...prev,
            aluno: alunoEncontrado
        }));

        listaEspera.status = 1;

        // Validação corrigida:
        if (!listaEspera.aluno.id || listaEspera.aluno.id === 0) {
            setMensagem("Aluno inválido ou não encontrado.");
            return;
        }

        if (!listaEspera.cor || listaEspera.cor === "") {
            setMensagem("Preencha a cor.");
            return;
        }

        const novaListaEspera = { ...listaEspera };

        if (!editando) {
            delete novaListaEspera.dataInsercao;

            const permitido = await buscarListaEsperaPorAluno(listaEspera.aluno.id);
            if (!permitido) return;
        }

        const url = editando
            ? `http://localhost:3000/listasEspera/${novaListaEspera.num}`
            : "http://localhost:3000/listasEspera";

        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` },
                body: JSON.stringify(novaListaEspera)
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar dados.");
            }

            setMensagem(editando ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
            setTimeout(() => navigate("/relatorioListaEspera"), 2000);

        } catch (erro) {
            console.error('Erro ao salvar:', erro);
            setMensagem(erro.message);
        }
    };

    return (

        <div className="cadastroListaEspera">
            <PaginaGeral>
                <Alert className="alert-custom" style={{ marginTop: '200px' }} variant="dark">
                    <h2 className="titulo-alert">Lista de Espera</h2>
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Form.Group>
                            <Form.Label>Numero do Protocolo</Form.Label>
                            <Form.Control
                                type="number"
                                value={listaEspera.aluno.id}
                                readOnly
                                className="inputListadeEspera"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Nome da Criança</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={listaEspera.aluno.nome}
                                onChange={manipularMudancaAluno}
                                className="inputListadeEspera"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>RG da Criança</Form.Label>
                            <Form.Control
                                type="text"
                                name="rg"
                                value={listaEspera.aluno.rg}
                                onChange={manipularMudancaAluno}
                                className="inputListadeEspera"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Cor Atribuida a Criança</Form.Label>
                            <Form.Select
                                value={listaEspera.cor}
                                name="cor"
                                onChange={manipularMudanca}
                                className="inputListadeEspera"
                            >
                                <option value="">Selecione uma cor</option>
                                <option value="AMARELO">AMARELO</option>
                                <option value="AZUL">AZUL</option>
                                <option value="VERMELHO">VERMELHO</option>
                                <option value="ROXO">ROXO</option>
                                <option value="VERDE">VERDE</option>
                                <option value="LARANJA">LARANJA</option>
                                <option value="CINZA">CINZA</option>
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
                    </div>
                </Form>
            </PaginaGeral>
        </div>
    );
}
