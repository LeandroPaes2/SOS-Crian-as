import { configureStore } from "@reduxjs/toolkit";
import funcionarioReducer from "./funcionarioReducer";

const store = configureStore({
    reducer:{
        'funcionario':funcionarioReducer
    }
});

export default store;