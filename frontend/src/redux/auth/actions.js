import {
  LOGIN_MOBILE,
  LOGIN_MOBILE_SUCCESS,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  LOGIN_USER_UPDATE_JWT,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_ERROR,
  REGISTER_USER_ERROR,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "../actions";

export const loginMobile = (user, history) => ({
  type: LOGIN_MOBILE,
  payload: { user, history },
});

export const loginMobileSuccess = (user) => ({
  type: LOGIN_MOBILE_SUCCESS,
  payload: user,
});


export const loginUser = (user, history) => ({
  type: LOGIN_USER,
  payload: { user, history },
});
export const loginUserSuccess = (user) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});
export const loginUserError = (message) => ({
  type: LOGIN_USER_ERROR,
  payload: { message },
});

export const loginUserUpdateJWT = (access) => ({
  type: LOGIN_USER_UPDATE_JWT,
  payload: { access },
});

export const forgotPassword = (forgotUserMail, history) => ({
  type: FORGOT_PASSWORD,
  payload: { forgotUserMail, history },
});
export const forgotPasswordSuccess = (forgotUserMail) => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: forgotUserMail,
});
export const forgotPasswordError = (message) => ({
  type: FORGOT_PASSWORD_ERROR,
  payload: { message },
});

export const resetPassword = ({ resetPasswordCode, newPassword, history }) => ({
  type: RESET_PASSWORD,
  payload: { resetPasswordCode, newPassword, history },
});
export const resetPasswordSuccess = (newPassword) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: newPassword,
});
export const resetPasswordError = (message) => ({
  type: RESET_PASSWORD_ERROR,
  payload: { message },
});

export const registerUser = (user, history) => ({
  type: REGISTER_USER,
  payload: { user, history },
});
export const registerUserSuccess = (user) => ({
  type: REGISTER_USER_SUCCESS,
  payload: user,
});
export const registerUserError = (message) => ({
  type: REGISTER_USER_ERROR,
  payload: { message },
});

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload: { history },
});

export const REFRESH_JWT = "REFRESH_JWT";
export const REFRESH_JWT_SUCCESS = "REFRESH_JWT_SUCCESS";
export const REFRESH_JWT_FAILURE = "REFRESH_JWT_FAILURE";
