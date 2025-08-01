import React from "react";

export default function InteractionField({
  type,
  comments,
  replies,
  contentId,
  handleToggleVotes,
  handleToggleSaved,
  usersByContentId,
  voteChanges,
  setToggleCommentSection,
  currentUserId,
}) {
  const upChange =
    voteChanges[contentId]?.filter((v) => v.type === "upvote").length || 0;
  const downChange =
    voteChanges[contentId]?.filter((v) => v.type === "downvote").length || 0;

  const usersavedCount = usersByContentId[contentId]?.length || 0;

  const isUpvote = voteChanges[contentId]?.some((v) => v.type === "upvote" && v.userId === currentUserId);
  const isDownvote = voteChanges[contentId]?.some((v) => v.type === "downvote" && v.userId === currentUserId);
  const isSaved = usersByContentId[contentId]?.some((user) => user.id === currentUserId);

  let replyCount, commentCount;
  if (type === "question") {
    replyCount = replies.filter((r) => r.questionId === contentId).length;
  } else if (type === "post") {
    commentCount = comments.filter((c) => c.postId === contentId).length;
  }

  return (
    <div className="mt-4">
      {/* Upvote/Downvote */}
      <div className="flex items-center space-x-4">
        {/* Upvote */}
        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-1">
          <button
            className="flex items-center text-gray-600 hover:text-green-500 focus:outline-none"
            onClick={() => handleToggleVotes("upvote", contentId)}
            aria-label="Upvote"
          >
            {/* Arrow Up Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 hover:text-green-300 ${isUpvote ? "text-green-500" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6l6 6H6l6-6z"
              />
            </svg>
          </button>
          {/* Divider */}
          <div className="mx-2 w-px h-5 bg-gray-300" />
          <span className=" text-gray-700">{upChange}</span>
        </div>
        {/* Downvote */}
        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-1">
          <button
            className="flex items-center text-gray-600 hover:text-red-500 focus:outline-none"
            onClick={() => handleToggleVotes("downvote", contentId)}
            aria-label="Downvote"
          >
            {/* Arrow Down Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 hover:text-red-300 ${isDownvote ? "text-red-500" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18l-6-6h12l-6 6z"
              />
            </svg>
          </button>
          {/* Divider */}
          <div className="mx-2 w-px h-5 bg-gray-300" />
          <span className="text-gray-700">{downChange}</span>
        </div>
        {/* Comment Icon */}
        <div className="flex flex-row items-center px-3 py-1">
          {type == "question" ? (
            <span className="text-gray-700">{replyCount}</span>
          ) : (
            <span className="text-gray-700">{commentCount}</span>
          )}
          <button
            className="text-gray-600 hover:text-blue-500 focus:outline-none"
            onClick={setToggleCommentSection}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          {/* Saved Icon */}
          <div className="flex flex-row items-center px-3 py-1">
            <span className="text-gray-700">{usersavedCount}</span>
            <button 
            onClick={() => handleToggleSaved(contentId, currentUserId)}
            className={`text-gray-600 focus:outline-none `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 hover:text-blue-300 ${isSaved ? "text-blue-500" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
