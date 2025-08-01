import React from "react";

export default function WarningDelete({onDelete, contentId, onClose }) {
  const handleDelete = async () => {
    await onDelete(contentId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-[90%] max-w-sm">
        <h3 className="text-lg font-semibold mb-3 text-red-600">Xác nhận xoá</h3>
        <p className="mb-4">Bạn có chắc chắn muốn xoá nội dung này?</p>
        <div className="flex justify-end space-x-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
            Hủy
          </button>
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={handleDelete}>
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
