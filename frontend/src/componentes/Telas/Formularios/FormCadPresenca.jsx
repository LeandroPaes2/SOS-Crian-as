import { Alert, Form, Button, FormSelect } from "react-bootstrap";
import "../../css/telaTurma.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/alerts.css";
import { usePresencas } from "../../../PresencaContext";

export default function FormCadPresenca(props)
{
    const [data, setData] = useState("");
    const [dia, setDia] = useState("");
    const [mes, setMes] = useState("");
    const [ano, setAno] = useState("");
    const [hora, setHora] = useState("");
    const [minutos, setMinutos] = useState("");
    const [presente, setPresente] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [id, setId] = useState(0);
    const [editando, setEditando] = useState(false);
    const [listaDeTurmas, setListaDeTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState("");
    const [listaDeMaterias, setListaDeMaterias] = useState([]);
    const [materiaSelecionada, setMateriaSelecionada] = useState("");
    const [listaDeAlunos, setListaDeAlunos] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const { listaDePresencas, setListaDePresencas } = usePresencas();
    

    const rotaVoltar = editando ? "/relatorioPresenca" : "/telaPresenca";
    
    useEffect(() => {
        const data = new Date();
        if (location.state) {
            setData(data);
            setDia(data.getDate());
            setMes(data.getMonth());
            setAno(data.getFullYear);
            setHora(data.getHours());
            setMinutos(data.getMinutes());
            setPresente(location.state.presente);
            setId(location.state.id);
            setEditando(true);
        }
    }, [location.state]);

    useEffect(() => {
        fetch("http://localhost:3000/turmas")
          .then((response) => response.json())
          .then((dados) => setListaDeTurmas(dados))
          .catch((error) => console.error("Erro ao carregar as turmas:", error));
      }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!materiaSelecionada) {
            setMensagem("Por favor, selecione uma matéria");
            return;
        }

        setMensagem(
            `Presença registrada para a matéria ${materiaSelecionada} do dia ${dia} do mes ${mes} do ano ${ano} às ${hora}:${minutos}.`
          );

        const novoId = listaDePresencas.length > 0
        ? Math.max(...listaDePresencas.map((presenca) => presenca.id)) + 1
        : 1;
    
        const novaPresenca = {
            id: editando ? id : novoId,
            data,
            dia,
            mes,
            ano,
            hora,
            minutos,
            presente
        };
    
        let novaLista;
        if (editando) {
            novaLista = listaDePresencas.map((presenca) => (presenca.id === novaPresenca.id ? novaPresenca : presenca));
        } else {
            novaLista = [...listaDePresencas, novaPresenca];
        }
    
        setListaDePresencas(novaLista);
        setMensagem(editando ? "Lista de presença atualizada com sucesso!" : "Lista de presença cadastrada com sucesso!");
    
        setTimeout(() => {
            setEditando(false);
            setTurmaSelecionada("");
            navigate("/relatorioPresenca", {
                state: { presencas: novaLista }, 
            });
        }, 3000);
    };
    
    return (
        <PaginaGeral>
          <Alert className="alert-custom text-center mt-4 mb-4">
            <h2 className="titulo-alert">Cadastro de Presença</h2>
          </Alert>
    
          {mensagem && (
            <Alert
              className="mt-2 mb-2 text-center"
              variant={mensagem.includes("registrada") ? "success" : "danger"}
            >
              {mensagem}
            </Alert>
          )}
    
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Turma</Form.Label>
              {listaDeTurmas.length === 0 ?
              (<FormSelect>
                <option value="">Não há turmas cadastradas</option>
              </FormSelect>):
              (
                <Form.Select
                    value={turmaSelecionada}
                    onChange={(e) => setTurmaSelecionada(e.target.value)}
                >
                    <option value="">Selecione uma turma</option>
                    {listaDeTurmas.map((turma, index) => (
                    <option key={index} value={turma.cor}>
                        {turma.cor}
                    </option>
                    ))}
                </Form.Select>
              )
              }
            </Form.Group>
    
            <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
              Voltar
            </Button>
            <Button className="botaoPesquisa" variant="primary" type="submit">
                {editando ? "Atualizar" : "Cadastrar"}
            </Button>
          </Form>
        </PaginaGeral>
    );
}