import { Router } from "express";
import AlunoResponsavelCtrl from "../Controle/alunoResponsavelCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const alunoResponsavelCtrl = new AlunoResponsavelCtrl();
const rotaAlunoResponsavel = Router();

rotaAlunoResponsavel.post("/", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.gravar);
//rotaAlunoResponsavel.put("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.alterar);
//rotaAlunoResponsavel.patch("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.alterar);
//rotaAlunoResponsavel.delete("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.desligar);
rotaAlunoResponsavel.get("/:id", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.consultar);
rotaAlunoResponsavel.get("/cpf/:cpf", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.consultarCPF);
rotaAlunoResponsavel.get("/", autenticarToken, autorizarNivel("1", "3", "4"), alunoResponsavelCtrl.consultar);

export default rotaAlunoResponsavel;