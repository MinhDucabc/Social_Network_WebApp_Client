import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserContents } from "../../../slices/profile/user-content-slice.js";
import { useNavigate } from "react-router-dom";

export default function ProfileContentSection({ contents }) {
  console.log(contents);
  const [view, setView] = useState("post");
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.userContent);

  const navigate = useNavigate();

  useEffect(() => {
    if (contents?.length > 0) {
      dispatch(fetchUserContents(contents));
    }
  }, [contents]);

  const handleContentClick = (id) => {
    navigate(`/content/${id}`);
  };

  const filteredList = list?.filter((item) => item.type === view) || [];

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-40 pr-4 border-b md:border-b-0 md:border-r mb-4 md:mb-0">
        <SidebarButton label="Post" view={view} setView={setView} />
        <SidebarButton label="Question" view={view} setView={setView} />
      </div>

      {/* Content List */}
      <div className="flex-1 pl-0 md:pl-4">
        {loading ? (
          <p className="text-gray-500 py-4">Đang tải nội dung...</p>
        ) : error ? (
          <p className="text-red-500 py-4">{error}</p>
        ) : filteredList.length === 0 ? (
          <p className="text-gray-500 py-4">Không có nội dung nào.</p>
        ) : (
          <ul className="space-y-4">
            {filteredList.map((item) => (
              <li
                key={item.id}
                className="p-4 border rounded-xl shadow-sm hover:shadow-md transition duration-200 bg-white"
              >
                <div className="flex gap-4">
                  {/* Avatar bên trái */}
                  <img
                    src={item.user.avatar || "/assets/default-avatar.png"}
                    alt={item.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; // tránh lặp vô hạn nếu ảnh mặc định cũng lỗi
                      e.target.src = "/assets/default-avatar.png";
                    }}
                  />

                  {/* Nội dung bên phải */}
                  <div
                    className="flex-1"
                    onClick={() => handleNavigate(item.id)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500 capitalize">
                        {item.type === "post" ? "Bài viết" : "Câu hỏi"}
                      </span>
                      {item.group && (
                        <span className="text-xs text-gray-400 italic">
                          Nhóm: {item.group.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                      {item.type === "post"
                        ? (item.content || "Không có nội dung").slice(0, 80) +
                          "..."
                        : (item.title || "Không có tiêu đề").slice(0, 80)}
                    </h3>

                    {/* Chỉ hiển thị description nếu là question */}
                    {item.type === "question" && item.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description.slice(0, 100)}...
                      </p>
                    )}

                    {/* Chỉ hiển thị content nếu là post */}
                    {item.type === "post" && item.content && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.content.slice(0, 100)}...
                      </p>
                    )}

                    {item.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SidebarButton({ label, view, setView }) {
  const key = label.toLowerCase();
  const isActive = view === key;

  return (
    <button
      onClick={() => setView(key)}
      className={`block w-full text-left p-2 rounded ${
        isActive
          ? "bg-blue-100 text-blue-700 font-medium"
          : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
