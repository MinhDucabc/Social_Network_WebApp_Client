import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

export default function UserHeader({
  user,
  isEditing,
  setIsEditing,
  form,
  setForm,
  onSave,
  updatedError,
}) {
  const { token } = useSelector((state) => state.auth);
  const [error, setError] = useState(updatedError);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsOwner(decoded.authId === user.authId);
      } catch (err) {
        console.error("Token không hợp lệ");
      }
    }
  }, [token, user.authId]);

  return (
    <div className="border-b pb-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="relative">
            {isEditing ? (
              <label>
                <img
                  src={form.avatar || "../../../assets/default-avatar.png"}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-75"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm((prev) => ({ ...prev, avatar: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            ) : (
              <img
                src={form.avatar || "../../../assets/default-avatar.png"}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>

          {/* Info */}
          <div>
            {isEditing ? (
              <>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="text-xl font-bold border-b outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nhấn vào ảnh để thay đổi
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">{form.name}</h2>
                {error && <p className="text-red-500">{error}</p>}
                <p className="text-sm text-gray-600">
                  Tham gia: {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <div className="text-sm mt-1 text-gray-700">
                  <span className="mr-3">Level: {user.level}</span>
                  <span className="mr-3">
                    Follower: {user.followers.length}
                  </span>
                  <span>Following: {user.following.length}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Nút chỉnh sửa */}
        {isOwner && (
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setError(null);
                }}
                className="text-blue-600"
              >
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button onClick={onSave} className="text-green-600">
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setForm({
                      name: user.name,
                      avatar: user.avatar,
                      bio: user.bio || "",
                      personalLink: user.personalLink?.[0] || "",
                    });
                  }}
                  className="text-gray-500"
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
