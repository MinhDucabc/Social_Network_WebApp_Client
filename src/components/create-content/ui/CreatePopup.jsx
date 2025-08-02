import React, { useState } from "react";
import AskQuestionForm from "./AskQuestionForm";
import CreatePostForm from "./CreatePostForm";

export default function CreatePopup({
  user,
  group,
  isOpen,
  onClose,
  onQuestionSubmit,
  onPostSubmit,
}) {
  const [activeTab, setActiveTab] = useState("question");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`w-1/2 py-2 text-center ${
              activeTab === "question"
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("question")}
          >
            Ask question
          </button>
          <button
            className={`w-1/2 py-2 text-center ${
              activeTab === "post"
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("post")}
          >
            Create post
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "question" && (
          <AskQuestionForm
            user={user}
            group={group}
            onSubmit={onQuestionSubmit}
            onClose={onClose}
          />
        )}

        {activeTab === "post" && (
          <div>
            <CreatePostForm
              user={user}
              group={group}
              onSubmit={onPostSubmit}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
