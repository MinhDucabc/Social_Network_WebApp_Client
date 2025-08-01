import React from "react";
import { useNavigate } from "react-router-dom";

export default function SuggestUsers({ currentUserId, users = [], onToggleFollow }) {
  const navigate = useNavigate();

  if (!users || users.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">Gợi ý theo dõi</h3>
      {users.map((user) => (
        <div
          key={user.id}
          className="p-3 border-b space-y-2 hover:bg-gray-200"
        >
          <div className="flex items-center space-x-3" onClick={() => window.location.href = `/profile/${user.authId}`}>
            <img
              src={user.avatar || '../assets/default-avatar.png'}
              className="w-10 h-10 rounded-full"
              alt={user.name}
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">Level {user.level}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!currentUserId) return navigate("/login");
              onToggleFollow(user.id);
            }}
            className="px-3 py-1 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
          >
            Theo dõi
          </button>
        </div>
      ))}
    </div>
  );
}
