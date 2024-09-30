import React, { useEffect, useState } from 'react'
import icons from '../../assets/icons';
import CommentBox from './CommentBox';

export default function PostActions({hasLiked, serverUrl, postId, userId, username, userPic, setLikesCount, prevComments, commentsCount}) {

    const [commentBox, setCommentBox] = useState(false);
    const [isLike, setIsLike] = useState(null);

    // COMMENTS
    const handleCommentClick = () => setCommentBox(prev => !prev);

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
            (prevComments && prevComments.length > 0 || commentBox) &&
            <CommentBox
                close={handleCommentClick}
                serverUrl={serverUrl}
                postId={postId}
                userId={userId}
                username={username}
                userPic={userPic}
                prevComments={prevComments}
                commentsCount={commentsCount}
            />
        }
    </div>
)
}
