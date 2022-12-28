import React, { userState } from "react";
import {
    NovuProvider,
    PopoverNotificationCenter,
    NotificationBell
} from "@novu/notification-center"
import { useNavigate } from "react-router-dom";

    

    function Home() 
        const [message, setMessage] = userState("");
        const [subscriber, setSubscriber] = userState("");

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log({ message, subscriber });
            setMessage("");
            setSubscriber("");
        };

        return (
            <div className='home'>
                <nav className='navbar'>
                    <h2>Notify</h2>
                </nav>
                <main className="homeContainer">
                    <h3>
                        Send notifications to your user
                    </h3>
                    <form
                        className='notification__form'
                        onSubmit={handleSubmit}
                        method='POST'>
                        <label htmlFor="title">Notification title </label>
                        <textarea
                            rows={5}
                            name='title'
                            required
                            value={message}
                            onChange={(e) => setSubscriber(e.target.value)}
                            placeholder='Let the user know that' />
                        <label htmlFor="subscriber">Subscriber</label>

                        <select
                            value={subscriber}
                            name='subscriber'
                            onChange={(e) => setSubscriber(e.target.value)}
                        >
                            {
                                subscribers.map((s) =>(
                                    <option 
                                        key={s._id}
                                        value={`${s.firstName} ${s.lastName} - ${s.subscriberId}`}
                                    >{`${s.firstName} ${s.lastName} - ${s.subscriberId}`}</option>
                                ))
                            }
                          
                        </select>
                        <button>SEND NOTIFICATION</button>


                    </form>
                </main>

            </div>
        );

        const Home = () => {
            const navigate = useNavigate();

            const onNotificationClick = (Notification) => {
                navigate (Notification.cta.data.url);

            };
            //.. other notifications

            return (
                <div className="home">
                    <nav className="navbar">
                        <h2>Notify</h2>
                        <NovuProvider
                            subscriberId={"<YOUR_SUBSCRIBER_ID>"}
                            applicationIdentifier={"<YOUR_APP_ID>"}
                            >
                                <PopoverNotificationCenter onNotificationClick={onNotificationClick}>
                                    {({ unseenCount }) => (
                                        <PopoverNotificationCenter onNotificationClick={unseenCount} colorScheme='light' />
                                        
                                    )
                                    }
                                </PopoverNotificationCenter>
                            </NovuProvider>
                    </nav>
                    <main className="homeContainer">...</main>
                </div>
            );
        
    };