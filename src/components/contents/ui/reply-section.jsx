import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepliesByReplyIds } from "../../../slices/contents/replies-slice.js";
import ReplyItem from "./reply-item.jsx";
import { addReply } from "../../../slices/contents/replies-slice.js";
import { useNavigate } from "react-router-dom";

export default function ReplySection({ questionId, parentId, replies }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const repliesData = useSelector((state) => state.replies.data);

  const navigate = useNavigate();

  const [replyText, setReplyText] = useState("");
  const [isReplyingTo, setIsReplyingTo] = useState(null);

  const toggleReplyInputFor = (replyId, repliesArray) => {
    const repliesIds = repliesArray.map(r => typeof r === "string" ? r : r.id);
    dispatch(fetchRepliesByReplyIds(repliesIds));
    setIsReplyingTo((prev) => (prev === replyId ? null : replyId));
  };

  const handleAddReply = () => {
    if (!user) {
      return navigate("/login");
    }
    if (!replyText.trim()) return;
    dispatch(
      addReply({
        questionId,
        parentId: parentId || null,
        userId: user?.id,
        text: replyText,
      })
    )
      .then(() => {
        setReplyText("");
        setIsReplyingTo(null);
      })
      .catch((err) => {
        console.error("Reply add error:", err);
      });
  };

  return (
    <div className="ml-4 mt-6 border-l pl-2">
      {/* Reply Input */}
      <div className="flex items-start space-x-2 mb-4">
        <img
          src={user?.avatar || "../../assets/default-avatar.png"}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <input
          type="text"
          placeholder="Write a reply..."
          className="w-full border rounded-full px-3 py-1 text-sm focus:outline-none"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-full"
          onClick={handleAddReply}
        >
          Reply
        </button>
      </div>

      {/* Display Replies */}
      <div>
        {replies?.map((reply) => {
          const childReplies = repliesData[reply.id]; // lấy từ redux, sau khi fetch về
          const repliesCount = Math.max(reply?.replies?.length || 0, repliesData[reply.id]?.length || 0);
          return (
            <div key={reply.id}>
              <ReplyItem
                repliesCount={repliesCount}
                reply={reply}
                onToggleReply={() => toggleReplyInputFor(reply.id, reply.replies)}
                hideReplyButton={false}
              />
              {isReplyingTo === reply.id && (
                <ReplySection
                  replies={childReplies}
                  questionId={questionId}
                  parentId={reply.id}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
