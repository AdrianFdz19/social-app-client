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
    replyTo,
    level,
    updatedAt,
    // Props de la aplicación y del usuario local
    serverUrl,
    userPic,
    userId
}) {
    const [replies, setReplies] = useState([]);
    const [repliesCount, setRepliesCount] = useState(0);
    const [showReplies, setShowReplies] = useState(false);

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
                setReplies(data);
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
    const [branchVisible, setBranchVisible] = useState(null);
    const [isReply, setIsReply] = useState(null);

    useEffect(() => {
        if (replyTo) setIsReply(replyTo !== 0);
    }, [replyTo]);

    useEffect(() => {
        if (repliesCount >= 1 || reply) {
            setBranchVisible(true);
        }
    }, [repliesCount, reply]);

    return (
        <div className="comment">
            <div className="comment__content-wrapper">
                <div className="comment__avatar">
                    <ProfilePic
                        size={isReply ? 2 : 2.5}
                        url={authorPic}
                    />
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
                    <p>View {repliesCount} replies</p>
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
                <CommentInput
                    postId={postId}
                    userId={userId}
                    replyTo={id}
                    userPic={userPic}
                    serverUrl={serverUrl}
                    typeCont="primary"
                    setComments={setReplies}
                />
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
