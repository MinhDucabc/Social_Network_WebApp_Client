import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnfollowedUsers, incrementPage } from "../../../slices/profile/user-suggestion-slice";

export default function SuggestUsers({ currentUserId, onToggleFollow }) {
  const dispatch = useDispatch();
  const { users, loading, error, page, hasMore } = useSelector((state) => state.userSuggestions);
  const observer = useRef();

  const lastUserRef = useCallback(
    (node) => {
      if (loading) {
        console.log("⏳ Loading, skipping intersection observer");
        return;
      }
      
      if (observer.current) {
        observer.current.disconnect();
        console.log("🔗 Disconnected previous observer");
      }
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("👁️ Last user is visible, incrementing page");
          dispatch(incrementPage());
        } else if (entries[0].isIntersecting && !hasMore) {
          console.log("👁️ Last user is visible but hasMore is false");
        }
      }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '100px' // Start loading 100px before reaching the end
      });
      
      if (node) {
        observer.current.observe(node);
        console.log("🔗 Observing last user element");
      }
    },
    [loading, hasMore, dispatch]
  );

  useEffect(() => {
    if (currentUserId) {
      console.log(`🔄 Fetching users for page ${page}`);
      dispatch(fetchUnfollowedUsers({ userId: currentUserId, page }));
    }
  }, [dispatch, currentUserId, page]);

  // Debug logging
  useEffect(() => {
    console.log(`📊 Current state: ${users.length} users, page ${page}, hasMore: ${hasMore}, loading: ${loading}`);
  }, [users.length, page, hasMore, loading]);

  if (!users || users.length === 0) return null;

  return (
    <div className="space-y-3 h-[500px] overflow-y-auto pr-2">
      <div className="sticky top-0 bg-gray-50 z-10 pb-2 border-b">
        <h3 className="text-lg font-bold">Gợi ý theo dõi</h3>
      </div>
      <div className="space-y-3">
        {users.map((user, index) => {
          const isLast = index === users.length - 1;
          return (
            <div
              key={user.id}
              ref={isLast ? lastUserRef : null}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
            >
              <div
                className="flex items-center space-x-3 cursor-pointer mb-2"
                onClick={() => (window.location.href = `/profile/${user.authId}`)}
              >
                <img
                  src={user.avatar || '/assets/default-avatar.png'}
                  className="w-10 h-10 rounded-full"
                  alt={user.name}
                  onError={(e) => {
                    e.target.src = "/assets/default-avatar.png";
                  }}
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">Level {user.level}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn chặn event bubbling
                  if (!currentUserId) return window.location.href = "/login";
                  onToggleFollow(user.id);
                }}
                className="w-full px-3 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Theo dõi
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Đang tải thêm...</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {/* No more users message */}
      {!hasMore && users.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400">Không còn người dùng nào.</p>
        </div>
      )}
      
    </div>
  );
}
