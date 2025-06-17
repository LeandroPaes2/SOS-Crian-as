import { Router } from "express";
import HorarioCtrl from "../Controle/horarioCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const horarioCtrl = new HorarioCtrl();
const rotaHorario = Router();

rotaHorario.post("/",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), horarioCtrl.gravar);
rotaHorario.put("/:id",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), horarioCtrl.alterar);
rotaHorario.patch("/:id",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), horarioCtrl.alterar);
rotaHorario.delete("/:id",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), horarioCtrl.excluir);
rotaHorario.get("/:id",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), horarioCtrl.consultar);
rotaHorario.get("/",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"),horarioCtrl.consultar);

export default rotaHorario;