import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowers } from "../../../slices/profile/followers-slice.js"
import { fetchFollowing } from "../../../slices/profile/following-slice.js"

export default function FollowSection({ user }) {
  const [view, setView] = useState("followers");
  const dispatch = useDispatch();

  const followers = useSelector((state) => state.followers.list);
  const following = useSelector((state) => state.following.list);
  const loadingFollowers = useSelector((state) => state.followers.loading);
  const loadingFollowing = useSelector((state) => state.following.loading);

  const ids = view === "followers" ? user.followers || [] : user.following || [];

  useEffect(() => {
    if (view === "followers") {
      dispatch(fetchFollowers(ids));
    } else {
      dispatch(fetchFollowing(ids));
    }
  }, [view, dispatch, JSON.stringify(ids)]); // JSON.stringify tránh skip fetch khi array reference không thay đổi

  const list = view === "followers" ? followers : following;
  const loading = view === "followers" ? loadingFollowers : loadingFollowing;

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-40 pr-4 border-b md:border-b-0 md:border-r mb-4 md:mb-0">
        <SidebarButton label="Followers" view={view} setView={setView} />
        <SidebarButton label="Following" view={view} setView={setView} />
      </div>

      {/* List */}
      <div className="flex-1 pl-0 md:pl-4">
        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500">Không có người nào.</p>
        ) : (
          <ul className="space-y-2">
            {list.map((userObj, idx) => (
              <li
                key={idx}
                className="flex items-center space-x-3 p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                <img
                  src={userObj.avatar || "../../../assets/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{userObj.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SidebarButton({ label, view, setView }) {
  const key = label.toLowerCase();
  const isActive = view === key;

  return (
    <button
      onClick={() => setView(key)}
      className={`block w-full text-left p-2 rounded ${
        isActive
          ? "bg-blue-100 text-blue-700 font-medium"
          : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
