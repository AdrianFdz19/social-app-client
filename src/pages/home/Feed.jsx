import React, { useEffect, useState } from 'react'
import './styles/feed.scss';
import Post from '../../components/post/Post';
import CreatePost from './CreatePost';
import { useAppContext } from '../../context/AppProvider';

export default function Feed() {

  const {serverUrl, user} = useAppContext();
  
  /* {
    id: 1,
    author_id: 8,
    author_name: 'adrianfdz',
    author_pic: 'https://firebasestorage.googleapis.com/v0/b/social-app-base.appspot.com/o/profile_pictures%2F1aa56704-7d04-43d1-af1e-434aa2e1da02?alt=media&token=4a97eea6-4241-47d9-b067-40a267d2b7bf',
    is_author_online: true,
    content: 'This is the content',
    created_at: '2 days ago',
    updated_at: ...,
    likes: 0,
    is_following: false
  }, */

  const [posts, setPosts] = useState([]);
  const [feedLastFollowAction, setFeedLastFollowAction] = useState({
    targetId: null,
    follow: null
  });

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsResponse = await fetch(`${serverUrl}/posts/current_user/${user.id}`);
        if(postsResponse.ok) {
          const data = await postsResponse.json();
          setPosts(prev => ([...prev, ...data]));
        } else {
          console.error('Server internal error');
        }
      } catch(err) {
        console.error(err);
      }
    };
    getPosts();
  }, [serverUrl, user]);

  useEffect(() => {
    const { targetId, follow } = feedLastFollowAction;
  
    if (targetId) {
  
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

  return (
    <div className="feed-cont">
        <div className="feed-box">
            <CreatePost setPosts={setPosts} />
            {
              posts.map((post) => (
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
                  isFollowing={post.is_following}
                  serverUrl={serverUrl}
                  setFeedLastFollowAction={setFeedLastFollowAction}
                />
              ))
            }
        </div>
    </div>
  )
}
