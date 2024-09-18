import React from 'react'
import './styles/commentinput.scss'
import ProfilePic from '../ProfilePic'
import icons from '../../assets/icons'

export default function CommentInput({userPic, comment, setComment, handleCommentSubmit, picSize = 2.35}) {
  return (
    <div className="comment-input">
        <ProfilePic
            size={picSize}
            url={userPic}
        />
        <form className="input-cmt" onSubmit={comment.content ? handleCommentSubmit : null} >
            <textarea placeholder='Write something...'
                value={comment.content}
                onChange={(e) => setComment({...comment, content: e.target.value})}
            ></textarea>
            <div className="submit">
                <input type="submit" value="" />
                <icons.sendArrow className={`sendarrow ${comment.content ? 'active' : ''}`}/>
            </div>
        </form>
    </div>
  )
}
