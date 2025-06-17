import { Router } from "express"; //micro-aplicação HTTP
import ResponsavelCtrl from "../Controle/responsavelCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const respCtrl = new ResponsavelCtrl();
const rotaResponsavel = Router();

rotaResponsavel.post("/",autenticarToken, autorizarNivel("1", "2"), respCtrl.gravar);
rotaResponsavel.put("/:cpf",autenticarToken, autorizarNivel("1", "2"), respCtrl.editar);
rotaResponsavel.patch("/:cpf",autenticarToken, autorizarNivel("1", "2"), respCtrl.editar);
rotaResponsavel.delete("/:cpf",autenticarToken, autorizarNivel("1", "2"), respCtrl.excluir);
rotaResponsavel.get("/:cpf",autenticarToken, autorizarNivel("1", "2"), respCtrl.consultar);
rotaResponsavel.get("/",autenticarToken, autorizarNivel("1", "2"),respCtrl.consultar);

export default rotaResponsavel;


