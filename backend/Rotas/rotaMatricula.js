import { Router } from "express";
import MatriculaCtrl from "../Controle/matriculaCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const matriculaCtrl = new MatriculaCtrl();
const rotaMatricula = Router();

rotaMatricula.post("/",  autenticarToken, autorizarNivel("1", "2", "4"), matriculaCtrl.gravar);
rotaMatricula.put("/:id", autenticarToken, autorizarNivel("1", "2", "4"), matriculaCtrl.alterar);
 rotaMatricula.patch("/:id",autenticarToken, autorizarNivel("1", "2", "4"), matriculaCtrl.alterar);
// rotaMatricula.delete("/:id",autenticarToken, autorizarNivel("1", "2", "4"), matriculaCtrl.desligar);
rotaMatricula.get("/aluno/:id",autenticarToken, autorizarNivel("1", "2", "4"), matriculaCtrl.consultarMatALuno); 
rotaMatricula.get("/:id",autenticarToken, autorizarNivel("1", "2", "4"), matriculaCtrl.consultar); 
rotaMatricula.get("/",autenticarToken, autorizarNivel("1", "2", "4"), matriculaCtrl.consultar);

export default rotaMatricula;
