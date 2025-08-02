import React from "react";

export default function ReplyItem({repliesCount, reply, onToggleReply, hideReplyButton = false}) {
  const user = reply.user;

  return (
    <div className="mb-6 mt-6">
      <div className="flex items-center space-x-2 mb-2">
        <img src={user.avatar || "/assets/default-avatar.png"} alt="avatar" className="w-8 h-8 rounded-full"
        onError={(e) => {
          e.target.onerror = null; // tránh lặp vô hạn nếu ảnh mặc định cũng lỗi
          e.target.src = "/assets/default-avatar.png";
        }}
        />
        <div className="bg-gray-100 px-4 py-2 rounded-xl max-w-xl">
          <div className="font-semibold text-sm text-gray-900 mb-1">
            {user.name}
          </div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {reply.text}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-sm text-gray-600 ml-8">
        {/* <button
          className="flex items-center hover:text-blue-600"
          onClick={() => {}}
        >
          👍 <span className="ml-1">{reply.upvotes || 0}</span>
        </button>

        <button
          className="flex items-center hover:text-red-500"
          onClick={() => {}}
        >
          👎 <span className="ml-1">{reply.downvotes || 0}</span>
        </button> */}

        {!hideReplyButton && (
          <button
            className="flex items-center hover:text-green-500"
            onClick={() => onToggleReply?.(reply.id)}
          >
            <span className="ml-1 ml-6">Reply</span>
          </button>
        )}
        {repliesCount > 0 && (
          <span className="ml-1 ml-6">{repliesCount}</span>
        )}
      </div>
    </div>
  );
}
