import { Alert, Form, Button } from "react-bootstrap";
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

    const location = useLocation();
    const navigate = useNavigate();

    const { listaDePresencas, setListaDePresencas } = usePresencas();
    const { listaDeTurmas, setListaDeTurmas } = useTurmas();
    const { listaDeMaterias, setListaDeMaterias} = useMaterias();
    const { listaDeAlunos, setListaDeAlunos} = useAlunos();

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

    const handleSubmit = async (event) => {
        event.preventDefault();

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
    
            navigate("/relatorioPresenca", {
                state: { presencas: novaLista }, 
            });
        }, 3000);
    };
}