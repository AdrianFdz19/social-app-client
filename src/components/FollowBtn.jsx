import React, { useEffect, useState } from 'react'
import './styles/followbtn.scss';
import icons from '../assets/icons';
import { BiSolidObjectsHorizontalLeft } from 'react-icons/bi';

export default function FollowBtn({isFollowing, serverUrl, userId, targetId, setFeedLastFollowAction, isOnProfile = false}) {

  const [isHover, setHover] = useState(false);
  const [followClient, setFollowClient] = useState(null);

  useEffect(() => {
    if(isOnProfile) {
      setFollowClient(isFollowing);
    }
  }, [isFollowing, isOnProfile]);

  const handleFollowClick =  async () => {
    try {
      let isFollow = isOnProfile ? followClient : isFollowing;
      const response = await fetch(`${serverUrl}/user/${isFollow ? 'unfollow' : 'follow'}?uid=${userId}&tuid=${targetId}`);
      if(response.ok) {
        const data = await response.json();
        const followInfo = data.followInfo;
        const {target_id, follow} = followInfo;
        /* console.log(data); */
        if(setFeedLastFollowAction) {
          setFeedLastFollowAction({
            targetId: target_id,
            follow: follow
          });
        } else {
          setFollowClient(prev => !prev);
        }
      } else {
        console.error('Server internal error');
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className="follow-btn-cont"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleFollowClick}
    >
        {(isOnProfile ? followClient : isFollowing) ? (
          <div className={`f-btn-box unfollow ${isHover ? 'unfollow-hover' : ''}`}>
              {isHover ? (
                <>
                  <icons.minus className='icon' />
                  <p>Unfollow</p>
                </>
              ) : (
                <p>Followed</p>
              )}
          </div>
        ) : (
          <div className={`f-btn-box follow ${isHover ? 'follow-hover' : ''}`}>
              <icons.plus id='plus' className='icon' />
              <p>Follow</p>
          </div>
        )}
    </div>
  )
}
