import { Router } from "express";
import AlunoCtrl from "../Controle/alunoCtrl.js";

const alunoCtrl = new AlunoCtrl();
const rotaAluno = Router();

rotaAluno.post("/", alunoCtrl.gravar);
rotaAluno.put("/:id", alunoCtrl.alterar);
rotaAluno.patch("/:id", alunoCtrl.alterar);
rotaAluno.delete("/:id", alunoCtrl.excluir);
rotaAluno.get("/:id", alunoCtrl.consultar); 
rotaAluno.get("/", alunoCtrl.consultar);

export default rotaAluno;
