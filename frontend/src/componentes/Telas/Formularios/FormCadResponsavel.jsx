import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaTurma.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../css/alerts.css";
import { useNavigate } from 'react-router-dom';


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
    const [responsavel, setResponsavel] = useState(cpf, nome, telefone);
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const rotaVoltar = editando ? "/relatorioResponsavel" : "/telaResponsavel";


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
        event.preventDefault(); // Evita recarregar a página

        // Verifica se os campos estão preenchidos
        if (!cpf || !rg || !nome || !telefone || !email || !sexo || !dtNascimento || !estCivil || !conjuge || !situTrabalho || !escolaridade || !rendaFamiliar || !qtdeTrabalhadores || !pensaoAlimenticia || !beneficioSocial) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        if(!validarCPF(cpf) || cpf[3]!="." || cpf[7]!="." || cpf[11]!="-" || cpf.length!=14){
            setMensagem("CPF invalido");
            setTimeout(() => setMensagem(""), 5000);
            return;
        }

        const responsavel = { cpf,rg, nome, telefone, email, sexo, dtNascimento, estCivil, conjuge, profissao, situTrabalho, escolaridade, rendaFamiliar, valorRenda, qtdeTrabalhadores, pensaoAlimenticia, valorPensao, pagadorPensao, beneficioSocial, tipoBeneficio, valorBeneficio, beneficiario}; 
        const url = editando ? `http://localhost:3000/responsaveis/${cpf}` : "http://localhost:3000/responsaveis";
        const method = editando ? "PUT" : "POST";

        try {
            if(editando){
                if(!window.confirm("Deseja realmente alterar o responsavel: " + responsavel.cpf)){
                    return;
                }
            }
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json",
                    "Authorization":` Bearer ${token}`
                 },
                body: JSON.stringify(responsavel),
            });

            if (response.ok) {
                setMensagem(editando ? "Responsavel atualizado com sucesso!" : "Responsavel cadastrado com sucesso!");
                setTimeout(() =>setCpf(""), 3000);
                setTimeout(() =>setRg(""), 3000);
                setTimeout(() => setNome(""), 3000);
                setTimeout(()=> setTelefone(""), 3000); 
                setTimeout(() =>setEmail(""), 3000);
                setTimeout(() =>setSexo(""), 3000);
                setTimeout(() =>setDtNascimento(""), 3000);
                setTimeout(() =>setEstCivil(""), 3000);
                setTimeout(() =>setConjuge(""), 3000);
                setTimeout(() =>setProfissao(""), 3000);
                setTimeout(() =>setSituTrabalho(""), 3000);
                setTimeout(() =>setEscolaridade(""), 3000);
                setTimeout(() =>setRendaFamiliar(""), 3000);
                setTimeout(() =>setValorRenda(""), 3000);
                setTimeout(() =>setQtdeTrabalhadores(""), 3000);
                setTimeout(() =>setPensaoAlimenticia(""), 3000);
                setTimeout(() =>setValorPensao(""), 3000);
                setTimeout(() =>setPagadorPensao(""), 3000);
                setTimeout(() =>setBeneficioSocial(""), 3000);
                setTimeout(() =>setTipoBeneficio(""), 3000);
                setTimeout(() =>setValorBeneficio(""), 3000);
                setTimeout(() =>setBeneficiario(""), 3000);
                setTimeout(() => setMensagem(""), 3000);
                
                if(editando){
                    setTimeout(() => {
                        navigate("/relatorioResponsavel"); 
                    }, 3000); 
                }
                setEditando(false);
            } else {
                setMensagem(editando ? "Erro ao atualizar responsavel!": "Erro ao cadastrar o responsavel.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div>
            <PaginaGeral>
            <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert"> Cadastro de Responsáveis</h2>
            </Alert>

            {mensagem && <Alert className="mt-02 mb-02 success text-center" variant={
                mensagem.includes("sucesso")
                ? "success"
                : mensagem.includes("Erro") || mensagem.includes("erro") || mensagem.includes("Preencha") || mensagem.includes("invalido")
                ? "danger"
                : "warning"
                    }>
                {mensagem}
                </Alert>} 

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" id="cpf">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o CPF"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3" id="nome">
                    <Form.Label>Nome Completo</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Digite o nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" id="telefone">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />
                </Form.Group>

                <Button as={Link} to="/telaResponsavel" className="botaoPesquisa" variant="secondary">
                                Pagina inicial responsavel
                        </Button>
                    <Button as={Link} to="/relatorioResponsavel" className="botaoPesquisa" variant="secondary">
                            Relatorio 
                    </Button>
                <Button className="botaoPesquisa" variant="primary" type="submit">
                    {editando ? "Atualizar" : "Cadastrar"}
                </Button>
            </Form>
            </PaginaGeral>
        </div>
    );
}
