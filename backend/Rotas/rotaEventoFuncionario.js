import { Router } from "express";
import EventoFuncionarioCtrl from "../Controle/eventoFuncionarioCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";

const eventoFuncionarioCtrl = new EventoFuncionarioCtrl();
const rotaEventoFuncionario = Router();

rotaEventoFuncionario.post("/", autenticarToken, eventoFuncionarioCtrl.gravar);
//rotaAlunoResponsavel.put("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.alterar);
//rotaAlunoResponsavel.patch("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.alterar);
//rotaAlunoResponsavel.delete("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.desligar);
rotaEventoFuncionario.get("/:id", autenticarToken, eventoFuncionarioCtrl.consultar);
rotaEventoFuncionario.get("/id/:id", autenticarToken, eventoFuncionarioCtrl.consultarTurma);
rotaEventoFuncionario.get("/", autenticarToken, eventoFuncionarioCtrl.consultar);

export default rotaEventoFuncionario;