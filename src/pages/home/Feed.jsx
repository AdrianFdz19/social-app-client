import React, { useEffect, useState } from 'react'
import './styles/feed.scss';
import Post from '../../components/post/Post';
import CreatePost from './CreatePost';
import { useAppContext } from '../../context/AppProvider';

export default function Feed({socket}) {

  const {serverUrl, user} = useAppContext();

  const [posts, setPosts] = useState([]);

  //Obtener la lista de posts
  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsResponse = await fetch(`${serverUrl}/posts/current_user/${user.id}`);
        if(postsResponse.ok) {
          const data = await postsResponse.json();
          setPosts(data);
        } else {
          console.error('Server internal error');
        }
      } catch(err) {
        console.error(err);
      }
    };
    getPosts();
  }, [serverUrl, user]);

  const [lastFollowActionContext, setLastFollowActionContext] = useState({
    targetId: null,
    followStatus: null
  });

  //Cuando se detecte un cambio en lasFollowActionContext proveniente de un follow btn hijo
  useEffect(() => {
    const {targetId, followStatus} = lastFollowActionContext;

    if (targetId) {
      console.log(lastFollowActionContext);
      // Actualizar los posts con el author_id correspondiente al targetId
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.author_id == targetId
            ? { ...post, is_following: followStatus } // Actualizar la propiedad is_following
            : post // Mantener el post igual si no coincide el author_id
        )
      );
    }
  }, [lastFollowActionContext]);

  return (
    <div className="feed-cont">
        <div className="feed-box">
            <CreatePost setPosts={setPosts} />
            {
              posts.map((post) => (
                <Post
                  userId={user.id}
                  username={user.username}
                  key={post.id}
                  id={post.id}
                  authorId={post.author_id}
                  authorName={post.author_name}
                  authorPic={post.author_pic}
                  userPic={user.imgs.profilePic}
                  isAuthorOnline={post.is_author_online}
                  content={post.content}
                  createdAt={post.created_at}
                  updatedAt={post.updated_at}
                  likes={Number(post.likes_count)}
                  isFollowing={post.is_following}
                  serverUrl={serverUrl}
                  setLastFollowActionContext={setLastFollowActionContext}
                  hasLiked={post.has_liked}
                  prevComments={post.prev_comments}
                  commentsCount={Number(post.comments_count)}
                  socket={socket}
                />
              ))
            }
        </div>
    </div>
  )
}
