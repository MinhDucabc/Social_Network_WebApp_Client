import React, { useState, useEffect } from "react";

export default function SearchAndFilter({
  onApply,
  initialSearchTerm,
  initialFilterValue,
  initialSortValue,
  filterOptions,
  sortOptions, // sortOptions is a function that returns an array of options
  placeholder,
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);
  const [localFilterValue, setLocalFilterValue] = useState(initialFilterValue || "");
  const [localSortValue, setLocalSortValue] = useState(initialSortValue || "");

  const [localSortOptions, setLocalSortOptions] = useState(sortOptions(initialFilterValue || ""));

  const handleSave = () => {
    onApply({
      searchTerm: localSearchTerm,
      filterValue: localFilterValue,
      sortValue: localSortValue,
    });
  };

  useEffect(() => {
    setLocalSortOptions(sortOptions(localFilterValue));
  }, [localFilterValue, sortOptions])

  const shouldShowSearch = initialSearchTerm !== "" && placeholder;
  const shouldShowFilter =
    initialFilterValue !== "" && Array.isArray(filterOptions) && filterOptions.length > 0;
  const shouldShowSort =
    initialSortValue !== "" && Array.isArray(localSortOptions) && localSortOptions.length > 0; 

  return (
    <div className="w-[70%] mx-auto p-4 bg-white rounded-xl shadow">
      {/* Top Row: Search, Filter, Sort */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        {shouldShowSearch && (
          <input
            type="text"
            placeholder={placeholder}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="border p-2 rounded-md flex-1 min-w-[180px]"
          />
        )}

        {shouldShowFilter && (
          <select
            value={localFilterValue}
            onChange={(e) => setLocalFilterValue(e.target.value)}
            className="border p-2 rounded-md flex-1 min-w-[120px]"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {shouldShowSort && (
          <select
            value={localSortValue}
            onChange={(e) => setLocalSortValue(e.target.value)}
            className="border p-2 rounded-md flex-1 min-w-[150px]"
          >
            {localSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
      {/* Save button */}
      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Run filter
        </button>
      </div>
    </div>
  );
}
