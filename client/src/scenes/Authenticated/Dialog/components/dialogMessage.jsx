import Autolinker from 'autolinker';
import React from 'react';

const DialogMessage = ({
        id,
        senderId,
        text,
        authUserId,
        dateMessage,
        type
    }) => {

    const dateString = dateMessage;
    const date = new Date(dateString);
         
 
    const timeString = date.toLocaleTimeString().slice(0, -3);

    const linkedText = Autolinker.link(text, {
        hashtag: 'twitter',
        truncate: {
            length: 20,
            location: 'end'
        },
        replaceFn : function(match) {    
            switch(match.type) {    
                case 'hashtag':
                    return '<a href="/feed?query=%23' + match.getHashtag() + '">' + '#' + match.getHashtag() + '</a>';
            }
        }
    });


    return (
        <div className={authUserId === senderId ? 'dialog-message dialog-message-out' : 'dialog-message dialog-message-in'} id={id}>
            <div className="dialog-message-row">
                <div className="dialog-message-text">
                    <p dangerouslySetInnerHTML={{ __html: linkedText }}></p>
                </div>
                <div className="dialog-message-date">
                    <span>{timeString}</span>
                </div>
            </div>
        </div>
    );
}

export default DialogMessage;