import React from "react";

export default function FollowedUserList({ users, onToggleFollow }) {
  if (!users) return null;
  if (users.length === 0) return <div>Bạn chưa theo dõi ai.</div>;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Đang theo dõi</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between border-b pb-2 hover:bg-gray-100"
        >
          <div className="flex items-center space-x-3" onClick={() => window.location.href = `/profile/${user.authId}`}>
            <img
              src={user.avatar || '../assets/default-avatar.png'}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">Level: {user.level}</p>
            </div>
          </div>
          <button
            onClick={() => onToggleFollow(user.id)}
            className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            Bỏ theo dõi
          </button>
        </div>
      ))}
    </div>
  );
}
