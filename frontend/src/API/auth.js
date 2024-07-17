import API from "../helpers/API";

export const loginWithEmail = async (user, pass) => {
  const response = await API.post("/api/auth/token/login/", {
    username: user,
    password: pass
  });
  console.log(response);
  return response;
};
