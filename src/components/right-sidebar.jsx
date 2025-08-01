import { useEffect } from "react";
import UserList from "./user-list";
import { useDispatch, useSelector } from "react-redux";

export default function RightSidebar() {
  const { user } = useSelector((state) => state.profile);
  console.log(user);

  // Sync followed users
  // useEffect(() => {
  //   if (user?.following) {
  //     setFollowedUserIds(user.following);
  //   }
  // }, [user]);

  return (
    <aside className="w-72 bg-gray-50 p-4 border-l border-gray-200 shadow-inner">
      <h2 className="text-xl font-bold mb-4 text-gray-800">⭐ Following</h2>
      <UserList user={user}/>
    </aside>
  );
}
