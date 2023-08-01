import { useDispatch } from "react-redux";
import "./Auth.css";
import { authActions } from "../../store/auth-slice";

export const Auth = () => {
  const dispath = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    // Version Typescript à privilégier pour le typage
    const formData = new FormData(form);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (email?.trim() === "" || password?.trim() === "") {
      alert("Credentials error !");
      return;
    }

    dispath(authActions.login());
  };
  return (
    <main className="auth">
      <section>
        <form onSubmit={handleSubmit}>
          <div className="control">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <button>Login</button>
        </form>
      </section>
    </main>
  );
};
