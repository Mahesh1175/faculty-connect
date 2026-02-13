import { useState } from "react";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

const GuardLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (name === "Guard" && pass === "guard123") {
      localStorage.setItem("guardAuth", "true");
      toast.success("Login successful ✅");
      onLogin();
    } else {
      toast.error("Invalid credentials ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-sm p-6 sm:p-8 rounded-2xl shadow-lg space-y-5">
        <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <Lock size={18} /> Guard Login
        </h2>

        <input
          placeholder="Username"
          className="w-full border p-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded-md"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default GuardLogin;
