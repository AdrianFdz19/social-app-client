import React, { useEffect, useState } from 'react'
import icons from '../../assets/icons';
import CommentInput from './CommentInput';
import Comment from './Comment';

export default function PostActions({hasLiked, serverUrl, postId, userId, username, userPic, setLikesCount, prevComments, commentsCount}) {

    const [postComment, setPostComment] = useState(false);
    const [isLike, setIsLike] = useState(null);
    const [comments, setComments] = useState(prevComments); // Contexto de los comentarios (lista de comentarios previos)

    // COMMENTS
    const handleCommentClick = () => setPostComment(prev => !prev);

    // LIKES
    useEffect(() => {
        setIsLike(hasLiked);
    }, [hasLiked]);

    const handleLikeClick = async () => {
        try {
            /* console.log('like click', userId); */
            const response = await fetch(`${serverUrl}/posts/post_id/${postId}/${isLike ? 'dislike' : 'like'}?user_id=${userId}`, {
                method: isLike ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok) {
                const data = await response.json();
                const type = data.type;
                setIsLike(prev => !prev);
                if(type) {
                    setLikesCount(prev => prev + 1);
                } else {
                    setLikesCount(prev => prev - 1);
                }
            } else {
                console.error('Server internal error');
            }
        } catch(err) {
            console.error(err);
        }
    }

  return (
    <div className="actions">
        <div className="box">
            <div className="button"
                onClick={handleLikeClick}
            >
                { isLike ? (
                    <>
                    <icons.liked className='icon' id='liked' />
                    <p>liked</p>
                    </>
                ) : (
                    <>
                    <icons.like className='icon' id='like' />
                    <p>like</p>
                    </>
                )}
            </div>
            <div className="button"
                onClick={handleCommentClick}
            >
                <icons.comment className='icon' />
                <p>comment</p>
            </div>
            <div className="button">
                <icons.share className='icon' />
                <p>share</p>
            </div>
            <div className="button">
                <icons.save className='icon' />
                <p>save</p>
            </div>
        </div>
        {
            comments && comments.length > 0 &&
            <div className="post-prev-comments">
                {comments.map((com, i) => (
                    <Comment
                        key={com.id}
                        id={com.id}
                        postId={com.post_id}
                        authorId={com.author_id}
                        authorName={com.author_name}
                        authorPic={com.author_pic}
                        content={com.content}
                        replyTo={com.reply_to_comment_id}
                        level={com.level}
                        isLast={false}
                        updatedAt={com.update_at}
                        serverUrl={serverUrl}
                        userPic={userPic}
                        userId={userId}
                    />
                ))}
            </div>
        }
        {
            postComment &&
            <CommentInput
                postId={postId}
                userId={userId}
                replyTo={0}
                userPic={userPic}
                sizePic={2.5}
                parentIsLast={true}
                serverUrl={serverUrl}
                typeCont='--primary'
                setComments={setComments}
            />
        }
    </div>
)
}
