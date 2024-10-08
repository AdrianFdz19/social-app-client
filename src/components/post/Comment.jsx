import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from '../ProfilePic';
import './styles/comment.scss';
import CommentInput from './CommentInput';

export default function Comment({
    // Props del comentario
    id,
    postId,
    authorId,
    authorName,
    authorPic,
    content,
    replyTo, // Id del comentario al que se esta respondiendo
    level, // Nivel de comentario o su rama
    updatedAt,
    isLast = true,
    // Props de la aplicación y del usuario local
    serverUrl,
    userPic,
    userId
}) {
    const [replies, setReplies] = useState([]);
    const [repliesCount, setRepliesCount] = useState(0);
    const [showReplies, setShowReplies] = useState(false);
    const [branch, setBranch] = useState(false);
    // Fetch de la cantidad de respuestas
    useEffect(() => {
        const fetchRepliesCount = async () => {
            try {
                const response = await fetch(`${serverUrl}/posts/comments/${id}/replies/count`);
                if (response.ok) {
                    const data = await response.json();
                    setRepliesCount(Number(data.count));
                } else {
                    console.error('Server internal error');
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchRepliesCount();
    }, [id, serverUrl]);

    // Fetch de la lista de respuestas
    async function fetchReplies() {
        try {
            const response = await fetch(`${serverUrl}/posts/comments/${id}/replies`);
            if (response.ok) {
                const data = await response.json();
                const lastId = data.length - 1;
    
                let list = data.map((reply, i) => ({
                    ...reply,
                    isLast: i === lastId
                }));
    
                setReplies(list);
                setShowReplies(true);
            } else {
                console.error('Server internal error');
            }
        } catch (err) {
            console.error(err);
        }
    }    

    const [reply, setReply] = useState(false);
    const toggleReplyInput = () => setReply(prev => !prev);

    // Características del comentario
    const [isReply, setIsReply] = useState(null);

    useEffect(() => {
        if (replyTo) setIsReply(replyTo !== 0);
    }, [replyTo]);

    useEffect(() => {
        if( repliesCount > 0 || reply ) {
            setBranch(true);
        }
    }, [repliesCount, reply]);

    let levelStyle;
    switch(level) {
        case 1:
            levelStyle = ''
            break;
        case 2:
            levelStyle = 'sec'
            break;
        case 3:
            levelStyle = 'thi'
            break;
        default:
            levelStyle = 'thi'
            break;
    }

    const handleDebug = () => {
        console.log(isParentLast);
    }

    return (
        <div className="comment">
            <button onClick={handleDebug} >debug button</button>
            <div className="comment__content-wrapper">
                <div className={`branch ${levelStyle}`}>
                    <div className={`branch__to ${levelStyle}`}></div>
                    { !isLast &&
                    <div className={`branch__parent ${levelStyle}`}></div>
                    }
                </div>
                <div className={`comment__avatar ${level > 1 ? 'sec' : ''}`}>
                    <ProfilePic
                        size={isReply ? 2 : 2.4}
                        url={authorPic}
                    />
                    { branch &&
                    <div className={`branch-main ${levelStyle}`}>
                    </div>
                    }
                </div>
                <div className="comment__text-section">
                    <div className="comment__text">
                        <p className="comment__author">{authorName}</p>
                        <p className="comment__content">{content}</p>
                    </div>
                    <div className="comment__actions">
                        <p className="comment__action">Like</p>
                        <p className="comment__action comment__reply" onClick={toggleReplyInput}>Reply</p>
                    </div>
                </div>
            </div>

            {/* Mostrar "ver respuestas" solo si hay respuestas y no se han mostrado */}
            {repliesCount > 0 && !showReplies && (
                <div className="comment__view-replies" onClick={fetchReplies}>
                    <div className={`branch ${levelStyle}`}>
                        <div className={`branch__to ${levelStyle}`}></div>
                        
                    </div>
                    <div className="view-rep-txt">
                        <p>View {repliesCount} replies</p>  
                    </div>
                </div>
            )}

            {/* Mostrar respuestas si ya se han obtenido */}
            {showReplies && replies.length > 0 && (
                <div className="comment__replies">
                    {replies.map(reply => (
                        <Comment
                            key={reply.id}
                            id={reply.id}
                            postId={postId}
                            authorId={reply.author_id}
                            authorName={reply.author_name}
                            authorPic={reply.author_pic}
                            content={reply.content}
                            replyTo={reply.reply_to_comment_id}
                            level={reply.level}
                            isLast={reply.isLast}
                            updatedAt={reply.update_at}
                            serverUrl={serverUrl}
                            userPic={userPic}
                            userId={userId}
                        />
                    ))}
                </div>
            )}

            {/* Mostrar input para respuesta */}
            {reply && (
                <div className="comment__replyinp">
                    <div className={`branch ${levelStyle}`}>
                    </div>
                    <CommentInput
                        postId={postId}
                        userId={userId}
                        replyTo={id}
                        userPic={userPic}
                        sizePic={2}
                        serverUrl={serverUrl}
                        typeCont="primary"
                        setComments={setReplies}
                    />
                </div>
            )}
        </div>
    );
}

Comment.propTypes = {
    id: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    authorId: PropTypes.number.isRequired,
    authorName: PropTypes.string.isRequired,
    authorPic: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
};
