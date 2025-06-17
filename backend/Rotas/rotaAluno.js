import { Router } from "express";
import AlunoCtrl from "../Controle/alunoCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const alunoCtrl = new AlunoCtrl();
const rotaAluno = Router();

rotaAluno.post("/",  autenticarToken, autorizarNivel("1", "2", "4"), alunoCtrl.gravar);
rotaAluno.put("/:id", autenticarToken, autorizarNivel("1", "2", "4"), alunoCtrl.alterar);
rotaAluno.patch("/:id",autenticarToken, autorizarNivel("1", "2", "4"), alunoCtrl.alterar);
rotaAluno.delete("/:id",autenticarToken, autorizarNivel("1", "2", "4"), alunoCtrl.desligar);
rotaAluno.get("/:id",autenticarToken, autorizarNivel("1", "2", "4"), alunoCtrl.consultar); 
rotaAluno.get("/",autenticarToken, autorizarNivel("1", "2", "4"), alunoCtrl.consultar);

export default rotaAluno;
