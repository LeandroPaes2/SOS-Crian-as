import { Router } from "express"; 
import EscolaCtrl from "../Controle/escolaCtrl.js";

const escolaCtrl = new EscolaCtrl();
const rotaEscola = Router();

rotaEscola.post("/", autenticarToken, autorizarNivel("3", "4"),escolaCtrl.gravar);
rotaEscola.put("/:id",autenticarToken, autorizarNivel("3", "4"), escolaCtrl.editar);
rotaEscola.patch("/:id",autenticarToken, autorizarNivel("3", "4"), escolaCtrl.editar);
rotaEscola.delete("/:id",autenticarToken, autorizarNivel("3", "4"), escolaCtrl.excluir);
rotaEscola.get("/:id",autenticarToken, autorizarNivel("3", "4"), escolaCtrl.consultar);
rotaEscola.get("/",autenticarToken, autorizarNivel("3", "4"),escolaCtrl.consultar);

export default rotaEscola;


