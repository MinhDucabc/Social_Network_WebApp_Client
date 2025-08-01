import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../slices/auth/auth-slice.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function LoginForm({ setActiveTab }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [servererr, setServerErr] = useState("");

  useEffect(() => {
    if (token) {
      navigate(`/profile/${jwtDecode(token).authId}`);
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      setServerErr(error);
    }
  }, [error]);
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800">Chào mừng trở lại</h2>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
            setServerErr("");
          }}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "" })); 
            setServerErr("");
          }}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      {servererr && <p className="text-red-600 text-sm">{servererr}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
