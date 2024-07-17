import jwt from "jsonwebtoken";

import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGIN_USER_UPDATE_JWT,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  REFRESH_JWT_SUCCESS,
  REFRESH_JWT_FAILURE,
  REFRESH_JWT,
} from "../actions";

const INIT_STATE = {
  user: localStorage.getItem("jwt")
    ? jwt.decode(localStorage.getItem("jwt"))["username"]
    : null,
  jwt: localStorage.getItem("jwt"),
  jwtRefresh: localStorage.getItem("jwtRefresh"),
  roles: localStorage.getItem("jwt")
    ? jwt.decode(localStorage.getItem("jwt"))["groups"]
    : null,
  department: localStorage.getItem("jwt")
    ? jwt.decode(localStorage.getItem("jwt"))["department"]
    : null,
  user_id: localStorage.getItem("jwt")
    ? jwt.decode(localStorage.getItem("jwt"))["user_id"]
    : null,
  forgotUserMail: "",
  newPassword: "",
  resetPasswordCode: "",
  loading: false,
  error: "",
  dark_mode: localStorage.getItem("dark_mode"),
  first_name:
    localStorage.getItem("jwt") &&
    jwt.decode(localStorage.getItem("jwt"))["profile"]
      ? jwt.decode(localStorage.getItem("jwt"))["profile"]["first_name"]
      : null,
  last_name:
    localStorage.getItem("jwt") &&
    jwt.decode(localStorage.getItem("jwt"))["profile"]
      ? jwt.decode(localStorage.getItem("jwt"))["profile"]["last_name"]
      : null,
  mobile:
    localStorage.getItem("jwt") &&
    jwt.decode(localStorage.getItem("jwt"))["profile"]
      ? jwt.decode(localStorage.getItem("jwt"))["profile"]["mobile"]
      : null,
  timezone:
    localStorage.getItem("jwt") &&
    jwt.decode(localStorage.getItem("jwt"))["profile"]
      ? jwt.decode(localStorage.getItem("jwt"))["profile"]["timezone"]
      : null,
  profile_pic: localStorage.getItem("profile_pic"),
  channel_name:
    localStorage.getItem("jwt") &&
    jwt.decode(localStorage.getItem("jwt"))["profile"]
      ? jwt.decode(localStorage.getItem("jwt"))["channel_name"]
      : null,
  channel_list:
    localStorage.getItem("jwt") &&
    jwt.decode(localStorage.getItem("jwt"))["profile"]
      ? jwt.decode(localStorage.getItem("jwt"))["channel_list"]
      : null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loading: true, error: "" };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: jwt.decode(action.payload.access)["username"],
        user_id: jwt.decode(action.payload.access)["user_id"],
        jwt: action.payload.access,
        jwtRefresh: action.payload.refresh,
        // roles: action.payload.roles,
        roles: jwt.decode(action.payload.access)["groups"],
        department: jwt.decode(action.payload.access)["department"],
        first_name: action.payload.profile.first_name,
        last_name: action.payload.profile.last_name,
        mobile: action.payload.profile.mobile,
        timezone: action.payload.profile.timezone,
        profile_pic: action.payload.profile.profile_pic,
        channel_name: jwt.decode(action.payload.access)["channel_name"],
        channel_list: jwt.decode(action.payload.access)["channel_list"],
        error: "",
      };
    case LOGIN_USER_ERROR:
      return {
        ...state,
        loading: false,
        user: "",
        error: action.payload.message,
      };
    case LOGIN_USER_UPDATE_JWT:
      return {
        ...state,
        jwt: action.payload.access,
      };
    case FORGOT_PASSWORD:
      return { ...state, loading: true, error: "" };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        forgotUserMail: action.payload,
        error: "",
      };
    case FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        forgotUserMail: "",
        error: action.payload.message,
      };
    case RESET_PASSWORD:
      return { ...state, loading: true, error: "" };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        newPassword: action.payload,
        resetPasswordCode: "",
        error: "",
      };
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        newPassword: "",
        resetPasswordCode: "",
        error: action.payload.message,
      };
    case REGISTER_USER:
      return { ...state, loading: true, error: "" };
    case REGISTER_USER_SUCCESS:
      return { ...state, loading: false, user: "", error: "" };
    case REGISTER_USER_ERROR:
      return {
        ...state,
        loading: false,
        user: "",
        error: action.payload.message,
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        user_id: null,
        jwt: null,
        jwtRefresh: null,
        roles: null,
        department: null,
        error: null,
        first_name: null,
        last_name: null,
        mobile: null,
        timezone: null,
        channel_list: null,
        channel_name: null,
      };

    case CHANGE_PASSWORD:
      return { ...state, loading: true, error: "" };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, loading: false, error: "" };
    case CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case UPDATE_PROFILE:
      return { ...state, loading: true, error: "" };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,

        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        mobile: action.payload.mobile,
        timezone: action.payload.timezone,
        profile_pic: action.payload.profile_pic,

        error: "",
      };
    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        user: "",
        error: action.payload.message,
      };

    case REFRESH_JWT:
      return { ...state, loading: true, error: "" };
    case REFRESH_JWT_SUCCESS:
      return {
        ...state,
        loading: false,

        jwt: action.payload,

        error: "",
      };
    case REFRESH_JWT_FAILURE:
      return {
        ...state,
        loading: false,
        user: "",
        error: action.payload.message,
      };

    default:
      return { ...state };
  }
};
