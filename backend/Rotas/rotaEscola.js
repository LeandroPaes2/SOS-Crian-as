import { Router } from "express"; 
import EscolaCtrl from "../Controle/escolaCtrl.js";

const escolaCtrl = new EscolaCtrl();
const rotaEscola = Router();

rotaEscola.post("/", escolaCtrl.gravar);
rotaEscola.put("/:id", escolaCtrl.editar);
rotaEscola.patch("/:id", escolaCtrl.editar);
rotaEscola.delete("/:id", escolaCtrl.excluir);
rotaEscola.get("/:id", escolaCtrl.consultar);
rotaEscola.get("/",escolaCtrl.consultar);

export default rotaEscola;


