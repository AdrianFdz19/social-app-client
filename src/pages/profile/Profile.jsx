import React, { useEffect, useState } from 'react'
import './styles/profile.scss';
import { useLocation } from 'react-router-dom';
import ProfilePic from '../../components/ProfilePic';
import { useAppContext } from '../../context/AppProvider';

export default function Profile() {

    const {user, serverUrl} = useAppContext();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const [profileInfo, setProfileInfo] = useState({
        id: null,
        email: '',
        username: '',
        imgs: {
            profilePic: '',
            bannerImg: ''
        },
    });

    useEffect(() => {
        const getProfileInfo = async () => {
            try {
                const response = await fetch(`${serverUrl}/user/profile/id/${id}`);
                if(response.ok) {
                    const data = await response.json();
                    setProfileInfo({
                        id: data.id,
                        email: data.email,
                        username: data.username,
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
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
