import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../../slices/profile/profile-slice";
import { useEffect, useState } from "react";
import UserHeader from "./ui/user-header";
import UserIntro from "./ui/user-intro";
import FollowSection from "./ui/follow-section";
import ContentSection from "./ui/content-section";
import SavedContentSection from "./ui/saved-content-section";

export default function Profile({ authId }) {
  const dispatch = useDispatch();
  const { user, loading, error} = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("intro");
  const [updatedError, setUpdatedError] = useState(null);

  // ✅ Quản lý edit tại đây để truyền xuống các component con
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    avatar: "",
    bio: "",
    personalLink: "",
  });

  useEffect(() => {
    if (!authId) return;
    dispatch(fetchUserProfile(authId));
  }, [dispatch, authId]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        avatar: user.avatar,
        bio: user.bio || "",
        personalLink: user.personalLink?.[0] || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile({
        userId: user.id,
        profileData: {
          ...form,
          personalLink: [form.personalLink],
        },
      })).unwrap();
      setIsEditing(false);
    } catch (err) {
      setUpdatedError(err.message || "Lỗi khi cập nhật profile");
    }
  };

  if (loading) return <div>Đang tải profile...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <UserHeader
        user={user}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        updatedError={updatedError}
      />
      <div className="flex space-x-4 border-b pb-2 text-sm">
        <TabButton label="Giới thiệu" activeTab={activeTab} tabKey="intro" setActiveTab={setActiveTab} />
        <TabButton label="Follower" activeTab={activeTab} tabKey="follow" setActiveTab={setActiveTab} />
        <TabButton label="Nội dung" activeTab={activeTab} tabKey="content" setActiveTab={setActiveTab} />
        <TabButton label="Lưu" activeTab={activeTab} tabKey="saved" setActiveTab={setActiveTab} />
      </div>

      {activeTab === "intro" && (
        <UserIntro
          form={form}
          setForm={setForm}
          isEditing={isEditing}
        />
      )}
      {activeTab === "follow" && <FollowSection user={user} />}
      {activeTab === "content" && <ContentSection contents={user.contents} />}
      {activeTab === "saved" && <SavedContentSection contents={user.savedContents} />}
    </div>
  );
}

function TabButton({ label, tabKey, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`pb-1 border-b-2 ${
        activeTab === tabKey
          ? "border-blue-600 text-blue-600 font-semibold"
          : "border-transparent text-gray-500 hover:text-blue-500"
      }`}
    >
      {label}
    </button>
  );
}
