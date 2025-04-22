import { Router } from "express";
import MateriaCtrl from "../Controle/materiaCtrl.js";

const matCtrl = new MateriaCtrl();
const rotaMateria = Router();

rotaMateria.post("/", matCtrl.gravar);
rotaMateria.put("/:id", matCtrl.editar);
rotaMateria.patch("/:id", matCtrl.editar);
rotaMateria.delete("/:id", matCtrl.excluir);
rotaMateria.get("/:id", matCtrl.consultar);
rotaMateria.get("/",matCtrl.consultar);

export default rotaMateria;
