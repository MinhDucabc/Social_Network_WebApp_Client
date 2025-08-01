import React from "react";

export default function Description({ title, description, tags }) {
  return (
  <div>
    <div className="mb-4">
      <h2 className="font-bold text-2xl">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
    {/* Tags */}
    <div className="flex flex-wrap gap-2 ml-auto">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
        >
          {tag?.name || ""}
        </span>
      ))}
    </div>
  </div>
  );
}
