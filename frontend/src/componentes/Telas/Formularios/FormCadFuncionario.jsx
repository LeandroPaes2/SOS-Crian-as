import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaFuncionario.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FormCadFuncionario() {
    const [funcionario, setFuncionario] = useState({
        nome: "",
        cpf: "",
        cargo: "",
        nivel: "",
        email: "",
        senha: ""
    });
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(location.state?.editando || false);

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
        setFuncionario({ ...funcionario, [elemento]: valor });
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
        if (!funcionario.nome || !funcionario.cpf || !funcionario.cargo || !funcionario.nivel || !funcionario.email || !funcionario.senha) {
            setMensagem("Preencha todos os campos!");
            return;
        }
    
        // Verifique se o CPF é válido
        if (!validarCPF(funcionario.cpf)) {
            setMensagem("CPF inválido");
            return;
        }
    
        const url = editando ? `http://localhost:3000/funcionarios/${funcionario.cpf}` : "http://localhost:3000/funcionarios";
        const method = editando ? "PUT" : "POST";
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(funcionario)
            });
            
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Detalhes do erro:", errorDetails);
                setMensagem(`Erro: ${errorDetails.mensagem || 'Verifique os dados fornecidos.'}`);
            } else {
                const data = await response.json();
                console.log("Funcionário atualizado:", data);
                setMensagem(editando ? "Funcionário atualizado com sucesso!" : "Funcionário cadastrado com sucesso!");
            }
            
            
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };
    

    return (
        <div>
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>Funcionários</h2>
                </Alert>

                {mensagem && <Alert variant="info">{mensagem}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            id = "nome"
                            placeholder="Digite o nome"
                            value={funcionario.nome}
                            name="nome"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>CPF</Form.Label>
                        <Form.Control
                            type="text"
                            id = "cpf"
                            placeholder="Digite o CPF"
                            value={funcionario.cpf}
                            name="cpf"
                            onChange={manipularMudanca}
                            disabled={editando}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cargo</Form.Label>
                        <Form.Select
                            value={funcionario.cargo}
                            id = "cargo"
                            name="cargo"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione um cargo</option>
                            <option value="coordenador">Coordenador</option>
                            <option value="professor">Professor</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nível</Form.Label>
                        <Form.Select
                            value={funcionario.nivel}
                            nivel = "cargo"
                            name="nivel"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione um nível</option>
                            <option value="alto">Alto</option>
                            <option value="medio">Médio</option>
                            <option value="baixo">Baixo</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            id = "email"
                            placeholder="xxxx@gmail.com"
                            value={funcionario.email}
                            name="email"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control
                            type="password"
                            id = "senha"
                            placeholder="Digite a senha"
                            value={funcionario.senha}
                            name="senha"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Button as={Link} to="/telaFuncionario" className="botaoPesquisa" variant="secondary">
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
