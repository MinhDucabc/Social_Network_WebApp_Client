export default function UserIntro({ form, setForm, isEditing, updatedError }) {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Giới thiệu</h2>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full border rounded p-2"
        />

        <h3 className="text-md font-medium mt-3">Liên kết cá nhân:</h3>
        <input
          value={form.personalLink}
          onChange={(e) => setForm({ ...form, personalLink: e.target.value })}
          className="w-full border rounded p-2"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Giới thiệu</h2>
      <p className="text-gray-700">{form.bio || "Chưa có mô tả."}</p>
      <h3 className="text-md font-medium mt-3">Liên kết cá nhân:</h3>
      <ul className="list-disc pl-5 text-blue-600">
        {form.personalLink ? (
          <li>
            <a href={form.personalLink} target="_blank" rel="noreferrer" className="hover:underline">
              {form.personalLink}
            </a>
          </li>
        ) : (
          <li>Chưa có liên kết.</li>
        )}
      </ul>
    </div>
  );
}
