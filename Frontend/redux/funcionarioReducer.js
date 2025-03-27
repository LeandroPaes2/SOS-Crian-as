import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { consultarFuncionario, excluirFuncionario, gravarFuncionario, alterarFuncionario } from "../servicos/servicoFuncionario.js";

import ESTADO from "./estado.js";  

export const buscarFuncionarios = createAsyncThunk('buscarFuncionarios', async ()=>{
    //lista de funcionarios
    const resultado = await consultarFuncionario();
    //se for um array/lista a consulta funcionou
    try {
        if (Array.isArray(resultado)){
            return {
                "status":true,
                "mensagem":"Funcionarios recuperados com sucesso",
                "listaDeFuncionarios":resultado
            }
        }
        else
        {
            return {
                "status":false,
                "mensagem":"Erro ao recuperar os funcionarios do backend.",
                "listaDeFuncionarios":[]
            }
        }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
            "listaDeFuncionarios":[]
        }
    }
});

export const apagarFuncionario = createAsyncThunk('apagarFuncionario', async (funcionario)=>{
//dar previsibilidade ao conteúdo do payload
    //lista de funcionarios
    console.log(funcionario);
    const resultado = await excluirFuncionario(funcionario);
    //se for um array/lista a consulta funcionou
    console.log(resultado);
    try {
            return {
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "codigo":funcionario.codigo
            }
    }
    catch(erro){
        return {
            "status":false,
            "mensagem":"Erro: " + erro.message,
        }
    } 
});

export const inserirFuncionario = createAsyncThunk('inserirFuncionario', async (funcionario)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do funcionario gerado na inclusao
    try{
        const resultado=await gravarFuncionario(funcionario);
        if(resultado.status)
        {
            //esse o é o payload retornado para o redutor
            funcionario.codigo=resultado.codigo;
            return{
                "status":resultado.status,
                "mensagem":resultado.mensagem,
                "funcionario":funcionario
            };
        }
        else{
            return{
                "status":resultado.status,
                "mensagem":resultado.mensagem
            };
        }
    } catch(erro){
        //esse o é o payload retornado para o redutor
        return{
            "status":false,
            "mensagem":"Nao foi possivel se comunicar com o backend" + erro.message
        };
    }
});

export const atualizarFuncionario = createAsyncThunk('atualizarFuncionario', async (funcionario)=>{
    //Previsibilidade de comportamento ao que será retornado para a aplicação(redutor)
   
    //status e mensagem
    //sucesso => codigo do funcionario gerado na inclusao
    try{
        const resultado=await alterarFuncionario(funcionario);
        //esse o é o payload retornado para o redutor
        return{
            "status":resultado.status,
            "mensagem":resultado.mensagem,
            "funcionario":funcionario
        };
    } catch(erro){
        //esse o é o payload retornado para o redutor
        return{
            "status":false,
            "mensagem":"Nao foi possivel se comunicar com o backend" + erro.message
        };
    }
});

const funcionarioReducer = createSlice({
    name:'funcionario',
    initialState:{
        estado: ESTADO.OCIOSO,
        mensagem:"",
        listaDeFuncionarios:[]
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder.addCase(buscarFuncionarios.pending, (state, action) =>{
            state.estado=ESTADO.PENDENTE
            state.mensagem="Processando requisição (buscando funcionarios)"
        })
        .addCase(buscarFuncionarios.fulfilled, (state, action) =>{
          if (action.payload.status){
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            state.listaDeFuncionarios=action.payload.listaDeFuncionarios;
          } 
          else{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeFuncionarios=action.payload.listaDeFuncionarios;
          } 
        })
        .addCase(buscarFuncionarios.rejected, (state, action) =>{
            state.estado=ESTADO.ERRO;
            state.mensagem = action.payload.mensagem;
            state.listaDeFuncionarios=action.payload.listaDeFuncionarios;
        })
        .addCase(apagarFuncionario.pending, (state,action) =>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(excluindo o funcionario do backend";
        })
        .addCase(apagarFuncionario.fulfilled,(state,action) =>{
            state.estado=ESTADO.OCIOSO;
            state.mensagem=action.payload.mensagem;
            if(action.payload.status){                        
                state.listaDeFuncionarios=state.listaDeFuncionarios.filter((item)=> item.codigo !== action.payload.codigo);
                //altera a lista de funcionarios
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(apagarFuncionario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
        .addCase(inserirFuncionario.pending, (state, action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(incluindo o funcionario no backend";
        })
        .addCase(inserirFuncionario.fulfilled,(state,action) =>{
            if(action.payload.status){     
                //sucesso da inclusão do funcionario                  
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeFuncionarios.push(action.payload.funcionario);
                //altera a lista de funcionarios
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(inserirFuncionario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
        .addCase(atualizarFuncionario.pending, (state,action)=>{
            state.estado=ESTADO.PENDENTE;
            state.mensagem="Processando a requsição(alterando o funcionario no backend";
        })
        .addCase(atualizarFuncionario.fulfilled, (state,action)=>{
            if(action.payload.status){     
                //sucesso da inclusão do funcionario                  
                state.estado=ESTADO.OCIOSO; 
                state.mensagem=action.payload.mensagem;
                state.listaDeFuncionarios=state.listaDeFuncionarios.map((item)=> item.codigo===action.payload.funcionario.codigo ? action.payload.funcionario : item);
                //altera a lista de funcionarios
            }
            else{
                state.estado=ESTADO.ERRO;
                state.mensagem=action.payload.mensagem;
            }
        })
        .addCase(atualizarFuncionario.rejected,(state,action)=>{
            state.estado=ESTADO.ERRO;
            state.mensagem=action.payload.mensagem;//action.payload.mensagem;
        })
    }
});

export default funcionarioReducer.reducer;