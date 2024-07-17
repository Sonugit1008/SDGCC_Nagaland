import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import API from "../../helpers/API";

import {
  LOGIN_MOBILE,
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  REFRESH_JWT,
  REFRESH_JWT_FAILURE,
  REFRESH_JWT_SUCCESS,
} from "../actions";

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  loginMobileSuccess,
} from "./actions";

import { push } from "react-router-redux";
import apiAuth from "../../helpers/ApiAuth";


export function* watchLoginMobile() {
  yield takeEvery(LOGIN_MOBILE, loginWithMobileAndOTP);
}

const loginWithMobileAndOTPAsync = async (cid, mobile, otp) =>
  await API.post("/api/mobile/login/", {
    cid: cid,
    mobile: mobile,
    otp: otp,
  })
    .then((authUser) => authUser.data)
    .catch((error) => {
      if (error.response.status !== 200) {
        return { message: "OTP Expired." };
      }
      return error;
    });

function* loginWithMobileAndOTP({ payload }) {
  const { password, mobile, otp } = payload.user;
  const { history } = payload;

  try {
    const loginUser = yield call(loginWithMobileAndOTPAsync, password, mobile, otp);

    if (!loginUser.message) {
      // console.log(loginUser);

      localStorage.setItem("jwt", loginUser.access_token);
      localStorage.setItem("jwtRefresh", loginUser.jwt);

      localStorage.setItem("dark_mode", loginUser.profile?.dark_mode);

      localStorage.setItem("profile_pic", loginUser.profile?.profile_pic);

      yield put(loginMobileSuccess(loginUser));
      // yield put({ type: GET_FACILITY });
      // yield put({ type: GET_APPLIANCE_DATA });
      // yield put({ type: GET_EMPLOYEE });
      // yield put({ type: GET_VISITOR });
      history.push("/");
    } else {
      yield put(loginUserError(loginUser.message));
    }
  } catch (error) {
    yield put(loginUserError(error));
  }
}


export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password) =>
  await API.post("/api/token/", {
    username: email,
    password: password,
  })
    .then((authUser) => authUser.data)
    .catch((error) => {
      if (error.response.status === 401) {
        return { message: "Incorrect Credentials" };
      }
      return error;
    });

function* loginWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;
  try {
    const loginUser = yield call(loginWithEmailPasswordAsync, email, password);

    if (!loginUser.message) {
      console.log(loginUser);

      localStorage.setItem("jwt", loginUser.access);
      localStorage.setItem("jwtRefresh", loginUser.refresh);

      localStorage.setItem("dark_mode", loginUser.profile.dark_mode);

      localStorage.setItem("profile_pic", loginUser.profile.profile_pic);

      yield put(loginUserSuccess(loginUser));

      history.push("/app");
    } else {
      yield put(loginUserError(loginUser.message));
    }
  } catch (error) {
    yield put(loginUserError(error));
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (email, password) =>
  await await API.post("/api/userauth/registration/", {
    email: email,
    password: password,
  })
    .then((authUser) => authUser)
    .catch((error) => error);

function* registerWithEmailPassword({ payload }) {
  const { email, password } = payload.user;

  try {
    const registerUser = yield call(
      registerWithEmailPasswordAsync,
      email,
      password
    );
    if (!registerUser.data.detail) {
      yield put(registerUserSuccess(registerUser));
    } else {
      yield put(registerUserError(registerUser.response?.data));
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
  history.push("/");

  localStorage.removeItem("jwt");
  localStorage.removeItem("jwtRefresh");
  localStorage.removeItem("dark_mode");
  localStorage.removeItem("channel_name");
  localStorage.removeItem("profile_pic");
  localStorage.clear();
};

function* logout({ payload }) {
  if (payload === undefined) {
    try {
      yield call(logoutAsync, async () => {
        push("/");

        localStorage.removeItem("jwt");
        localStorage.removeItem("jwtRefresh");
        localStorage.removeItem("dark_mode");
        localStorage.removeItem("profile_pic");
      });
    } catch (error) {}
  } else {
    const { history } = payload;
    try {
      yield call(logoutAsync, history);
    } catch (error) {}
  }
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
  return await await API.post("/api/userauth/password/reset/", {
    email: email,
  })
    .then((result) => result.data)
    .catch((error) => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    if (!forgotPasswordStatus.detail) {
      yield put(forgotPasswordError(forgotPasswordStatus));
    } else {
      yield put(forgotPasswordSuccess("success"));
    }
  } catch (error) {
    yield put(forgotPasswordError(error));
  }
}

export function* watchChangePassword() {
  yield takeEvery(CHANGE_PASSWORD, changePassword);
}

const changePasswordAsync = async (passwords) => {
  return await apiAuth
    .post("/api/userauth/password/change/", passwords)
    .then((result) => result.data)
    .catch((error) => {
      return {
        message: {
          response: error.response,
        },
      };
    });
};

function* changePassword({ payload }) {
  try {
    const changePasswordStatus = yield call(changePasswordAsync, payload);
    console.log(changePasswordStatus);
    if (!changePasswordStatus.message) {
      console.log(changePasswordStatus);
      yield put({ type: CHANGE_PASSWORD_SUCCESS, payload: payload });
    } else {
      console.log(changePasswordStatus.message);
      yield put({
        type: CHANGE_PASSWORD_ERROR,
        payload: { message: changePasswordStatus.message.response.status },
      });
    }
  } catch (error) {
    yield put({
      type: CHANGE_PASSWORD_ERROR,
      payload: { message: error },
    });
  }
}

export function* watchUpdateProfile() {
  yield takeEvery(UPDATE_PROFILE, updateProfile);
}

function* updateProfile({ payload }) {
  try {
    localStorage.setItem("dark_mode", payload.dark_mode);
    localStorage.setItem("profile_pic", payload.profile_pic);
    yield put({ type: UPDATE_PROFILE_SUCCESS, payload: payload });
  } catch (error) {
    yield put({
      type: UPDATE_PROFILE_ERROR,
      payload: { message: error },
    });
  }
}

export function* watchRefreshJWT() {
  yield takeEvery(REFRESH_JWT, refreshJWT);
}

const refreshJWTAsync = async () => {
  return await apiAuth
    .post("/api/token/refresh/", {
      refresh: localStorage.getItem("jwtRefresh"),
    })
    .then((result) => result.data)
    .catch((error) => {
      return {
        message: {
          response: error.response,
        },
      };
    });
};

function* refreshJWT() {
  try {
    const access = yield call(refreshJWTAsync);

    yield put({ type: REFRESH_JWT_SUCCESS, payload: access.access });
    localStorage.setItem("jwt", access.access);
  } catch (error) {
    yield put({
      type: REFRESH_JWT_FAILURE,
      payload: { message: error },
    });
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchRefreshJWT),
    fork(watchUpdateProfile),
    fork(watchChangePassword),
    fork(watchLoginUser),
    fork(watchLoginMobile),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
  ]);
}
