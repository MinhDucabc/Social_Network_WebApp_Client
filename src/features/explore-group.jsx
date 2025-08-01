// import React, { useState } from "react";
// import GroupCard from "../components/explore/group-card/index.jsx";
// import { groupsDict } from "../data/group.js";
// import SearchAndFilter from "../components/ui/search-and-filter.jsx";

// export default function ExploreGroup() {
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const [isFilterActive, setIsFilterActive] = useState(false);
//   const [filters, setFilters] = useState({
//     searchTerm: "",
//     sortValue: "default",
//   });

//   const sortOptions = [
//     { value: "default", label: "Sắp xếp: Mặc định" },
//     { value: "asc", label: "Thành viên ↑" },
//     { value: "desc", label: "Thành viên ↓" },
//     { value: "name_asc", label: "Tên A-Z" },
//     { value: "name_desc", label: "Tên Z-A" },
//   ];

//   const handleApply = ({ searchTerm, sortValue }) => {
//     setFilters({ searchTerm, sortValue });

//     let updatedGroups = Object.values(groupsDict);

//     // Filter by name
//     if (searchTerm.trim() !== "") {
//       updatedGroups = updatedGroups.filter((group) =>
//         group.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Sort
//     if (sortValue === "asc") {
//       updatedGroups.sort((a, b) => a.memberCount - b.memberCount);
//     } else if (sortValue === "desc") {
//       updatedGroups.sort((a, b) => b.memberCount - a.memberCount);
//     } else if (sortValue === "name_asc") {
//       updatedGroups.sort((a, b) => a.name.localeCompare(b.name));
//     } else if (sortValue === "name_desc") {
//       updatedGroups.sort((a, b) => b.name.localeCompare(a.name));
//     }

//     setFilteredGroups(updatedGroups);
//     setIsFilterActive(true);
//   };

//   const handleReset = () => {
//     setFilters({
//       searchTerm: "",
//       sortValue: "default",
//     });
//     setIsFilterActive(false);
//   };

//   const displayedGroups = isFilterActive ? filteredGroups : Object.values(groupsDict);

//   return (
//     <div className="space-y-4">
//       {/* Tìm kiếm và lọc */}
//       <div className="space-y-2">
//         <SearchAndFilter
//           onApply={handleApply}
//           initialSearchTerm={filters.searchTerm}
//           initialFilterValue={null}
//           initialSortValue={filters.sortValue}
//           filterOptions={[]} // No filter needed in this case
//           sortOptions={sortOptions}
//           placeholder="Tìm nhóm..."
//         />
//         {isFilterActive && (
//           <div className="text-right">
//             <button
//               onClick={handleReset}
//               className="text-sm text-blue-600 hover:underline"
//             >
//               Đặt lại bộ lọc
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Danh sách nhóm */}
//       {displayedGroups.length > 0 ? (
//         displayedGroups.map((group) => (
//           <GroupCard key={group._id} group={group} />
//         ))
//       ) : (
//         <p className="text-center text-gray-500">Không tìm thấy nhóm nào.</p>
//       )}
//     </div>
//   );
// }
