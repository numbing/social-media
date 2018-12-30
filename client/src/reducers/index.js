import { combineReducers } from "redux";
import authReducer from "./authReducer";
import erroReducer from "./errorReducer";
import profileReducer from "./profileReducer";

export default combineReducers({
  auth: authReducer,
  errors: erroReducer,
  profile: profileReducer
});
