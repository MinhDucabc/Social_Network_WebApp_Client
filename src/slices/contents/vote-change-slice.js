import { createSlice } from "@reduxjs/toolkit";

const voteSlice = createSlice({
  name: "votes",
  initialState: {
    voteChanges: {}, // { [postId]: [ { userId, type, time } ] }
  },
  reducers: {
    setVotesFromContents(state, action) {
      const contents = action.payload;
      const voteChanges = {};

      contents.forEach((content) => {
        const contentId = content.id;
        const upvotes = content.upvotedBy || [];
        const downvotes = content.downvotedBy || [];

        const votes = [
          ...upvotes.map((userId) => ({
            userId,
            type: "upvote",
            time: new Date(content.updatedAt).toDateString(),
          })),
          ...downvotes.map((userId) => ({
            userId,
            type: "downvote",
            time: new Date(content.updatedAt).toDateString(),
          })),
        ];

        if (votes.length > 0) {
          voteChanges[contentId] = votes;
        }
      });

      state.voteChanges = voteChanges;
    },

    toggleVote(state, action) {
      const { contentId, userId, actionType } = action.payload;
      const currentVotes = state.voteChanges[contentId] || [];
      const existing = currentVotes.find((v) => v.userId === userId);

      if (!existing) {
        state.voteChanges[contentId] = [
          ...currentVotes,
          { userId, type: actionType, time: new Date().toDateString() },
        ];
      } else if (existing.type === actionType) {
        state.voteChanges[contentId] = currentVotes.filter((v) => v.userId !== userId);
      } else {
        state.voteChanges[contentId] = currentVotes.map((v) =>
          v.userId === userId ? { ...v, type: actionType, time: new Date().toDateString() } : v
        );
      }
    },
  },
});

export const { setVotesFromContents, toggleVote } = voteSlice.actions;
export default voteSlice.reducer;
