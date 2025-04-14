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
        if (location.state && location.state.data) {
            setData(location.state.data);
            setId(location.state.id);
            setEditando(true);
        }
    }, [location.state]);
}