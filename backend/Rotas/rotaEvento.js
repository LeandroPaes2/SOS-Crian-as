import { Router } from "express"; //micro-aplicação HTTP
import EventoCtrl from "../Controle/eventoCtrl.js";

const eveCtrl = new EventoCtrl();
const rotaEvento = Router();

rotaEvento.post("/",autenticarToken, autorizarNivel("6", "1", "2", "5", "3"), eveCtrl.gravar);
rotaEvento.put("/:id",autenticarToken, autorizarNivel("6", "1", "2", "5", "3"), eveCtrl.editar);
rotaEvento.patch("/:id",autenticarToken, autorizarNivel("6", "1", "2", "5", "3"), eveCtrl.editar);
rotaEvento.delete("/:id",autenticarToken, autorizarNivel("6", "1", "2", "5", "3"), eveCtrl.excluir);
rotaEvento.get("/:id",autenticarToken, autorizarNivel("6", "1", "2", "5", "3"), eveCtrl.consultar);
rotaEvento.get("/",autenticarToken, autorizarNivel("6", "1", "2", "5", "3"),eveCtrl.consultar);

export default rotaEvento;


