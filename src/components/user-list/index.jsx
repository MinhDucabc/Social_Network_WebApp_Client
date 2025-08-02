import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FollowedUserList from "./ui/followedUserList";
import SuggestUsers from "./ui/unfollowedUserList";
import { fetchFollowing } from "../../slices/profile/following-slice";
import { fetchUnfollowedUsers, removeUserFromSuggestions, refreshSuggestions } from "../../slices/profile/user-suggestion-slice";
import { fetchUserProfile } from "../../slices/profile/profile-slice";
import api from "../../api/apiBase";
import { resetFollowing } from "../../slices/profile/following-slice";
import { resetUserSuggestions } from "../../slices/profile/user-suggestion-slice";

export default function UserList({ user }) {
  debugger
  const dispatch = useDispatch();
  const [pendingFollowChange, setPendingFollowChange] = useState(false);
  const [followedUserIds, setFollowedUserIds] = useState([]);

  
  // Lấy danh sách từ store
  const followingList = useSelector((state) => state.following.list);
  const unfollowedList = useSelector((state) => state.userSuggestions.users);

  // Reset states when user is null
  useEffect(() => {
    if (!user) {
      setFollowedUserIds([]);
      setPendingFollowChange(false);
      dispatch(resetFollowing());
      dispatch(resetUserSuggestions());
      return;
    }

    // Only fetch if we have a valid user
    if (user.following) {
      setFollowedUserIds(user.following);
      dispatch(fetchFollowing(user.following));
    }
    if (user.id) {
      dispatch(fetchUnfollowedUsers({ userId: user.id, page: 1 }));
    }

    // Cleanup function
    return () => {
      setFollowedUserIds([]);
      setPendingFollowChange(false);
    };
  }, [user, dispatch]);


  const handleAddFollower = (followedIds, currentUserId) => {
    api
      .post("/contents/update-follow", {
        followedUserIds: followedIds,
        currentUserId,
      })
      .then(() => {
        dispatch(fetchUserProfile(user.authId));
        // Refresh suggestions after follow update
        dispatch(refreshSuggestions());
        dispatch(fetchUnfollowedUsers({ userId: user.id, page: 1 }));
      })
      .catch((err) => {
        console.error("Follow update error:", err);
      });
  };

  useEffect(() => {
    if (!pendingFollowChange) return;
    const timeout = setTimeout(() => {
      handleAddFollower(followedUserIds, user.id);
      setPendingFollowChange(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [pendingFollowChange]);

  const handleToggleFollow = (targetUserId) => {
    setFollowedUserIds((prev) => {
      const isFollowing = prev.includes(targetUserId);
      const newFollowedIds = isFollowing
        ? prev.filter((id) => id !== targetUserId)
        : [...prev, targetUserId];
      
      // Nếu đang follow (thêm vào danh sách follow) thì xóa khỏi suggestUsers
      if (!isFollowing) {
        dispatch(removeUserFromSuggestions(targetUserId));
      }
      
      return newFollowedIds;
    });
    setPendingFollowChange(true);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <FollowedUserList
          users={followingList}
          onToggleFollow={handleToggleFollow}
        />
      </div>
      <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <SuggestUsers
          users={unfollowedList}
          currentUserId={user?.id}
          onToggleFollow={handleToggleFollow}
        />
      </div>
    </div>
  );
}