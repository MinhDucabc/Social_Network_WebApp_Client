import React from "react";
import { useState, useEffect, useRef } from "react";

export default function content({title, content, image, tags}) {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    // Kiểm tra overflow sau khi component mount và khi content thay đổi
    const checkOverflow = () => {
      const contentEl = contentRef.current;
      if (contentEl) {
        const scrollHeight = contentEl.scrollHeight;
        const clientHeight = contentEl.clientHeight;
        const hasOverflow = scrollHeight > clientHeight;
        
        console.log(`📏 Content overflow check:`, {
          scrollHeight,
          clientHeight,
          hasOverflow,
          contentLength: content?.length || 0
        });
        
        setShouldShowButton(hasOverflow);
      }
    };

    // Delay một chút để đảm bảo DOM đã render
    const timer = setTimeout(checkOverflow, 100);
    
    return () => clearTimeout(timer);
  }, [content, title, image]); // Re-check khi content, title, hoặc image thay đổi

  // Thêm effect để re-check khi window resize
  useEffect(() => {
    const handleResize = () => {
      const contentEl = contentRef.current;
      if (contentEl) {
        const scrollHeight = contentEl.scrollHeight;
        const clientHeight = contentEl.clientHeight;
        const hasOverflow = scrollHeight > clientHeight;
        setShouldShowButton(hasOverflow);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mt-4">
      <div
        ref={contentRef}
        className={`transition-all overflow-hidden ${
          expanded ? "max-h-none" : "max-h-[300px]"
        } mb-4`}
      >
        <h2 className="text-xl font-bold mb-2">
          {title}
        </h2>
        <p className="text-gray-700 text-base whitespace-pre-wrap">
          {content}
        </p>
        {image && (
          <img
            src={image}
            alt="post"
            className="mt-3 rounded-lg w-full object-cover"
            onError={(e) => {
              console.error("❌ Image failed to load:", image);
              e.target.style.display = 'none';
            }}
          />
        )}
      </div>
      
      {/* View More Button */}
      {shouldShowButton && !expanded && (
        <div className="text-center mt-2">
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-500 text-sm hover:underline font-medium"
          >
            View more
          </button>
        </div>
      )}

      {/* View Less Button */}
      {expanded && shouldShowButton && (
        <div className="text-center mt-2">
          <button
            onClick={() => setExpanded(false)}
            className="text-blue-500 text-sm hover:underline font-medium"
          >
            View less
          </button>
        </div>
      )}
      
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {tag?.name || tag || ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
