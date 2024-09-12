import React from 'react'
import './styles/post.scss'; 
import ProfilePic from '../ProfilePic';
import icons from '../../assets/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppProvider';
import FollowBtn from '../FollowBtn.jsx';
import { formatDistanceToNow } from 'date-fns';
import PostActions from './PostActions.jsx';

export default function Post({userId, id, authorId, authorName, authorPic, isAuthorOnline, content, createdAt, updatedAt, likes, isFollowing, serverUrl, setLastFollowActionContext, hasLiked}) {

    const {redirect} = useAppContext();

    let timeAgo = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
    timeAgo = timeAgo.replace('about ', '');

  return (
    <div className="post-cont" key={id} >
        <div className="post-box">

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
                    <p>0 likes</p>
                    <p>0 comments</p>
                </div>
            </div>

            <PostActions
                hasLiked={hasLiked}
                serverUrl={serverUrl}
                postId={id}
            />

        </div>
    </div>
  )
}
