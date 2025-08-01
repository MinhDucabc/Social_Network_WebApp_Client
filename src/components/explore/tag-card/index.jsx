import React from "react";

export default function TagCard({ tag }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ backgroundColor: tag.color + "20" }} // màu nhạt từ tag.color
    >
      <h3 className="text-lg font-semibold">
        {tag.icon} {tag.name}
      </h3>
      <p className="text-sm text-gray-600">{tag.description}</p>
      <span className="text-xs text-gray-400">
        {tag.groupCount} nhóm · {tag.postCount} bài viết
      </span>
    </div>
  );
}
