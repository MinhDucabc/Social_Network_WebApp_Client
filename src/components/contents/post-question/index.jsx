import { useState } from 'react'
import Header from '../ui/header.jsx'
import Description from '../ui/description.jsx'
import InteractionField from '../ui/interaction-field.jsx'
import ReplySection from '../ui/reply-section.jsx'

export default function QuestionCard({questionContent, handleToggleFollow, handleToggleVotes, voteChanges, usersByContentId, followedUserIds, currentUserId, replies, onUpdateSubmit, onhandleDelete, handleToggleSaved}) {
  const [toggleCommentSection, setToggleCommentSection] = useState(false)
  const { id, type, title, description, tags, user, group, date} = questionContent;
  const questionInputField = {title, description, tags}
  debugger
  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-4 mt-6">
        {/* Header */}
        <Header user={user} date={date} group={group} handleToggleFollow={handleToggleFollow} 
        followedUserIds={followedUserIds} currentUserId={currentUserId} id={id} content={questionInputField}
         type={type} onhandleSubmit={onUpdateSubmit} onhandleDelete={onhandleDelete}/>
        {/* Content*/}
        <Description {...questionInputField}/>
        {/* Upvote/Downvote & Comment*/}
        <InteractionField
          type={type}
          replies={replies}
          comments={null}
          contentId={id}
          handleToggleVotes={(action, id) => handleToggleVotes(id, action, currentUserId)}
          voteChanges={voteChanges}
          usersByContentId={usersByContentId}
          handleToggleSaved={handleToggleSaved}
          setToggleCommentSection={() => setToggleCommentSection(!toggleCommentSection)}
          currentUserId={currentUserId}
        />
        {/* Reply Section */}
        {toggleCommentSection && <ReplySection questionId={id} replies={replies} />}
      </div>
    </>
  )
}

