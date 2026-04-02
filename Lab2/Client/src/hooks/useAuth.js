import { useState } from "react";
import { parseJwt } from "../utils/jwt";
import { loginRequest, registerRequest } from "../api/auth";

export function useAuth() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const user = token ? parseJwt(token) : null;

  const login = async (email, password) => {
    try {
      const data = await loginRequest(email, password);

      if (!data.token) {
        alert(data.error || "Login error");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch {
      alert("Login request failed");
    }
  };

  const register = async (email, password) => {
    try {
      const data = await registerRequest(email, password);

      if (data.error) {
        alert(data.error);
        return;
      }

      await login(email, password);
    } catch {
      alert("Register request failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    token,
    user,
    login,
    register,
    logout
  };
}