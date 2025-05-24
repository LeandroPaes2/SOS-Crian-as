import { Router } from "express";
import HorarioCtrl from "../Controle/horarioCtrl.js";

const horarioCtrl = new HorarioCtrl();
const rotaHorario = Router();

rotaHorario.post("/",autenticarToken, autorizarNivel("1", "2"), horarioCtrl.gravar);
rotaHorario.put("/:id",autenticarToken, autorizarNivel("1", "2"), horarioCtrl.alterar);
rotaHorario.patch("/:id",autenticarToken, autorizarNivel("1", "2"), horarioCtrl.alterar);
rotaHorario.delete("/:id",autenticarToken, autorizarNivel("1", "2"), horarioCtrl.excluir);
rotaHorario.get("/:id",autenticarToken, autorizarNivel("1", "2"), horarioCtrl.consultar);
rotaHorario.get("/",autenticarToken, autorizarNivel("1", "2"),horarioCtrl.consultar);

export default rotaHorario;