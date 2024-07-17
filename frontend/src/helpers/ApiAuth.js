import axios from "axios";
import { smartsightAPI } from "../constants/defaultValues";
import jwt from "jsonwebtoken";

const apiAuth = axios.create({
  baseURL: smartsightAPI,
});

const requestHandler = async (request) => {
  // Modify request here
  const token = localStorage.getItem("jwt");

  var decodedToken = jwt.decode(token, { complete: true });

  var exdate = new Date().getTime() / 1000;
  let isExpired = false;
  if (decodedToken === null) {
    isExpired = true;
  } else {
    if (decodedToken.payload.exp < exdate) isExpired = true;
  }

  if (isExpired) {
    console.log("is expired");
    const refreshToken = localStorage.getItem("jwtRefresh");
    const res = await axios.post(smartsightAPI + "/api/token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem("jwt", res.data.access);
    request.headers["Authorization"] = "Bearer " + localStorage.getItem("jwt");
    return request;
  } else {
    request.headers["Authorization"] = "Bearer " + localStorage.getItem("jwt");

    return request;
  }
};

apiAuth.interceptors.request.use(async (request) => requestHandler(request));

export default apiAuth;
