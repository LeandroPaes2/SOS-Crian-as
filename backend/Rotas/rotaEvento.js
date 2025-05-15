import { Router } from "express"; //micro-aplicação HTTP
import EventoCtrl from "../Controle/eventoCtrl.js";

const eveCtrl = new EventoCtrl();
const rotaEvento = Router();

rotaEvento.post("/", eveCtrl.gravar);
rotaEvento.put("/:id", eveCtrl.editar);
rotaEvento.patch("/:id", eveCtrl.editar);
rotaEvento.delete("/:id", eveCtrl.excluir);
rotaEvento.get("/:id", eveCtrl.consultar);
rotaEvento.get("/",eveCtrl.consultar);

export default rotaEvento;


