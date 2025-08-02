import React from "react";

export default function ContentCreateTrigger({ group, user, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="bg-white rounded-2xl shadow-md p-4 w-full max-w-xl mx-auto flex items-center space-x-4 cursor-pointer hover:bg-gray-50"
    >
      <img
        src={user?.avatar || "/assets/default-avatar.png"}
        alt="Avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
      <input
        type="text"
        placeholder="Bạn muốn hỏi hay đăng gì?"
        className="bg-gray-100 rounded-xl px-4 py-2 w-full text-gray-500 cursor-pointer"
      />
    </div>
  );
}
