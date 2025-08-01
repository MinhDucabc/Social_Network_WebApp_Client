import { configureStore } from '@reduxjs/toolkit';
import contentsReducer from './slices/contents/contents-slice.js';
import authReducer from './slices/auth/auth-slice.js';
import newContentReducer from './slices/contents/add-content-slice.js';
import followersReducer from './slices/profile/followers-slice.js';
import followingReducer from './slices/profile/following-slice.js';
import userContentReducer from './slices/profile/user-content-slice.js';
import userSavedContentReducer from './slices/profile/user-saved-content-slice.js';
import profileReducer from './slices/profile/profile-slice.js';
import voteReducer from './slices/contents/vote-change-slice.js';
import commentsReducer from './slices/contents/comments-slice.js';
import repliesReducer from './slices/contents/replies-slice.js';
import tagsReducer from './slices/contents/tags-slice.js';
import savedContentUsersReducer from './slices/contents/saved-content-users.js';
import userSuggestionsReducer from './slices/profile/user-suggestion-slice.js';
import contentDetailReducer from './slices/contents/content-detail-slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contents: contentsReducer,
    newContent: newContentReducer,
    followers: followersReducer,
    following: followingReducer,
    userContent: userContentReducer,
    profile: profileReducer,
    votes: voteReducer,
    comments: commentsReducer,
    replies: repliesReducer,
    tags: tagsReducer,
    userSavedContent: userSavedContentReducer,
    savedContentUsers: savedContentUsersReducer,
    userSuggestions: userSuggestionsReducer,
    contentDetail: contentDetailReducer,
  }
});