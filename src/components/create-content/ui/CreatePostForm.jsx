import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchTags } from "../../../slices/contents/tags-slice.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase-config.js";

export default function CreatePostForm({ user, group, onSubmit, onClose }) {
  const tags = useSelector((state) => state.tags.items);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [openTitle, setOpenTitle] = useState(false);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  const handleUploadImage = async (file) => {
    try {
      const imageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      console.log("✅ Upload thành công:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("❌ Upload lỗi:", error);
    }
  };

  const [errors, setErrors] = useState({
    content: "",
    tags: "",
  });

  const validatePost = () => {
    if (content.trim() === "") {
      setErrors({
        content: "Nội dung không được để trống",
        tags: "",
      });
      return false;
    }
    if (tagsSelected.length === 0) {
      setErrors({
        content: "",
        tags: "Phải chọn ít nhất một tag",
      });
      return false;
    }
    return true;
  };

  const handlePost = async () => {
    if (!validatePost()) return;

    // let uploadedImageUrl = null;
    // if (image) {
    //   try {
    //     uploadedImageUrl = await handleUploadImage(image);
    //   } catch (error) {
    //     console.error("Lỗi khi upload ảnh:", error);
    //     return;
    //   }
    // }

    onSubmit?.({
      userid: user?.id,
      groupid: group?.id,
      title: title.trim(),
      content: content.trim(),
      tags: tagsSelected,
      image: image ? uploadedImageUrl : null,
    });

    setTitle("");
    setContent("");
    setTagsSelected([]);
    setImage(null);
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
      {/* Avatar + Tên + Nhóm */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={user?.avatar || "../../../assets/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">{user?.name}</span>
          {group && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              {group?.name}
            </span>
          )}
        </div>
      </div>

      {/* Tiêu đề & Nội dung */}
      {openTitle && (
        <input
          type="text"
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      )}
      <textarea
        placeholder="Bạn muốn chia sẻ điều gì?"
        value={content}
        onChange={(e) => {setContent(e.target.value); setErrors({ content: "" });}}
        rows={6}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.content && (
        <p className="text-red-500 text-sm mt-1">{errors.content}</p>
      )}
      <button
        onClick={() => setOpenTitle(!openTitle)}
        className="text-blue-600 hover:text-blue-500"
      >
        {openTitle ? "Đóng Tiêu Đề" : "Thêm Tiêu Đề"}
      </button>

      {/* Ảnh */}
      <div className="mb-4">
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            setImage(file);
            if (file) {
              const imageUrl = await handleUploadImage(file)
              setPreviewUrl(imageUrl);
            } else {
              setPreviewUrl("");
            }
          }}
          className="hidden" // Ẩn input gốc
        />

        <label
          htmlFor="imageUpload"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg cursor-pointer"
        >
          Chọn ảnh
        </label>

        {image && (
          <span className="ml-2 text-sm text-green-700">{image.name}</span>
        )}
      </div>

      {previewUrl && (
        <div className="mb-4">
          <img src={previewUrl} alt="Preview" className="max-h-40 rounded-lg" />
        </div>
      )}

      {/* Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chọn tag
        </label>
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
      {errors.tags && (
        <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
      )}

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
        onClick={handlePost}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-xl w-full"
      >
        Đăng bài viết
      </button>
    </div>
  );
}
