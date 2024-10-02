import React, { useState } from 'react';
import './styles/notifications.scss';
import { useNotifications } from '../../context/NotificationsProvider';
import ProfilePic from '../../components/ProfilePic';

export default function Notifications() {

    const { notifications } = useNotifications();
    const [filter, setFilter] = useState('all'); // Estado para manejar el filtro

    // Filtrar notificaciones no leídas
    const unreadNotifications = notifications.filter(not => !not.read);
    
    // Filtrar notificaciones leídas
    const readNotifications = notifications.filter(not => not.read);

    // Mostrar solo no leídas si el filtro es 'unread', o ambas si es 'all'
    const filteredNotifications = filter === 'unread' 
        ? unreadNotifications 
        : [...unreadNotifications, ...readNotifications];

    return (
        <div className="notifications">
            <div className="notifications__box">
                <h2>Notifications</h2>
                <div className="filter">
                    {/* Filtro de todas las notificaciones o solo no leídas */}
                    <p 
                        className={`filter-opt ${filter === 'all' ? 'selected' : ''}`} 
                        onClick={() => setFilter('all')}
                    >
                        All
                    </p>
                    <p 
                        className={`filter-opt ${filter === 'unread' ? 'selected' : ''}`} 
                        onClick={() => setFilter('unread')}
                    >
                        Unread
                    </p>
                </div>

                {filteredNotifications.length > 0 ? (
                    <>
                        {filter === 'all' && (
                            <>
                                {/* Mostrar no leídas primero */}
                                <h3>Unread</h3>
                                {unreadNotifications.length > 0 ? (
                                    unreadNotifications.map((not, i) => (
                                        <div className="notifications__not unread" key={i}>
                                            <div className="notifications__not-box">
                                                <ProfilePic size={3} url={not.source_pic} />
                                                <div className="notifications__not-content">
                                                    <div className="content">
                                                        <p id='sourcename'>{not.source_name}</p>
                                                        <p id='text'>{not.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No unread notifications</p>
                                )}
                            </>
                        )}

                        {filter === 'all' && (
                            <>
                                {/* Mostrar leídas después */}
                                <h3>Read</h3>
                                {readNotifications.length > 0 ? (
                                    readNotifications.map((not, i) => (
                                        <div className="notifications__not read" key={i}>
                                            <div className="notifications__not-box">
                                                <ProfilePic size={3} url={not.source_pic} />
                                                <div className="notifications__not-content">
                                                    <div className="content">
                                                        <p id='sourcename'>{not.source_name}</p>
                                                        <p id='text'>{not.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No read notifications</p>
                                )}
                            </>
                        )}

                        {filter === 'unread' && (
                            <>
                                {unreadNotifications.length > 0 ? (
                                    unreadNotifications.map((not, i) => (
                                        <div className="notifications__not unread" key={i}>
                                            <div className="notifications__not-box">
                                                <ProfilePic size={3} url={not.source_pic} />
                                                <div className="notifications__not-content">
                                                    <div className="content">
                                                        <p id='sourcename'>{not.source_name}</p>
                                                        <p id='text'>{not.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No unread notifications</p>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <p>You don't have notifications</p>
                )}
            </div>
        </div>
    );
}
