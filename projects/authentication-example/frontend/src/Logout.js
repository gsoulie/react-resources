import { redirect } from "react-router-dom";
import { KEY_TOKEN, logout } from "../Util/auth";

export function action() {
  logout();
  return redirect("/");
}
