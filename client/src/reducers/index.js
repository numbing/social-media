import { combineReducers } from "redux";
import authReducer from "./authReducer";
import erroReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  errors: erroReducer
});
