import { Router } from "express";
import MateriaCtrl from "../Controle/materiaCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const matCtrl = new MateriaCtrl();
const rotaMateria = Router();

rotaMateria.post("/",autenticarToken, autorizarNivel("1","4", "2", "3","5", "6"), matCtrl.gravar);
rotaMateria.put("/:id",autenticarToken, autorizarNivel("1", "4", "2", "3", "5", "6"), matCtrl.editar);
rotaMateria.patch("/:id",autenticarToken, autorizarNivel("1", "4", "2", "3","5", "6"), matCtrl.editar);
rotaMateria.delete("/:id",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), matCtrl.excluir);
rotaMateria.get("/:id",autenticarToken, autorizarNivel("1", "2","3", "4","5", "6"), matCtrl.consultar);
rotaMateria.get("/",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"),matCtrl.consultar);

export default rotaMateria;
