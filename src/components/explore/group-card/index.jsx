export default function GroupCard({ group }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
      <img
        src={group.avatarUrl}
        alt={group.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{group.description}</p>
        <span className="text-xs text-gray-400">{group.memberCount} thành viên</span>
      </div>
    </div>
  );
}