import { Router } from "express";
import FamiliaCtrl from "../Controle/familiaCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const familiaCtrl = new FamiliaCtrl();
const rotaFamilia = Router();

rotaFamilia.post("/", autenticarToken, autorizarNivel("6", "3", "4"),familiaCtrl.gravar);
rotaFamilia.put("/:id",autenticarToken, autorizarNivel("6", "3", "4"), familiaCtrl.alterar);
rotaFamilia.patch("/:id", autenticarToken, autorizarNivel("6",
"3", "4"),familiaCtrl.alterar);
rotaFamilia.delete("/:id",autenticarToken, autorizarNivel("6", "3", "4"), familiaCtrl.excluir);
rotaFamilia.get("/:id",autenticarToken, autorizarNivel("6",  "3", "4"), familiaCtrl.consultar); 
rotaFamilia.get("/",autenticarToken, autorizarNivel("6", "3", "4"), familiaCtrl.consultar);

export default rotaFamilia;