import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchTags } from "../../../slices/contents/tags-slice.js";

export default function AskQuestionForm({ user, group, onSubmit, onClose }) {
  const tags = useSelector((state) => state.tags.items);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsSelected, setTagsSelected] = useState([]);
  const [openDescription, setOpenDescription] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  const [errors, setErrors] = useState({
    title: "",
    tags: "",
  });
  const validateQuestion = () => {
    if (title.trim() === "") {
      setErrors({
        title: "Câu hỏi không được để trống",
        tags: "",
      });
      return false;
    }
    if (tagsSelected.length === 0) {
      setErrors({
        title: "",
        tags: "Phải chọn ít nhất một tag",
      });
      return false;
    }
    return true;
  }

  const handleAsk = () => {
    if (!validateQuestion()) return;

    onSubmit?.({
      userid: user?.id,
      groupid: group?.id,
      title: title.trim(),
      description: description.trim(),
      tags: tagsSelected,
    });

    setTitle("");
    setDescription("");
    setTagsSelected([]);
    onClose?.();
  };

  const handleTagSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !tagsSelected.includes(selectedId)) {
      setTagsSelected([...tagsSelected, selectedId]);
    }
  };

  const removeTag = (id) => {
    setTagsSelected(tagsSelected.filter((tagId) => tagId !== id));
  };

  const getTagName = (id) => tags.find((t) => t.id === id)?.name || "Không rõ";

  return (
    <div>
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={user?.avatar || "../../../assets/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-medium text-gray-700">{user?.name}</span>
      </div>

      <input
        type="text"
        placeholder="Câu hỏi"
        value={title}
        onChange={(e) => {setTitle(e.target.value); setErrors({ title: "" });}}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.title && <p className="text-red-500">{errors.title}</p>}
      <button
        onClick={() => setOpenDescription(!openDescription)}
        className="text-blue-600 hover:text-blue-500"
      >
        {openDescription ? "Đóng Mô Tả Câu Hỏi" : "Mô Tả Câu Hỏi"}
      </button>
      {openDescription && (
        <textarea
        placeholder="Mô tả câu hỏi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" 
      />
      )}
      
      {/* Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Chọn tag</label>
        <select
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value=""
          onChange={(e) => {handleTagSelect(e); setErrors({ tags: "" });}}
        >
          <option value="">-- Chọn tag --</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      {errors.tags && <p className="text-red-500">{errors.tags}</p>}

      {/* Hiển thị tag đã chọn */}
      <div className="flex flex-wrap mt-3 gap-2">
        {tagsSelected.map((id) => (
          <div
            key={id}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-2"
          >
            <span>{getTagName(id)}</span>
            <button
              onClick={() => removeTag(id)}
              className="text-blue-600 hover:text-red-500"
              title="Xóa tag"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAsk}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-xl w-full"
      >
        Gửi câu hỏi
      </button>
    </div>
  );
}
