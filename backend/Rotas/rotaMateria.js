import { Router } from "express";
import MateriaCtrl from "../Controle/materiaCtrl.js";

const matCtrl = new MateriaCtrl();
const rotaMateria = Router();

rotaMateria.post("/", matCtrl.gravar);
rotaMateria.put("/:cor", matCtrl.editar);
rotaMateria.patch("/:cor", matCtrl.editar);
rotaMateria.delete("/:cor", matCtrl.excluir);
rotaMateria.get("/:cor", matCtrl.consultar);
rotaMateria.get("/",matCtrl.consultar);

export default rotaMateria;


