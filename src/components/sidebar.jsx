import { useDispatch } from "react-redux";
import { logout } from "../slices/auth/auth-slice.js";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onSelect }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-gray-50 p-6 flex flex-col justify-between shadow-lg">
      <div>
        <h1 className="text-xl font-extrabold mb-6 text-gray-800">📊 Dashboard</h1>
        <ul className="space-y-4 text-lg text-gray-700">
          <li
            onClick={() => onSelect("content")}
            className="cursor-pointer hover:font-bold hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            📄 Content
          </li>
          {/* <li
            onClick={() => onSelect("groups")}
            className="cursor-pointer hover:font-bold hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            👥 Groups
          </li>
          <li
            onClick={() => onSelect("tags")}
            className="cursor-pointer hover:font-bold hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            🏷️ Tags
          </li>
          <li
            onClick={() => onSelect("follow")}
            className="cursor-pointer hover:font-bold hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            ⭐ Following
          </li> */}
        </ul>
      </div>
      <div className="space-y-4 text-lg text-gray-700 mt-6">
        <hr className="border-gray-300" />
        <ul className="space-y-4 text-lg text-gray-700 font-semibold">
          <li
            onClick={() => onSelect("settings")}
            className="cursor-pointer hover:font-bold hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            ⚙️ Settings
          </li>
          <li
            onClick={handleLogout}
            className="cursor-pointer hover:text-red-600 hover:font-bold px-3 py-2 rounded-md"
          >
            🚪 Logout
          </li>
        </ul>
      </div>
    </aside>
  );
}
