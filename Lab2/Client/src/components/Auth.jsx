import { useState } from "react";

const Auth = ({ login, register }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="page">
      <div style={{ maxWidth: 400, margin: "40px auto" }}>
        <h1>Authorization</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: 10,
            padding: 10
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            display: "block",
            width: "100%",
            marginBottom: 10,
            padding: 10
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => login(email, password)}>
            Login
          </button>

          <button
            onClick={() => register(email, password)}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;