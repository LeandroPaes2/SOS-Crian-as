import { Router } from "express";
import MateriaCtrl from "../Controle/materiaCtrl.js";

const matCtrl = new MateriaCtrl();
const rotaMateria = Router();

rotaMateria.post("/", matCtrl.gravar);
rotaMateria.put("/:nome", matCtrl.editar);
rotaMateria.patch("/:nome", matCtrl.editar);
rotaMateria.delete("/:nome", matCtrl.excluir);
rotaMateria.get("/:nome", matCtrl.consultar);
rotaMateria.get("/",matCtrl.consultar);

export default rotaMateria;