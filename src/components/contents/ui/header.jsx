import React, { useState } from "react";
import EditPostForm from "../edit-delete/edit-post-form";
import EditQuestionForm from "../edit-delete/edit-question-form";
import WarningDelete from "../edit-delete/delete-warning-form";

export default function Header({
  id,
  user,
  group,
  date,
  handleToggleFollow,
  followedUserIds,
  currentUserId,
  content,
  type,
  onhandleSubmit,
  onhandleDelete
}) {
  const isFollowing = followedUserIds.includes(user?.id);
  const isCurrentUser = user?.id === currentUserId;
  const [openEditDelete, setOpenEditDelete] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  return (
    <>
      <div className="flex flex-row items-center justify-between space-x-4">
        <div className="flex flex-row items-center space-x-3">
          <img
            src={user?.avatar || "../../../assets/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-800">{user?.name}</p>
              {group && (
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                  {group?.name || ""}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Ngày đăng: {new Date(date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {!isCurrentUser && (
          <button
            onClick={() => handleToggleFollow(user.id)}
            className={`text-sm px-3 py-1 rounded-full ${
              isFollowing ? "bg-gray-300 text-black" : "bg-blue-500 text-white"
            }`}
          >
            {isFollowing ? "Hủy theo dõi" : "Theo dõi"}
          </button>
        )}

        {isCurrentUser && (
          <div className="relative">
            <button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
              onClick={() => setOpenEditDelete(!openEditDelete)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01"
                />
              </svg>
            </button>

            {openEditDelete && (
              <div className="absolute right-10 top-0 bg-white rounded-md shadow-lg p-2 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(true);
                    setOpenEditDelete(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:bg-gray-100 px-4 py-2"
                >
                  Chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteWarning(true);
                    setOpenEditDelete(false);
                  }}
                  className="block w-full text-left text-red-500 hover:bg-red-100 px-4 py-2"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showEditForm &&
        type ===
          "question" && (
            <EditQuestionForm
              questionid={id}
              content={content}
              onSubmit={onhandleSubmit}
              onClose={() => setShowEditForm(false)}
            />
          )}
      {showEditForm &&
        type ===
          "post" && (
            <EditPostForm
              onSubmit={onhandleSubmit}
              postid={id}
              content={content}
              onClose={() => setShowEditForm(false)}
            />
          )}

      {showDeleteWarning && (
        <WarningDelete
          contentId={id}
          onClose={() => setShowDeleteWarning(false)}
          onDelete={onhandleDelete}
        />
      )}
    </>
  );
}
