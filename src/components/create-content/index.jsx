import React, { useState } from 'react';
import ContentCreateTrigger from "./ui/ContentCreateTrigger.jsx";
import CreatePopup from "./ui/CreatePopup.jsx";
import { useNavigate } from "react-router-dom"; // 👈 Thêm vào

export default function CreateContent({ group, user, onQuestionSubmit, onPostSubmit }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate(); // 👈 Sử dụng navigate

  // 👉 Hàm xử lý click tạo nội dung
  const handleOpen = () => {
    if (!user) {
      navigate('/login'); // 👈 Điều hướng nếu chưa đăng nhập
    } else {
      setIsPopupOpen(true); // 👈 Mở popup nếu đã đăng nhập
    }
  };

  return (
    <main className="p-6">
      <ContentCreateTrigger
        user={user}
        group={group}
        onOpen={handleOpen} // 👈 Dùng hàm xử lý
      />

      <CreatePopup
        user={user}
        group={group}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onQuestionSubmit={onQuestionSubmit}
        onPostSubmit={onPostSubmit}
      />
    </main>
  );
}
