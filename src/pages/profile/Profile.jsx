import React, { useEffect, useState } from 'react'
import './styles/profile.scss';
import { useLocation } from 'react-router-dom';
import ProfilePic from '../../components/ProfilePic';
import { useAppContext } from '../../context/AppProvider';
import SendMessage from '../../components/SendMessage';
import FollowBtn from '../../components/FollowBtn';
import Post from '../../components/post/Post';
import CreatePost from '../home/CreatePost';

export default function Profile() {

    const {user, serverUrl} = useAppContext();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const [profileInfo, setProfileInfo] = useState({
        id: null,
        email: '',
        username: '',
        isFollowing: null,
        imgs: {
            profilePic: '',
            bannerImg: ''
        },
    });
    const [posts, setPosts] = useState([]);
    const [feedLastFollowAction, setFeedLastFollowAction] = useState({
        targetId: null,
        follow: null
    });

    useEffect(() => {
        const { targetId, follow } = feedLastFollowAction;
      
        if (targetId) {
            console.log('se detecto un cambio', feedLastFollowAction);
          // Actualizar los posts con el author_id correspondiente al targetId
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.author_id == targetId
                ? { ...post, is_following: follow } // Actualizar la propiedad is_following
                : post // Mantener el post igual si no coincide el author_id
            )
          );
        }
      
    }, [feedLastFollowAction]);

    useEffect(() => {
        const getProfilePosts = async () => {
            try {
                const postsResponse = await fetch(`${serverUrl}/posts/profile/id/${id}?user_id=${user.id}`);
                if(postsResponse.ok) {
                    const data = await postsResponse.json();
                    console.log(data);
                    setPosts(data);
                } else {
                    console.error('Server internal error');
                }
            } catch(err) {
                console.error("error retrieving the profile posts", err);
            }
        };
        const getProfileInfo = async () => {
            try {
                const response = await fetch(`${serverUrl}/user/profile/id/${id}?user_id=${user.id}`);
                if(response.ok) {
                    const data = await response.json();
                    /* console.log(data); */
                    setProfileInfo({
                        id: data.id,
                        email: data.email,
                        username: data.username,
                        isFollowing: data.is_following,
                        imgs: {
                            profilePic: data.profile_pic,
                            bannerImg: data.banner_img
                        }
                    });
                } else {
                    console.error('Server internal error');
                }
            } catch(err) {
                console.error("error retrieving the profile data", err);
            }
        };

        if(user && id) {
            if(id != user.id) {
                getProfileInfo()
            } else {
                setProfileInfo({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    imgs: {
                        profilePic: user.imgs.profilePic,
                        bannerImg: user.imgs.bannerImg
                    }
                });
            }
        }

        getProfilePosts();
        
    }, [serverUrl, user, id]);

  return (
    <div className="profile-cont">
        <div className="profile-box">
            {/* <button onClick={() => console.log(profileInfo)} >show profile info</button> */}
            <div className="hero">
                <div className="banner-cont">
                    <img src={profileInfo.imgs.bannerImg} alt='banner' />
                </div>
                <div className="info">
                    <ProfilePic
                        url={profileInfo.imgs.profilePic}
                        size={10}
                        outline={true}
                    />
                    <div className="box">
                        <p id='username' >{profileInfo.username}</p>

                        <div className="btns">
                            { user.id != profileInfo.id &&
                                <>
                                <FollowBtn
                                    isFollowing={profileInfo.isFollowing}
                                    serverUrl={serverUrl}
                                    userId={user.id}
                                    targetId={profileInfo.id}
                                    isOnProfile={true}
                                />
                                <SendMessage />
                                </>
                            }
                        </div>
                    </div>

                </div>
            </div>

            <div className="profile-body">
                <div className="profile-feed">
                    <div className="feed-box">
                        { user.id == profileInfo.id && 
                            <CreatePost setPosts={setPosts} />
                        }
                        {posts.map((post) => {
                            return (
                                <Post
                                    userId={user.id}
                                    key={post.id}
                                    id={post.id}
                                    authorId={post.author_id}
                                    authorName={post.author_name}
                                    authorPic={post.author_pic}
                                    isAuthorOnline={post.is_author_online}
                                    content={post.content}
                                    createdAt={post.created_at}
                                    updatedAt={post.updated_at}
                                    likes={post.likes}
                                    isFollowing={post.is_following} // no se estan estableciendo los following
                                    serverUrl={serverUrl}
                                    setFeedLastFollowAction={setFeedLastFollowAction}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
