import { Router } from "express"; 
import EscolaCtrl from "../Controle/escolaCtrl.js";

const escolaCtrl = new EscolaCtrl();
const rotaEscola = Router();

rotaEscola.post("/", escolaCtrl.gravar);
rotaEscola.put("/:nome", escolaCtrl.editar);
rotaEscola.patch("/:nome", escolaCtrl.editar);
rotaEscola.delete("/:nome", escolaCtrl.excluir);
rotaEscola.get("/:nome", escolaCtrl.consultar);
rotaEscola.get("/",escolaCtrl.consultar);

export default rotaEscola;


