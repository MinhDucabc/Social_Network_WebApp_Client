import { useState } from 'react'
import Header from '../ui/header.jsx'
import Content from '../ui/content.jsx'
import InteractionField from '../ui/interaction-field.jsx'
import CommentSection from '../ui/comment-section.jsx'

export default function PostCard({postContent, handleToggleFollow, handleToggleVotes, voteChanges, usersByContentId, followedUserIds, currentUserId, comments, onUpdateSubmit, onhandleDelete, handleToggleSaved, flag}) {
  const [toggleCommentSection, setToggleCommentSection] = useState(false)
  const { id, type, title, content, image, tags, date, user, group } = postContent;
  const postInputField = {title, content, image, tags}
  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-4 mt-6">
        {/* Header */}
        <Header 
          user={user} 
          date={date} 
          group={group} 
          handleToggleFollow={handleToggleFollow} 
          followedUserIds={followedUserIds} 
          currentUserId={currentUserId} 
          id={id} 
          content={postInputField}
          type={type} 
          onSubmit={onUpdateSubmit} 
          onhandleDelete={onhandleDelete}
          flag={flag}
        />
        {/* Content*/}
        <Content {...postInputField}/>
        {/* Upvote/Downvote & Comment*/}
        <InteractionField
          type={type}
          comments={comments}
          replies={null}
          contentId={id}
          handleToggleVotes={(action, id) => handleToggleVotes(id, action, currentUserId)}
          voteChanges={voteChanges}
          usersByContentId={usersByContentId}
          handleToggleSaved={handleToggleSaved}
          setToggleCommentSection={() => setToggleCommentSection(!toggleCommentSection)}
          currentUserId={currentUserId}
        />
        {/* comment Section */}
        {toggleCommentSection && <CommentSection postid={id} comments={comments}/>}
      </div>
    </>
  )
}
