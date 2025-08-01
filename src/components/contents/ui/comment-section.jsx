import React, { useState } from "react";
import ReplyItem from "./reply-item.jsx";
import { useSelector } from "react-redux";
import { addComment } from "../../../slices/contents/comments-slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CommentSection({ postid, comments }) {
  
  const [commentText, setCommentText] = useState("");
  const { user } = useSelector((state) => state.profile);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleAddComment = () => {
    if (!user) {
      return navigate("/login");
    }
    dispatch(addComment({ postId: postid, userId: user?.id, text: commentText }))
    .then(() => {
      setCommentText("");
    })
    .catch((err) => {
      console.error("Comment add error:", err);
    });
  };

  return (
    <div className="mt-6">
      {/* Form nhập comment */}
      <div className="flex items-start space-x-2 mb-4">
        {/* Giả sử current user đang được giữ ở localStorage hoặc Redux */}
        <img
          src={user?.avatar || "../../assets/default-avatar.png"}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          className="w-full border rounded-full px-3 py-1 text-sm focus:outline-none"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-full"
          onClick={() => handleAddComment()}
        >
          Comment
        </button>
      </div>

      {/* Hiển thị danh sách comment */}
      <div>
        {comments.map((comment) => (
          <ReplyItem
            key={comment.id}
            reply={comment}
            onToggleReply={() => {}}
            hideReplyButton={true}
          />
        ))}
      </div>
    </div>
  );
}
