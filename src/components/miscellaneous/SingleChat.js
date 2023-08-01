import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogics';
import ProfileModel from './ProfileModel';
import { getSenderFull } from '../config/ChatLogics';
import { useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import ScrollableChat from './ScrollableChat';
import Lottie from "lottie-react";
import openSocket from 'socket.io-client'
import './styles.css'
import animationData from "../animations/type.json"
const SERVERURL="http://localhost:5100"
var socket, selectedChatCompare;



export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing,setTyping]=useState(false)
  const [istyping,isSetTyping]=useState(false)
  const { selectedChat, setSelectedChat, user,notification,setNotification } = ChatState();
  const toast = useToast()


  
  useEffect(()=>{
    socket=openSocket(SERVERURL);
    socket.emit("setup",user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on('typing',()=>isSetTyping(true))
    socket.on('stopTyping',()=>isSetTyping(false))
  
  },[])

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5100/api/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      })
      setLoading(false);
      const json = await response.json();
      setMessages(json);
      // console.log(messages)

      socket.emit("join chat",selectedChat._id)


    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat;
  }, [selectedChat]);


  // console.log(notification)

  useEffect(()=>{
    socket.on("message Received",(newMessageReceived)=>{
      if(!selectedChatCompare||selectedChatCompare._id!==newMessageReceived.chat._id){//means if the messge you received is not same as the
        //you selected now or you are chatting with Arnab but Ram send you a message then just push a notification
        //give notification
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived,...notification]);
          setFetchAgain(!fetchAgain)
        }
      }
      else{
        setMessages([...messages,newMessageReceived]);
      }
    })//useEffect without dependency
 socket.on('Renamed',()=>{
    setFetchAgain(!fetchAgain)
   })
 socket.on('UpdateUser',()=>{
    // console.log('fetched')
    setFetchAgain(!fetchAgain)
   })
 socket.on('RemovedUserk',()=>{
    // console.log('fetched')
    setFetchAgain(!fetchAgain)
   })
 socket.on('RemovedUser1',()=>{
    // console.log('fetched')
    setFetchAgain(!fetchAgain)
    fetchMessages();
    setSelectedChat();
   })
  })



  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit('typing',selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
    
  }





  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) { //if input contains characters and key is enter
      socket.emit("StopTyping",selectedChat._id)
      try {
        setNewMessage('');
        const response = await fetch("http://localhost:5100/api/message", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ content: newMessage, chatId: selectedChat._id })
        })
        const json = await response.json();
        // console.log(json)
        socket.emit('newMessage',json)
        setMessages([...messages, json]);

      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  return (
    <>{
      selectedChat ? <>
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />{
            !selectedChat.isGroupChat ? (<>
              {/* showing the heading as chatname when chat is a one to one chat */}
              {getSender(user, selectedChat.users)}
              <ProfileModel user={getSenderFull(user, selectedChat.users)}></ProfileModel>

            </>) : (
              <>
                {/* showing the heading as chatname when chat is a groupchat */}
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                  socket={socket}
                ></UpdateGroupChatModel>
              </>
            )
          }
        </Text>
        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {/* ui for messages */}
          {loading ? <Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
          /> : (<div className='messages'>
              {/* ScrollableChat for chat messages ui */}
            <ScrollableChat messages={messages}/>
          </div>)}

          {istyping?
          <div
              style={{ 
                // marginBottom: 0, marginLeft: 0,
                width:'70px'}}
              >
              <Lottie 
            animationData={animationData} loop={true}
            />
          </div>
            :<></>}
          <FormControl
            onKeyDown={sendMessage}
            // onkeyDown means when the user presses a key sendMessage action gets performed
            id="first-name"
            isRequired
            mt={3}
          >
            <Input
              variant="filled"
              bg="white"
              placeholder="Enter a message.."
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>

        </Box>
      </> : (<Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>)
    }</>
  )
}
