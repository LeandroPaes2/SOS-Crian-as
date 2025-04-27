import { Router } from "express";
import HorarioCtrl from "../Controle/horarioCtrl.js";

const horarioCtrl = new HorarioCtrl();
const rotaHorario = Router();

rotaHorario.post("/", horarioCtrl.gravar);
rotaHorario.put("/:id", horarioCtrl.alterar);
rotaHorario.patch("/:id", horarioCtrl.alterar);
rotaHorario.delete("/:id", horarioCtrl.excluir);
rotaHorario.get("/:id", horarioCtrl.consultar);
rotaHorario.get("/",horarioCtrl.consultar);
//rotaHorario.get("/materia/:materiaId/turmas", horarioCtrl.consultarTurmasPorMateria);

export default rotaHorario;