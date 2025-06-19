import { Router } from "express";
import EventoTurmasCtrl from "../Controle/eventoTurmasCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const eventoTurmasCtrl = new EventoTurmasCtrl();
const rotaEventoTurmas = Router();

rotaEventoTurmas.post("/", autenticarToken, eventoTurmasCtrl.gravar);
//rotaAlunoResponsavel.put("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.alterar);
//rotaAlunoResponsavel.patch("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.alterar);
//rotaAlunoResponsavel.delete("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.desligar);
rotaEventoTurmas.get("/:id", autenticarToken, eventoTurmasCtrl.consultar);
rotaEventoTurmas.get("/id/:id", autenticarToken, eventoTurmasCtrl.consultarTurma);
rotaEventoTurmas.get("/", autenticarToken, eventoTurmasCtrl.consultar);

export default rotaEventoTurmas;