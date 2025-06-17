//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import FormularioSaudeCtrl from "../Controle/formularioSaudeCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const FormSaudeCtrl = new FormularioSaudeCtrl();
const rotaFormularioSaude = Router();

rotaFormularioSaude.post("/", FormSaudeCtrl.gravar);
rotaFormularioSaude.put("/:num", FormSaudeCtrl.alterar);
rotaFormularioSaude.patch("/:num", FormSaudeCtrl.alterar);
rotaFormularioSaude.delete("/:num", FormSaudeCtrl.excluir);
rotaFormularioSaude.get("/:id?", FormSaudeCtrl.consultar);
rotaFormularioSaude.get("/",FormSaudeCtrl.consultar);


export default rotaFormularioSaude;


