import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/contents/post-card";
import QuestionCard from "../components/contents/post-question";
import CreateContent from "../components/create-content";
import SearchAndFilter from "../components/ui/search-and-filter.jsx";
import { fetchUserProfile } from "../slices/profile/profile-slice";
import {
  fetchRandomContents,
  setFilters,
  clearFilters,
  updateContentVotes,
  updateContent,
  deleteContent
} from "../slices/contents/contents-slice.js";

import {
  addNewContent,
  clearNewContent,
  updateNewContentVotes,
  updateNewContent
} from "../slices/contents/add-content-slice";

import { fetchSavedContentUsers, toggleSaveContent } from "../slices/contents/saved-content-users.js";
import {
  setVotesFromContents,
  toggleVote,
} from "../slices/contents/vote-change-slice.js";

import { fetchCommentsByPostIds } from "../slices/contents/comments-slice.js";
import { fetchRepliesByQuestionIds } from "../slices/contents/replies-slice.js";

import api from "../api/apiBase";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function ContentFeed() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [authId, setAuthId] = useState(null);
  const [followedUserIds, setFollowedUserIds] = useState([]);
  const [pendingFollowChange, setPendingFollowChange] = useState(false);

  const { contents, loading, error, filters } = useSelector(
    (state) => state.contents
  );
  const { newContents, newContentLoading, newContentError } = useSelector(
    (state) => state.newContent
  );

  const usersByContentId = useSelector((state) => state.savedContentUsers.usersByContentId);

  const [isFilterActive, setIsFilterActive] = useState(false);

  const voteChanges = useSelector((state) => state.votes.voteChanges);
  const [pendingVoteChange, setPendingVoteChange] = useState(false);

  const comments = useSelector((state) => state.comments.data);
  const replies = useSelector((state) => state.replies.data);

  useEffect(() => {
    if (contents && contents.length > 0) {
      dispatch(fetchSavedContentUsers(contents.map(c => c.id)));
    }
  }, [contents]);

  useEffect(() => {
    if (newContents && newContents.length > 0) {
      dispatch(fetchSavedContentUsers(newContents.map(c => c.id)));
    }
  }, [newContents]);

  useEffect(() => {
    if (contents && contents.length > 0) {
      dispatch(setVotesFromContents(contents));
    }
    if (contents.length > 0) {
      const postIds = contents
        .filter((c) => c.type === "post")
        .map((c) => c.id);
      const questionIds = contents
        .filter((c) => c.type === "question")
        .map((c) => c.id);

      dispatch(fetchCommentsByPostIds(postIds));
      dispatch(fetchRepliesByQuestionIds(questionIds));
    }
  }, [contents]);

  useEffect(() => {
    if (newContents && newContents.length > 0) {
      dispatch(setVotesFromContents(newContents));
    }
    if (newContents.length > 0) {
      const postIds = newContents
        .filter((c) => c.type === "post")
        .map((c) => c.id);
      const questionIds = newContents
        .filter((c) => c.type === "question")
        .map((c) => c.id);

      dispatch(fetchCommentsByPostIds(postIds));
      dispatch(fetchRepliesByQuestionIds(questionIds));
    }
  }, [newContents]);

  // Decode token to get authId
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.authId;
        setAuthId(id);
        dispatch(fetchUserProfile(id));
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }
  }, [token, dispatch]);

  // Sync followed users
  useEffect(() => {
    if (user?.following) {
      setFollowedUserIds(user.following);
    }
  }, [user]);

  const hasMountedRef = useRef(false);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMountedRef.current) {
      handleReset();
    }
    hasMountedRef.current = true;
  }, [dispatch]);

  const handleReset = () => {
    setIsFilterActive(false);
    dispatch(clearFilters());
    dispatch(clearNewContent());
    dispatch(
      fetchRandomContents({
        excludeIds: [],
        type: "all",
        searchTerm: "",
        sortValue: "",
      })
    );
  };

  const handleApply = ({ searchTerm, filterValue, sortValue }) => {
    setIsFilterActive(true);
    dispatch(setFilters({ type: filterValue, searchTerm, sortValue }));
    dispatch(
      fetchRandomContents({
        type: filterValue,
        searchTerm,
        sortValue,
        excludeIds: [],
      })
    );
  };

  const currentUserId = user?.id || null;

  const handleAddContent = (newContent) => {
    dispatch(
      addNewContent({
        ...newContent,
        userid: currentUserId,
      })
    );
  };

  const onUpdateSubmit = (updatedContent) => {
    const { id, updateData } = updatedContent;
    
    // Check if this is a new content (in newContents array)
    const isNewContent = newContents.some(item => item.id === id);
    
    if (isNewContent) {
      // For new content, update it in the newContents array
      dispatch({
        type: 'newContent/updateNewContent',
        payload: { id, updateData }
      });
    } else {
      // For existing content, use the updateContent action
      dispatch(updateContent({ id, updateData }));
    }
  };

  const handleDeleteContent = (contentId) => {
    dispatch(deleteContent(contentId));
  };


  const handleToggleFollow = (targetUserId) => {
    if (!currentUserId) navigate("/login");

    setFollowedUserIds((prev) => {
      const isFollowing = prev.includes(targetUserId);
      return isFollowing
        ? prev.filter((id) => id !== targetUserId)
        : [...prev, targetUserId];
    });
    setPendingFollowChange(true);
  };


  const handleAddFollower = (followedIds, currentUserId) => {
    api
      .post("/contents/update-follow", {
        followedUserIds: followedIds,
        currentUserId,
      })
      .then(() => {
        dispatch(fetchUserProfile(authId));
      })
      .catch((err) => {
        console.error("Follow update error:", err);
      });
  };

  
  useEffect(() => {
    if (!pendingFollowChange) return;

    const timeout = setTimeout(() => {
      handleAddFollower(followedUserIds, currentUserId);
      setPendingFollowChange(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [followedUserIds, pendingFollowChange]);

  const handleToggleVotes = (contentId, action) => {
    if (!currentUserId) navigate("/login");

    dispatch(toggleVote({ contentId, userId: currentUserId, actionType: action }));
    setPendingVoteChange(true);
  };

  const handleToggleSaved = (contentId, userId) => {
    debugger
    if (!currentUserId) navigate("/login"); 
    dispatch(toggleSaveContent({contentId, userId}));
  };

  const handleUpdateVotes = () => {
    const voteRequests = [];
    const votedContentIds = [];
    Object.entries(voteChanges).forEach(([contentId, votes]) => {
      if (votes.length === 0) {
        voteRequests.push(
          api.post("/contents/update-vote", {
            contentId: contentId,
            userId: currentUserId,
            action: "unvote",
          })
        );
      } else {
        votes.forEach(({ userId, type }) => {
          voteRequests.push(
            api.post("/contents/update-vote", {
              contentId: contentId,
              userId,
              action: type,
            })
          );
        });
      }
    });
    Promise.all(voteRequests)
      .then(() => {
        // Fetch lại các content bị vote
        const contentIds = votedContentIds;
        const result = api.post("/contents/get-by-ids", { ids: contentIds });
        return result;
      })
      .then((res) => {
        const updatedContents = res.data.contents;
        dispatch(updateContentVotes({ updatedContents }));
        dispatch(updateNewContentVotes({ updatedContents }));
      })
      .catch((err) => console.error("Vote update error:", err))
      .finally(() => {
        setPendingVoteChange(false);
      });
  };

  // Updatevote
  useEffect(() => {
    if (!pendingVoteChange) return;
    const timeout = setTimeout(() => {
      handleUpdateVotes();
    }, 300);

    return () => clearTimeout(timeout);
  }, [pendingVoteChange, voteChanges]);

  // 


  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Post", value: "post" },
    { label: "Question", value: "question" },
  ];

  const sortOptions = (type) => {
    switch (type) {
      case "question":
        return [
          { label: "Newest", value: "newest" },
          { label: "Most vote", value: "highest" },
          { label: "Most reply", value: "most-reply" },
        ];
      case "post":
        return [
          { label: "Newest", value: "newest" },
          { label: "Most vote", value: "highest" },
          { label: "Most comment", value: "most-comment" },
        ];
      default:
        return [
          { label: "Newest", value: "newest" },
          { label: "Most vote", value: "highest" },
        ];
    }
  };

  return (
    <>
      <CreateContent
        onQuestionSubmit={(newQuestion) =>
          handleAddContent({
            ...newQuestion,
            type: "question",
          })
        }
        onPostSubmit={(newPost) =>
          handleAddContent({
            ...newPost,
            type: "post",
          })
        }
        user={user}
        group={null}
      />
      <SearchAndFilter
        onApply={handleApply}
        initialSearchTerm={filters.searchTerm}
        initialFilterValue={filters.type}
        initialSortValue={filters.sortValue}
        filterOptions={filterOptions}
        sortOptions={(type) => sortOptions(type)}
        placeholder="Tìm content..."
      />
      {isFilterActive && (
        <button
          onClick={handleReset}
          className="self-end text-sm text-blue-600 hover:underline"
        >
          Reset filter
        </button>
      )}

      {newContentLoading && (
        <p className="text-center text-gray-500">Loading new content...</p>
      )}
      {newContentError && (
        <p className="text-center text-red-500">
          Error loading new content: {newContentError}
        </p>
      )}
      {newContents.map((item) =>
        item.type === "post" ? (
          <PostCard
            key={item.id}
            postContent={item}
            handleToggleFollow={handleToggleFollow}
            followedUserIds={followedUserIds}
            handleToggleVotes={handleToggleVotes}
            voteChanges={voteChanges}
            usersByContentId={usersByContentId}
            comments={comments?.[item.id] ? comments[item.id] : []}
            currentUserId={currentUserId}
            handleToggleSaved={handleToggleSaved}
            onUpdateSubmit={onUpdateSubmit}
            onhandleDelete={handleDeleteContent}
            flag={true}
          />
        ) : (
          <QuestionCard
            key={item.id}
            questionContent={item}
            handleToggleFollow={handleToggleFollow}
            followedUserIds={followedUserIds}
            handleToggleVotes={handleToggleVotes}
            voteChanges={voteChanges}
            usersByContentId={usersByContentId}
            replies={replies?.[item.id] ? replies[item.id] : []}
            currentUserId={currentUserId}
            handleToggleSaved={handleToggleSaved}
            onUpdateSubmit={onUpdateSubmit}
            onhandleDelete={handleDeleteContent}
            flag={true}
          />
        )
      )}
      <hr />
      {loading && (
        <p className="text-center text-gray-500">Loading contents...</p>
      )}
      {error && (
        <p className="text-center text-red-500">Error loading contents: {error}</p>
      )}
      {contents.map((item, index) => { return (
        <div key={item.id}>
          {item.type === "post" ? (
            <PostCard
              key={item.id}
              postContent={item}
              handleToggleFollow={handleToggleFollow}
              followedUserIds={followedUserIds}
              handleToggleVotes={handleToggleVotes}
              voteChanges={voteChanges}
              usersByContentId={usersByContentId}
              comments={comments?.[item.id] ? comments[item.id] : []}
              currentUserId={currentUserId}
              onUpdateSubmit={onUpdateSubmit}
              onhandleDelete={handleDeleteContent}
              handleToggleSaved={handleToggleSaved}
              flag={false}
            />
          ) : (
            <QuestionCard
              key={item.id}
              questionContent={item}
              handleToggleFollow={handleToggleFollow}
              followedUserIds={followedUserIds}
              handleToggleVotes={handleToggleVotes}
              voteChanges={voteChanges}
              usersByContentId={usersByContentId}
              replies={replies?.[item.id] ? replies[item.id] : []}
              currentUserId={currentUserId}
              onUpdateSubmit={onUpdateSubmit}
              onhandleDelete={handleDeleteContent}
              handleToggleSaved={handleToggleSaved}
              flag={false}
            />
          )}

          {(index + 1) % 10 === 0 && index === contents.length - 1 && (
            <div className="text-center my-4">
              <button
                onClick={() => {
                  dispatch(
                    fetchRandomContents({
                      excludeIds: [
                        ...contents.map((item) => item.id),
                        ...newContents.map((item) => item.id),
                      ],
                      type: filters.type,
                      searchTerm: filters.searchTerm,
                      sortValue: filters.sortValue,
                    })
                  );
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )})}

      {contents.length === 0 && (
        <p className="text-center text-gray-500">No contents found.</p>
      )}
    </>
  );
}
