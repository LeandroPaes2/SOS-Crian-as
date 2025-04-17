import { Alert, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useLocation } from "react-router-dom";
import '../../css/aluno.css'

import { useNavigate } from 'react-router-dom';

export default function FormCadAluno() {
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const [id, setId] = useState(0);
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState(0);
    const [responsavel, setResponsavel] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [periodoEscola, setPeriodoEscola] = useState("");
    const [periodoProjeto, setPeriodoProjeto] = useState("");
    const navigate = useNavigate();

    const rotaVoltar = editando ? "/relatorioAluno" : "/telaAluno";

    useEffect(() => {
        if (location.state && location.state.id && location.state.nome && location.state.idade && location.state.responsavel && location.state.endereco && location.state.telefone && location.state.periodoEscola && location.state.periodoProjeto) {
            setId(location.state.id);
            setNome(location.state.nome);
            setIdade(location.state.idade);
            setResponsavel(location.state.responsavel);
            setEndereco(location.state.endereco);
            setTelefone(location.state.telefone);
            setPeriodoEscola(location.state.periodoEscola);
            setPeriodoProjeto(location.state.periodoProjeto);
            setEditando(true);
        }
    }, [location.state]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !idade || !responsavel || !endereco || !telefone || !periodoEscola || !periodoProjeto) {
            setMensagem("Preencha todos os campos!");
            return;
        }


        const aluno = { id, nome, idade, responsavel, endereco, telefone, periodoProjeto, periodoEscola };

        const url = editando
            ? `http://localhost:3000/alunos/${id}`
            : "http://localhost:3000/alunos";

        const method = editando ? "PUT" : "POST";

        try {
            if (editando) {
                if (!window.confirm("Deseja realmente alterar o aluno: " + aluno.nome)) {
                    return;
                }
            }
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aluno)
            });

            if (res.ok) {
                setMensagem(editando ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
                setTimeout(() => setId(0), 3000);
                setTimeout(() => setNome(""), 3000);
                setTimeout(() => setIdade(0), 3000);
                setTimeout(() => setResponsavel(""), 3000);
                setTimeout(() => setEndereco(""), 3000);
                setTimeout(() => setTelefone(""), 3000);
                setTimeout(() => setPeriodoEscola(""), 3000);
                setTimeout(() => setPeriodoProjeto(""), 3000);

                setTimeout(() => {
                    navigate("/relatorioAluno");
                }, 3000);


            } else {
                setMensagem(editando ? "Erro ao atualizar aluno!" : "Erro ao cadastrar o aluno.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="div1">
            
                <PaginaGeral>
                    <Alert className="text-center mt-2 mb-4">
                        <h2>{editando ? "Editar Aluno" : "Cadastro de Aluno"}</h2>
                    </Alert>

                    {mensagem && <Alert className="mt-02 mb-02 success text-center" variant="info">{mensagem}</Alert>}

                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3" id="id" >
                            <Form.Label>id</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o id"
                                name="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                disabled

                            />
                        </Form.Group>


                        <Form.Group className="mb-3" id="nome" >
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome"
                                name="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" id="idade" >
                            <Form.Label>Idade</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Digite a idade"
                                name="idade"
                                value={idade}
                                onChange={(e) => setIdade(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" id="responsavel" >
                            <Form.Label>Responsável</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome do responsável"
                                name="responsavel"
                                value={responsavel}
                                onChange={(e) => setResponsavel(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" id="endereco" >
                            <Form.Label>Endereço</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o endereço"
                                name="endereco"
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" id="telefone" >
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o telefone"
                                name="telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Período do Projeto</Form.Label>
                            <Form.Select name="periodoProjeto" value={periodoProjeto} onChange={(e) => setPeriodoProjeto(e.target.value)}>
                                <option value="">Selecione o período</option>
                                <option value="manha">Manhã</option>
                                <option value="tarde">Tarde</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Período Escolar</Form.Label>
                            <Form.Select name="periodoEscola" value={periodoEscola} onChange={(e) => setPeriodoEscola(e.target.value)}>
                                <option value="">Selecione o período escolar</option>
                                <option value="manha">Manhã</option>
                                <option value="tarde">Tarde</option>
                            </Form.Select>
                        </Form.Group>


                        <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
                            Voltar
                        </Button>
                        <Button className="botaoPesquisa" variant="primary" type="submit">
                            {editando ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </Form>
                </PaginaGeral>
            </div>
    );
}
