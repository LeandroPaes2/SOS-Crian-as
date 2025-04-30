import { Alert, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useLocation } from "react-router-dom";
import "../../css/alunoForm.css"
import { useNavigate } from 'react-router-dom';

export default function FormCadAluno(props) {
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    // Novo estado para armazenar todos os campos
    const [dados, setDados] = useState({
        id: 0,
        nome: "",
        idade: 0,
        responsavel: "",
        endereco: "",
        telefone: "",
        periodoEscola: "",
        periodoProjeto: "",
        rua: "",
        bairro: "",
        numero: "",
        escola: "",
        realizaAcompanhamento: false,
        possuiSindrome: false,
        descricao: "",
        dataInsercaoListaEspera: "",
        rg: "",
        formularioSaude: "",
        ficha: "",
        dataInsercaoProjeto: "",
        status: "",
        cep: ""
    });

    const navigate = useNavigate();
    const rotaVoltar = editando ? "/relatorioAluno" : "/telaAluno";

    useEffect(() => {
        console.log(location.state);
        if (location.state && location.state.id) {
            setDados((prev) => ({
                ...prev,
                ...location.state
            }));
            setEditando(true);
        }
    }, [location.state]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Desestruturando os dados
        const {
            nome, idade, responsavel, endereco, telefone, periodoEscola,
            periodoProjeto, rua, bairro, numero, escola, realizaAcompanhamento,
            possuiSindrome, descricao, dataInsercaoListaEspera, rg, formularioSaude,
            ficha, dataInsercaoProjeto, status, cep
        } = dados;

        if (!nome || !idade || !responsavel || !endereco || !telefone || !periodoEscola || !periodoProjeto) {
            setMensagem("Preencha todos os campos obrigatórios!");
            return;
        }

        const aluno = { ...dados };

        const url = editando
            ? `http://localhost:3000/alunos/${dados.id}`
            : "http://localhost:3000/alunos";
        const method = editando ? "PUT" : "POST";


        try {
            if (editando && !window.confirm("Deseja realmente alterar o aluno: " + aluno.nome)) {
                return;
            }

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aluno)
            });

            if (res.ok) {
                setMensagem(editando ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
                setTimeout(() => {
                    setDados({
                        id: 0,
                        nome: "",
                        idade: 0,
                        responsavel: "",
                        endereco: "",
                        telefone: "",
                        periodoEscola: "",
                        periodoProjeto: "",
                        rua: "",
                        bairro: "",
                        numero: "",
                        escola: "",
                        realizaAcompanhamento: false,
                        possuiSindrome: false,
                        descricao: "",
                        dataInsercaoListaEspera: "",
                        rg: "",
                        formularioSaude: "",
                        ficha: "",
                        dataInsercaoProjeto: "",
                        status: "",
                        cep: ""
                    });
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDados(prevDados => ({
            ...prevDados,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="cadastroAluno">
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>{editando ? "Editar Aluno" : "Cadastro de Aluno"}</h2>
                </Alert>

                {mensagem && <Alert variant="info">{mensagem}</Alert>}

                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" id="nome">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            name="nome"
                            value={dados.nome}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="idade">
                        <Form.Label>Idade</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Digite a idade"
                            name="idade"
                            value={dados.idade}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="responsavel">
                        <Form.Label>Responsável</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome do responsável"
                            name="responsavel"
                            value={dados.responsavel}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="endereco">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o endereço"
                            name="endereco"
                            value={dados.endereco}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="telefone">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o telefone"
                            name="telefone"
                            value={dados.telefone}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Período do Projeto</Form.Label>
                        <Form.Select name="periodoProjeto" value={dados.periodoProjeto} onChange={handleChange}>
                            <option value="">Selecione o período</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Período Escolar</Form.Label>
                        <Form.Select name="periodoEscola" value={dados.periodoEscola} onChange={handleChange}>
                            <option value="">Selecione o período escolar</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" id="rua">
                        <Form.Label>Rua</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a rua"
                            name="rua"
                            value={dados.rua}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="bairro">
                        <Form.Label>Bairro</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o bairro"
                            name="bairro"
                            value={dados.bairro}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="numero">
                        <Form.Label>Número</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Digite o número"
                            name="numero"
                            value={dados.numero}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="escola">
                        <Form.Label>Escola</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a escola"
                            name="escola"
                            value={dados.escola}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="descricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a descrição"
                            name="descricao"
                            value={dados.descricao}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="dataInsercaoListaEspera">
                        <Form.Label>Data de Inserção na Lista de Espera</Form.Label>
                        <Form.Control
                            type="date"
                            name="dataInsercaoListaEspera"
                            value={dados.dataInsercaoListaEspera}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="rg">
                        <Form.Label>RG</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o RG"
                            name="rg"
                            value={dados.rg}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="formularioSaude">
                        <Form.Label>Formulário de Saúde</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o formulário de saúde"
                            name="formularioSaude"
                            value={dados.formularioSaude}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="ficha">
                        <Form.Label>Ficha</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a ficha"
                            name="ficha"
                            value={dados.ficha}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="dataInsercaoProjeto">
                        <Form.Label>Data de Inserção no Projeto</Form.Label>
                        <Form.Control
                            type="date"
                            name="dataInsercaoProjeto"
                            value={dados.dataInsercaoProjeto}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o status"
                            name="status"
                            value={dados.status}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="cep">
                        <Form.Label>CEP</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o CEP"
                            name="cep"
                            value={dados.cep}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
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
