import React from "react";

export default function FollowedUserList({ users, onToggleFollow }) {
  if (!users) return null;
  if (users.length === 0) return <div>Bạn chưa theo dõi ai.</div>;

  return (
    <div className="space-y-3 h-[250px] overflow-y-auto pr-2">
      <div className="sticky top-0 bg-gray-50 z-10 pb-2 border-b">
        <h2 className="text-lg font-semibold">Đang theo dõi</h2>
      </div>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
          >
            <div
              className="flex items-center space-x-3 cursor-pointer mb-2"
              onClick={() => (window.location.href = `/profile/${user.authId}`)}
            >
            <img
              src={user?.avatar || "/assets/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.target.onerror = null; // tránh lặp vô hạn nếu ảnh mặc định cũng lỗi
                e.target.src = "/assets/default-avatar.png";
              }}
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">Level: {user.level}</p>
              </div>
            </div>
            <button
              onClick={() => onToggleFollow(user.id)}
              className="w-full text-sm px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors font-medium"
            >
              Bỏ theo dõi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
