import { useState } from "react";
import { hotelApi } from "../api/hotelApi.js";
import { initialAuthForm } from "./initialState.js";

function readStoredUser() {
  const raw = localStorage.getItem("lab4_user");
  return raw ? JSON.parse(raw) : null;
}

export function useAuthState(runTask, setMessage) {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(initialAuthForm);
  const [user, setUser] = useState(readStoredUser);

  async function submitAuth(event) {
    event.preventDefault();

    await runTask(async () => {
      const result =
        authMode === "register"
          ? await hotelApi.register(authForm)
          : await hotelApi.login({
              email: authForm.email,
              password: authForm.password
            });

      localStorage.setItem("lab4_token", result.token);
      localStorage.setItem("lab4_user", JSON.stringify(result.user));
      setUser(result.user);
      setAuthForm(initialAuthForm);
      setMessage(authMode === "register" ? "Акаунт створено" : "Вхід виконано", "auth");
    }, "auth");
  }

  function logoutAuth() {
    localStorage.removeItem("lab4_token");
    localStorage.removeItem("lab4_user");
    setUser(null);
    setAuthForm(initialAuthForm);
    setAuthMode("login");
  }

  function updateAuthForm(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  return {
    authMode,
    authForm,
    user,
    setAuthMode,
    submitAuth,
    logoutAuth,
    updateAuthForm
  };
}
