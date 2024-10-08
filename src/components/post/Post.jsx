import React, { useEffect } from 'react'
import './styles/post.scss'; 
import ProfilePic from '../ProfilePic';
import icons from '../../assets/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppProvider';
import FollowBtn from '../FollowBtn.jsx';
import { formatDistanceToNow } from 'date-fns';
import PostActions from './PostActions.jsx';
import { useState } from 'react';

export default function Post({userId, username, id, authorId, authorName, authorPic, userPic, isAuthorOnline, content, createdAt, updatedAt, likes, isFollowing, serverUrl, setLastFollowActionContext, hasLiked, prevComments, commentsCount, socket}) {

    const {redirect} = useAppContext();

    let timeAgo = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
    timeAgo = timeAgo.replace('about ', '');

    const [likesCount, setLikesCount] = useState(likes || 0);

  return (
    <div className="post-cont" key={id} >
        <div className="post-box">
            {/* <button
                onClick={()=>console.log(typeof likes)}
            >Ver info</button> */}
            <div className="header">
                <div className="box">
                    <div className="author-info">
                        <ProfilePic
                            url={authorPic}
                            size={2.75}
                            handleClick={() => redirect(`/profile?id=${authorId}`)}
                            isOnline={isAuthorOnline}
                        />
                        <div className="post-info">
                            <p id='authorname' >{authorName}</p>
                            <p id='createdat' >{timeAgo}</p>
                        </div>
                    </div>
                    <div className="btns">
                        {userId !== authorId && 
                            <FollowBtn 
                                isFollowing={isFollowing}
                                serverUrl={serverUrl}
                                userId={userId}
                                targetId={authorId}
                                setLastFollowActionContext={setLastFollowActionContext}
                                socket={socket}
                            />
                        }
                    </div>
                </div>
            </div>

            <div className="body">
                <div className="box">
                    <p id='content' >{content}</p>
                </div>
            </div>

            <div className="brief">
                <div className="box">
                    <p>{likesCount} likes</p>
                    <p>{commentsCount} comments</p>
                </div>
            </div>

            <PostActions
                hasLiked={hasLiked}
                serverUrl={serverUrl}
                postId={id}
                userId={userId}
                username={username}
                userPic={userPic}
                setLikesCount={setLikesCount}
                prevComments={prevComments}
                commentsCount={commentsCount}
            />

        </div>
    </div>
  )
}
