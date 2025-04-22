import { Router } from "express";
import PresencaCtrl from "../Controle/presencaCtrl.js";

const rotaPresenca = Router();
const presencaCtrl = new PresencaCtrl();

rotaPresenca.post('/', presencaCtrl.gravar);
rotaPresenca.get('/', presencaCtrl.consultar);
rotaPresenca.delete('/:id', presencaCtrl.excluir);

export default rotaPresenca;