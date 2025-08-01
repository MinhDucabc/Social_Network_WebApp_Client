import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchTags } from "../../../slices/contents/tags-slice";

export default function EditQuestionForm({ onSubmit, questionid, content, onClose }) {
    const [title, setTitle] = useState(content.title || "");
    const [description, setDescription] = useState(content.description || "");
    const [tagsSelected, setTagsSelected] = useState(content.tags.map((tag)=> tag.id) || []);
    const tags = useSelector((state) => state.tags.items);
  
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchTags());
    }, []);
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      onSubmit({ id: questionid, updateData: {title, description, tags: tagsSelected }});
      onClose();
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
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md shadow-md w-[90%] max-w-md">
          <h2 className="text-lg font-semibold mb-4">Chỉnh sửa câu hỏi</h2>
          <form onSubmit={handleUpdate} className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Câu hỏi"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Mô tả câu hỏi (nếu có)"
            />
  
            <select
              className="w-full border rounded p-2"
              value=""
              onChange={handleTagSelect}
            >
              <option value="">-- Chọn tag --</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
  
            <div className="flex flex-wrap gap-2">
              {tagsSelected.map((id) => (
                <span
                  key={id}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {getTagName(id)}
                  <button
                    onClick={() => removeTag(id)}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
  
            <div className="flex justify-end space-x-2">
              <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  