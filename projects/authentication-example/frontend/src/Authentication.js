import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

import React from "react";
import { KEY_TOKEN, KEY_TOKEN_EXPIRATION } from "../Util/auth";

export const AuthenticationPage = () => {
  return <AuthForm />;
};

/**
 * Action signup / login déclenchée par le routage du formulaire d'authentification
 * @param {*} param0
 */
export const authAction = async ({ request, params }) => {
  const authFormData = await request.formData(); // récupération des données du formulaire d'authentification

  const authData = {
    email: authFormData.get("email"),
    password: authFormData.get("password"),
  };

  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unssuported mode" }, { status: 422 });
  }

  const response = await fetch(`http://localhost:8080/${mode}`, {
    // AUTHENTIFICATION
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response) {
    throw json({ message: "Could not authenticate user" }, { status: 500 });
  }

  // manage token
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem(KEY_TOKEN, token);
  const expiration = new Date(); // Enregistrer la date d'expiration du token, ici (date + 1h)
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem(KEY_TOKEN_EXPIRATION, expiration.toISOString());

  return redirect("/");
};
