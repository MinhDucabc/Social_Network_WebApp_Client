import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../slices/auth/auth-slice.js";

export default function SignupForm({ setActiveTab }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [servererr, setServerErr] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (error) {
      setServerErr(error);
    }
  }, [error]);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!name) newErrors.name = "Name is required";
    else if (name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(registerUser({ email, password, name }));
    if (result) {
      setActiveTab("login"); // ✅ chuyển sang tab login
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800">Tạo tài khoản mới</h2>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Họ tên</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
            setServerErr("");
          }}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Nguyễn Văn A"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

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

      {servererr && <p className="text-red-500 text-sm">{servererr}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>
    </form>
  );
}
