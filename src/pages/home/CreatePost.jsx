import React, { useState } from 'react'
import Overlay from '../../components/Overlay';
import './styles/createpost.scss';
import ProfilePic from '../../components/ProfilePic';
import { useAppContext } from '../../context/AppProvider';
import icons from '../../assets/icons';

export default function CreatePost({setPosts}) {

    const {user, serverUrl} = useAppContext();
    const [openModal, setOpenModal] = useState(false);

    const [postInfo, setPostInfo] = useState({
        userId: user.id,
        content: '',
        media: []
    });

    const changeOpenModal = () => setOpenModal(prev => !prev);

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        try {
            const postResponse = await fetch(`${serverUrl}/posts/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postInfo)
            });
            if(postResponse.ok) {
                const data = await postResponse.json();
                /* console.log(data); */
                const newPostData = {
                    ...data,
                    comments_count: 0,
                }
                console.log(newPostData, typeof newPostData.likes);
                setPosts(prev => ([newPostData, ...prev]));
                changeOpenModal();
            } else {
                console.error('Server internal error');
            }
        } catch(err) {
            console.error(err);
        }
    };

  return (
    <>
        {openModal &&
            <Overlay>
                <div className="modal-box">
                    <form onSubmit={handleSubmitPost} >
                        <icons.close id='close' 
                            onClick={changeOpenModal}
                        />
                        <h3>Create post</h3>
                        <textarea 
                            onChange={(e)=>setPostInfo({...postInfo, content: e.target.value})}
                        ></textarea>
                        <input type="submit" value="Post it" />
                    </form>
                </div>
            </Overlay>
        }
        <div className="c-post-cont" 
            onClick={changeOpenModal}
        >
            <div className="c-post-box">
                <ProfilePic
                    size={3}
                    url={user.imgs.profilePic}
                />

                <p>Create post</p>
            </div>
        </div>
    </>
  )
}
