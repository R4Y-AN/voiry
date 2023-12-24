import React, { useEffect, useState, useRef } from 'react';
import MessageContainer from './MessageContainer';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ChatBox = (props) => {
  const user = useSelector((state) => state.data.user.user);
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.data.user.isLoading);
  const { username } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const chatRef = ref(db, `chats/${user.username}/${username}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      // Update state with received messages
      if (data) {
        const messages = Object.values(data);
        setMessages(messages);
        scrollToBottom();
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [user.username, username]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useState(()=>{
    scrollToBottom(); 
  },[messagesEndRef])

  const handleSend = async () => {
    document.getElementById("inp").value="";
    if (messageText.trim() !== "") {
      console.log(props.receiverId);
      try {
        await axios.post(process.env.REACT_APP_SERVER_IP + "api/user/sendMessage", {
          access_token: sessionStorage.getItem("_token"),
          receiverId: props.receiverId,
          message: messageText
        });
        scrollToBottom();
      } catch (err) {
        toast("Error to send the message!");
      }
    }
  }

  

  if (props.chatSelected === true) {
    return (
      <div className='w-[90%] h-screen pt-[100px]  flex flex-col items-center justify-end'>
        <div className='w-full flex flex-col items-center  overflow-scroll space-y-[45px] px-3'>
          {messages.map((message, index) => (
            <MessageContainer
              key={index}
              dp={message.sender !== user.username ? props.profilePic : user.profilePicture}
              message={message.message}
              position={message.sender !== user.username ? "left" : "right"}
            />
          ))}
          {/* Empty Space */}
          <div className='w-full h-[150px] sm:h-[70px]' ref={messagesEndRef}></div>
        </div>
        <div className='flex bottom-[50px] sm:bottom-5 w-full items-center justify-center flex-row space-x-2 mb-3'>
          <input id="inp" onChange={(e) => { setMessageText(e.target.value) }} className='w-[80%] h-[40px] border rounded-full outline-none border-[black] bg px-2' />
          <button onClick={handleSend} className='px-3 rounded-full h-[40px] border bg-slate-400 '>Send</button>
        </div>
        <div className='h-[40px] sm:h-[0px]'></div>
      </div>
    );
  }

  return (
    <div id='chat_box' className='w-[90%] h-screen pt-[100px] hidden sm:flex flex-col items-center justify-end'>
      <div className='w-full h-full flex flex-col overflow-scroll space-y-[45px] px-3'>
        <h1>No Selected Chat!</h1>
        {/* Empty Space */}
        <div className='h-[50px]'></div>
      </div>
    </div>
  );
}

export default ChatBox;
