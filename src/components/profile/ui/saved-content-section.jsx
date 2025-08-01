import { fetchSavedContents } from "../../../slices/profile/user-saved-content-slice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";
import { useState } from "react";

export default function SavedContentSection({ contents, authId }) {
  const dispatch = useDispatch();

  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");
  // Decode token to get authId
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const authid = decoded.authId;
        setCurrentUser(authid);
        dispatch(fetchUserProfile(authid));
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }
  }, [token, dispatch]);

  const { savedContents, loading, error } = useSelector(
    (state) => state.userSavedContent
  );
  const isAuthorized = currentUser === authId;

  useEffect(() => {
    if (contents?.length > 0) {
      dispatch(fetchSavedContents(contents));
    }
  }, [contents]);

  if (!currentUser || !isAuthorized) {
    return (
      <div className="text-red-500 py-4">
        Bạn không có quyền xem nội dung đã lưu của người dùng này.
      </div>
    );
  }

  return loading ? (
    <div className="text-gray-500 py-4">Đang tải nội dung...</div>
  ) : error ? (
    <div className="text-red-500 py-4">{error}</div>
  ) : savedContents.length === 0 ? (
    <div className="text-gray-500 py-4">Bạn chưa lưu nội dung nào.</div>
  ) : (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Nội dung đã lưu</h2>
      <ul className="space-y-4">
        {savedContents.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border"
          >
            <div className="flex items-start gap-4">
              <img
                src={item.user.avatar || "/assets/default-avatar.png"}
                alt={item.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {item.type === "post" ? "Bài viết" : "Câu hỏi"}
                  </span>
                </div>
                <h3 className="text-md font-medium mt-1">
                  {item.type === "post"
                    ? (item.content || "Không có nội dung").slice(0, 80) + "..."
                    : item.title.slice(0, 80)}
                </h3>
                {item.content && item.type === "post" && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.content.slice(0, 100)}...
                  </p>
                )}
                {item.description && item.type === "question" && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description.slice(0, 100)}...
                  </p>
                )}
                <div className="text-sm text-gray-400 mt-2">
                  Đăng bởi: {item.user.name}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
