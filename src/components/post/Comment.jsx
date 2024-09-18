import React, { useEffect, useState } from 'react'
import './styles/comment.scss';
import ProfilePic from '../ProfilePic';
import CommentInput from './CommentInput';
import { formatTimestamp } from '../../utils/client';

export default function Comment({ postId, id, authorId, authorName, authorPic, content, updatedAt, userId, userPic, serverUrl, level }) {

    const [reply, setReply] = useState(false);
    const [comment, setComment] = useState({
        postId,
        authorId: userId || null,
        commentId: id || null,
        content: '',
    });
    const [comments, setComments] = useState([]);
    const [replyCount, setReplyCount] = useState(0); // Iniciar con 0 en lugar de null

    const handleReplyClick = () => setReply(prev => !prev);

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        try {
            console.log(comment);

            const response = await fetch(`${serverUrl}/posts/add-comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comment)
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Server internal error');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Obtener el número de respuestas del comentario
    useEffect(() => {
        const fetchReplyCommentsCount = async () => {
            try {
                const response = await fetch(`${serverUrl}/posts/comments/${id}/replies/count`);
                if (response.ok) {
                    const data = await response.json();
                    const count = parseInt(data.count, 10); // Asegurar que sea un número
                    setReplyCount(count);
                } else {
                    console.error('Server internal error');
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchReplyCommentsCount();
    }, [id, serverUrl]);

    // Obtener los comentarios
    const handleSeeMoreReplies = async () => {
        try {
            const response = await fetch(`${serverUrl}/posts/comments/${id}/replies`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) { // Asegurarse de que data es un array
                    setComments(data);
                }
            } else {
                console.error('Server internal error');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={`comment ${reply ? 'reply' : ''}`}>
            <div className={`box ${(reply && !replyCount) ? 'reply' : ''}`}>
                <div className="thread-pic">
                    <ProfilePic
                        size={2.35}
                        url={authorPic}
                    />
                    {(replyCount > 0 || reply) && ( // Mejor comparación condicional
                        <div className="th-box">
                            <div className="th"></div>
                        </div>
                    )}
                </div>
                <div className="brief">
                    <div className="content">
                        <p id='name'>{authorName}</p>
                        <p id='content'>{content}</p>
                    </div>
                    <div className="more">
                        <p id='date'>{updatedAt}</p>
                        <p className='action'>Like</p>
                        <p className='action' onClick={handleReplyClick}>Reply</p>
                        <p className='action'>Share</p>
                    </div>
                </div>
            </div>
            {replyCount > 0 && (
                <>
                    {comments.length > 0 ? (
                        <>
                            {comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    id={comment.id}
                                    postId={postId}
                                    authorId={comment.author_id}
                                    authorName={comment.author_name}
                                    authorPic={comment.author_pic}
                                    content={comment.content}
                                    level={comment.level}
                                    updatedAt={formatTimestamp(comment.updated_at)}
                                    userId={userId}
                                    userPic={userPic}
                                    serverUrl={serverUrl}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="see-more-box">
                            <div className="th-cont">
                                <div className="th-bx">
                                    <div className="th-cn"></div>
                                    {reply && <div className="th-sub"></div>}
                                </div>
                            </div>
                            <p onClick={handleSeeMoreReplies}>
                                See {replyCount === 1 ? 'the reply' : `the ${replyCount} replies`}
                            </p>
                        </div>
                    )}
                </>
            )}
            {reply && (
                <div className={`comment-cont-reply`}>
                    <div className="th-cont">
                        <div className="th-bx">
                            <div className="th-cn"></div>
                        </div>
                    </div>
                    <CommentInput
                        userPic={userPic}
                        picSize={1.8}
                        comment={comment}
                        setComment={setComment}
                        handleCommentSubmit={handleSubmitReply}
                    />
                </div>
            )}
        </div>
    )
}
