import React, { useEffect, useState } from 'react'
import './styles/commentbox.scss';
import ProfilePic from '../ProfilePic';
import icons from '../../assets/icons';
import Comment from './Comment';
import { formatTimestamp } from '../../utils/client';
import CommentInput from './CommentInput';

export default function CommentBox({close, serverUrl, postId, userId, username, userPic, prevComments, commentsCount}) {

    const [comments, setComments] = useState([]);
    useEffect(() => {
        if(prevComments.length > 0) {
            setComments(prevComments);
        }
    }, [prevComments]);

    const [comment, setComment] = useState({
        postId,
        authorId: userId || null,
        commentId: null,
        content: '',
    });

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await fetch(`${serverUrl}/posts/add-comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comment),
            });

            if(response.ok) {
                const data = await response.json();
                console.log(data);  
                const comment = data.comment;
                let newComment = {
                    id: comment.comment_id,
                    author_id: comment.author_id,
                    author_name: username,
                    author_pic: userPic,
                    content: comment.content,
                    updated_at: comment.updated_at,
                }
                setComments(prev => ([ newComment ,...prev]));
            } else {
                console.error('Server internal error');
            }

            setComment({
                ...comment, content : '',
            });
        } catch(err) {
            console.error(err);
        }
    }

  return (
    <div className="comment-box">
        {commentsCount > 2 &&
            <p id='seemore' >See more comments</p>
        }
        {comments.length > 0 &&
            <div className="prev-comments">
                {comments.map((prev) => (
                    <Comment
                        key={prev.id}
                        id={prev.id}
                        postId={postId}
                        authorId={prev.author_id}
                        authorName={prev.author_name}
                        authorPic={prev.author_pic}
                        content={prev.content}
                        updatedAt={formatTimestamp(prev.updated_at)}
                        userId={userId}
                        userPic={userPic}
                        serverUrl={serverUrl}
                        level={1}
                    />
                ))}
            </div>
        }

        <CommentInput
            userPic={userPic}
            comment={comment}
            setComment={setComment}
            handleCommentSubmit={handleCommentSubmit}
        />

    </div>
  )
}
