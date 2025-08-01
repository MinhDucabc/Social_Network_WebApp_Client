import { Link } from "react-router-dom";
import {useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";

export default function Header() {
  const isLoggedIn = useSelector((state) => state.auth.token);
  let authId = null;
  if (isLoggedIn) {
    const decoded = jwtDecode(isLoggedIn);
    authId = decoded.authId;
  }
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-3xl font-bold">SocialApp</div>
      <nav className="space-x-4">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        {
          isLoggedIn ? (
            <Link to={`/profile/${authId}`} className="hover:text-blue-500">Profile</Link>
          ) : (
            <Link to="/login" className="hover:text-blue-500">Login</Link>
          )
        }
      </nav>
    </header>
  );
}
