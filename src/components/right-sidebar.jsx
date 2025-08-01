import UserList from "./user-list";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../slices/profile/profile-slice.js";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";


export default function RightSidebar() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [authId, setAuthId] = useState(null);

  // Decode token to get authId
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const authid = decoded.authId;
        setAuthId(authid);
        dispatch(fetchUserProfile(authid));
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }
  }, [token, dispatch]);

  // Sync followed users
  // useEffect(() => {
  //   if (user?.following) {
  //     setFollowedUserIds(user.following);
  //   }
  // }, [user]);

  return (
    <aside className="w-72 bg-gray-50 p-4 border-l border-gray-200 shadow-inner">
      <h2 className="text-xl font-bold mb-4 text-gray-800">⭐ Following</h2>
      <UserList user={user} authId={authId}/>
    </aside>
  );
}
