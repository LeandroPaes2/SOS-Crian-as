import { Router } from "express"; //micro-aplicação HTTP
import ResponsavelCtrl from "../Controle/responsavelCtrl.js";

const respCtrl = new ResponsavelCtrl();
const rotaResponsavel = Router();

rotaResponsavel.post("/", respCtrl.gravar);
rotaResponsavel.put("/:cpf", respCtrl.editar);
rotaResponsavel.patch("/:cpf", respCtrl.editar);
rotaResponsavel.delete("/:cpf", respCtrl.excluir);
rotaResponsavel.get("/:cpf", respCtrl.consultar);
rotaResponsavel.get("/",respCtrl.consultar);

export default rotaResponsavel;


