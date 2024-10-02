import React, { useEffect, useState } from 'react'
import './styles/followbtn.scss';
import icons from '../assets/icons';
import { BiSolidObjectsHorizontalLeft } from 'react-icons/bi';
import { followNotification } from '../utils/events';

export default function FollowBtn({isFollowing, serverUrl, userId, targetId, setLastFollowActionContext, socket}) {

  const [isHover, setHover] = useState(false);
  const [followStatus, setFollowStatus] = useState(null);

  useEffect(() => {
    setFollowStatus(isFollowing);
  }, [isFollowing]);

  const handleClickBtn = async() => {
    try {
      const response = await fetch(`${serverUrl}/user/${followStatus ? 'unfollow' : 'follow'}?uid=${userId}&tuid=${targetId}`);
      if(response.ok) {
        const data = await response.json();
        const brief = data.followInfo;
        console.log(data.msg);
        setLastFollowActionContext({
          targetId: JSON.parse(brief.target_id),
          followStatus: brief.follow
        });
        setFollowStatus(prev => !prev);
        // Emitir el evento para notificar del follow al target
        if(brief.follow) {
          followNotification(socket, userId, targetId);
        }
      } else {
        console.error('Server internal error');
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="follow-btn-cont"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClickBtn}
    >
        {followStatus ? (
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
