import React, { useEffect, useState } from 'react'
import './styles/postcomment.scss';
import ProfilePic from '../ProfilePic';
import icons from '../../assets/icons';
import PropTypes from 'prop-types'

export default function CommentInput({
    postId,
    userId,
    userPic,
    sizePic,
    replyTo,
    typeCont,
    serverUrl,
    setComments
}) {

    const [commentData, setCommentData] = useState({
        postId: postId,
        authorId: userId,
        replyTo: replyTo,
        content: ''
    });

    const handleSubmitComment = async() => {
        try {
            const response = await fetch(`${serverUrl}/posts/add-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
            if(response.ok) {
                const data = await response.json();
                const newComment = data.comment;
                console.log(newComment);
                setComments(prev => ([...prev, newComment]));
                setCommentData(prev => ({...prev, content: ''}));
            } else {
                console.error('Server internal error');
            }
        } catch(err) {
            console.error(err);
        }
    };

  return (
    <div className={`post-comment-cont ${typeCont}`}>
        <div className="post-comment">
            <div className={`post-comment__avatar ${replyTo == 0 ? '' : 'sec'}`}>
                <ProfilePic
                    size={sizePic}
                    url={userPic}
                />
            </div>

            <div className="textarea-cont">
                <icons.sendArrow
                    className={`sendarrow ${commentData.content ? 'active' : ''}`}
                    onClick={commentData.content ? handleSubmitComment : null}
                />
                <textarea
                    placeholder='Write a comment'
                    value={commentData.content}
                    onChange={(e) => setCommentData(prev => ({...prev, content: e.target.value}))}
                ></textarea>
            </div>
        </div>
    </div>
  )
}

CommentInput.propTypes = {
    postId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    userPic: PropTypes.string.isRequired,
    sizePic: PropTypes.number.isRequired,
    replyTo: PropTypes.number.isRequired,
    typeCont: PropTypes.string.isRequired,
    serverUrl: PropTypes.string.isRequired,
    setComments: PropTypes.func.isRequired
}
