import { Router } from "express";
import PresencaCtrl from "../Controle/presencaCtrl.js";

const rotaPresenca = Router();
const presencaCtrl = new PresencaCtrl();

rotaPresenca.post('/', presencaCtrl.gravar);
rotaPresenca.get('/', presencaCtrl.consultar);
rotaPresenca.get('/:id', presencaCtrl.consultarPorId);
rotaPresenca.get("/materia/:materiaId/turmas", presencaCtrl.consultarTurmasPorMateria);
rotaPresenca.put('/:id', presencaCtrl.alterar);
rotaPresenca.delete('/:id', presencaCtrl.excluir);

export default rotaPresenca;