import { combineReducers } from "redux";
import settings from "./settings/reducer";
import menu from "./menu/reducer";
import authUser from "./auth/reducer";

const reducers = combineReducers({
  menu,
  settings,
  authUser,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_USER") {
    state = undefined;
  }

  return reducers(state, action);
};

export default rootReducer;
