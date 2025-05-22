import { Router } from "express";
import FamiliaCtrl from "../Controle/familiaCtrl.js";

const familiaCtrl = new FamiliaCtrl();
const rotaFamilia = Router();

rotaFamilia.post("/", familiaCtrl.gravar);
rotaFamilia.put("/:id", familiaCtrl.alterar);
rotaFamilia.patch("/:id", familiaCtrl.alterar);
rotaFamilia.delete("/:id", familiaCtrl.excluir);
rotaFamilia.get("/:id", familiaCtrl.consultar); 
rotaFamilia.get("/", familiaCtrl.consultar);

export default rotaFamilia;