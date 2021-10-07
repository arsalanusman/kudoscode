import React from 'react';
import Button from '../components/Button'

const MessageBox = ({ message,reply,call,img }) => {
    return (
       <div className="MessageThread round-col">
            <h5>Message Thread</h5>
            <div className="cont isIcon">
                <img src={img} alt={message}/>
                <p>{message}</p>
            </div>
            <div className="button-area">
                <Button type="primary" field="a" title="Reply" icon="call" color="lightblue" link={reply}/>
                <Button type="primary" field="a" title="Call Me" icon="" color="dark" link={call}/>
            </div>
       </div>
    );
}

export default MessageBox;

