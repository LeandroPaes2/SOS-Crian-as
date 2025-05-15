import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaListaEspera.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function FormCadListaEspera() {
    const navigate = useNavigate();
    const location = useLocation();
    const [editando, setEditando] = useState(location.state?.editando || false);

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
        prioridade: 0,
        status: 0
    });

    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        if (editando && location.state) {
            setListaEspera({ ...location.state });
        }
    }, [editando, location.state]);

    useEffect(() => {
        if (listaEspera.id > 0) {
            buscarAluno(listaEspera.id);
        }
    }, [listaEspera.id]);


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

    async function buscarAluno(id) {
        try {
            const resposta = await fetch(`http://localhost:3000/alunos/${encodeURIComponent(id)}`);

            if (!resposta.ok) throw new Error('Erro ao consultar o servidor.');

            const resultado = await resposta.json();
            const aluno = resultado[0]; // acessa o primeiro item do array

            if (!aluno) throw new Error('Nenhum aluno encontrado com o ID informado.');

            setListaEspera(prev => ({
                ...prev,
                aluno: { ...aluno }
            }));

            setMensagem('Aluno encontrado com sucesso!');
            return aluno;

        } catch (erro) {
            console.error("Erro ao buscar aluno:", erro);
            setMensagem(erro.message);
            return null;
        }
    }

    async function buscarListaEspera(id) {
        try {
            const resposta = await fetch(`http://localhost:3000/listasEspera/${encodeURIComponent(id)}`);

            if (!resposta.ok) throw new Error('Erro ao consultar o servidor.');

            const resultado = await resposta.json();
            for (const lista of resultado) {
                if (lista.prioridade === 1)
                    throw new Error('Criança já cadastrada na lista de espera');
            }

        } catch (erro) {
            console.error("Erro ao buscar criança na lista de espera:", erro);
            setMensagem(erro.message);
            return null;
        }
    }


    const handleSubmit = async (evento) => {
        evento.preventDefault();

        const alunoEncontrado = await buscarAluno(listaEspera.id);
        if (!alunoEncontrado) return;

        setListaEspera(prev => ({
            ...prev,
            aluno: alunoEncontrado
        }));

        listaEspera.status = 1;

        const camposObrigatorios = ["id", "prioridade"];
        for (const campo of camposObrigatorios) {
            const valor = listaEspera[campo];
            if (
                valor === undefined ||
                valor === null ||
                (typeof valor === "string" && valor.trim() === "") ||
                (typeof valor !== "string" && !valor)
            ) {
                setMensagem("Preencha todos os campos obrigatórios.");
                return;
            }
        }


        const resultado = await buscarListaEspera(listaEspera.id);
        if (resultado === null) return;


        const novaListaEspera = {
            ...listaEspera
        };

        if (!editando) {
            delete novaListaEspera.dataInsercao; // Remove do objeto para evitar envio
        }

        const url = editando ? `http://localhost:3000/listasEspera/${novaListaEspera.num}` : "http://localhost:3000/listasEspera";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaListaEspera)
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar dados.");
            }

            setMensagem(editando ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
            setTimeout(() => navigate("/telaListaEspera"), 2000);

        } catch (erro) {
            console.error('Erro ao salvar:', erro);
            setMensagem(erro.message);
        }
    };

    return (
        <div>
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>{editando ? "Editar" : "Cadastrar"} Criança na Lista de Espera</h2>
                </Alert>




                {mensagem && <Alert variant="info">{mensagem}</Alert>}

                <Form onSubmit={handleSubmit} className="form topot">
                    <div className="cadastroListaEspera">
                        <div className="divInput">
                            <Form.Group className="formInput">
                                <Form.Label>Numero do Protocolo</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="id"
                                    value={listaEspera.id}
                                    onChange={manipularMudanca}
                                    disabled={editando}
                                />
                            </Form.Group>

                            <Form.Group className="formInput">
                                <Form.Label>Nome da Criança</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nome"
                                    value={listaEspera.aluno.nome}
                                    onChange={manipularMudancaAluno}
                                    disabled={true}
                                />
                            </Form.Group>

                            <Form.Group className="formInput">
                                <Form.Label>Prioridade</Form.Label>
                                <Form.Select
                                    value={listaEspera.prioridade}
                                    name="prioridade"
                                    onChange={manipularMudanca}
                                >
                                    <option value="">Selecione uma prioridade</option>
                                    <option value="1">Azul</option>
                                    <option value="2">Vermelho</option>
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="divInput" style={{ flexDirection: "row", justifyContent: "center" }}>
                            <Button type="submit" className="botaoPesquisa">
                                {editando ? "Atualizar" : "Cadastrar"}
                            </Button>
                            <Link to="/telaListaEspera">
                                <Button variant="secondary" className="botaoPesquisa">Cancelar</Button>
                            </Link>
                        </div>
                    </div>
                </Form>


            </PaginaGeral>
        </div>
    );
}



