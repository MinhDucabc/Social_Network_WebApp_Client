import React from "react";
import { useState, useEffect, useRef } from "react";

export default function content({title, content, image, tags}) {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    // Check if the content overflows the container
    const contentEl = contentRef.current;
    if (contentEl && contentEl.scrollHeight > contentEl.clientHeight) {
      setShouldShowButton(true);
    }
  }, []);

  return (
    <div className="mt-4">
      <div
        ref={contentRef}
        className={`transition-all overflow-hidden ${
          expanded ? "max-h-full" : "max-h-[300px]"
        } mb-4`}
      >
        <h2 className="text-xl font-bold mb-2">
          {title}
        </h2>
        <p className="text-gray-700 text-base">
          {content}
        </p>
        {image && (
          <img
            src={image}
            alt="post"
            className="mt-3 rounded-lg w-full object-cover"
          />
        )}
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
      {/* View More Button */}
      {shouldShowButton && !expanded && (
        <div className="text-center mt-2">
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-500 text-sm hover:underline"
          >
            View More
          </button>
        </div>
      )}

      {/* View Less Button */}
      {expanded && (
        <div className="text-center mt-2">
          <button
            onClick={() => setExpanded(false)}
            className="text-blue-500 text-sm hover:underline"
          >
            View Less
          </button>
        </div>
      )}
    </div>
  );
}
