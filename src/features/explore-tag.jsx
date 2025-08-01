// import React, { useState } from "react";
// import TagCard from "../components/explore/tag-card/index.jsx";
// import SearchAndFilter from "../components/ui/search-and-filter.jsx";
// import { tagsDict } from "../data/tag.js";

// export default function ExploreTags() {
//   const [filteredTags, setFilteredTags] = useState([]);
//   const [isFilterActive, setIsFilterActive] = useState(false);
//   const [filters, setFilters] = useState({
//     searchTerm: "",
//     sortValue: "default",
//   });

//   const sortOptions = [
//     { value: "default", label: "Sắp xếp: Mặc định" },
//     { value: "asc", label: "Số Lượng Content ↑" },
//     { value: "desc", label: "Số Lượng Content ↓" },
//   ];

//   const handleApply = ({ searchTerm, sortValue }) => {
//     setFilters({ searchTerm, sortValue });

//     let updatedTags = Object.values(tagsDict);

//     if (searchTerm.trim() !== "") {
//       updatedTags = updatedTags.filter((tag) =>
//         tag.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (sortValue === "asc") {
//       updatedTags.sort((a, b) => a.contentCount - b.contentCount);
//     } else if (sortValue === "desc") {
//       updatedTags.sort((a, b) => b.contentCount - a.contentCount);
//     }

//     setFilteredTags(updatedTags);
//     setIsFilterActive(true);
//   };

//   const handleReset = () => {
//     setFilters({
//       searchTerm: "",
//       sortValue: "default",
//     });
//     setIsFilterActive(false);
//   };

//   const displayedTags = isFilterActive ? filteredTags : Object.values(tagsDict);

//   return (
//     <div className="space-y-4">
//       {/* Bộ lọc + Reset */}
//       <div className="space-y-2">
//         <SearchAndFilter
//           onApply={handleApply}
//           initialSearchTerm={filters.searchTerm}
//           initialFilterValue={null}
//           initialSortValue={filters.sortValue}
//           filterOptions={[]} // Không cần filter
//           sortOptions={sortOptions}
//           placeholder="Tìm tag..."
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

//       {/* Danh sách tag */}
//       <div className="flex flex-wrap gap-3 p-4">
//         {displayedTags.length > 0 ? (
//           displayedTags.map((tag) => (
//             <TagCard key={tag._id} tag={tag} />
//           ))
//         ) : (
//           <p className="text-center text-gray-500 w-full">
//             Không tìm thấy tag nào.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
