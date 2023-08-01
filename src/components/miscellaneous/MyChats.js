import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { useState } from 'react';
import { useToast } from "@chakra-ui/toast";
import { useEffect } from 'react';
import { Box } from "@chakra-ui/layout";
import { Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Stack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import { getSender } from '../config/ChatLogics'
import GroupChatModel from './GroupChatModel';
// import IsLoading from './IsLoading';
import Loading from '../Loading';
export default function MyChats({fetchAgain}) {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  

  const fetchChat = async () => {
    try {
      const response = await fetch("http://localhost:5100/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      const json = await response.json();
      // console.log(json);
      setChats(json);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("authToken")));
    fetchChat();
    // eslint-disable-next-line
  }, [fetchAgain]);



  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>) : (
        <Loading/>
        )}
      </Box>
    </Box>
  )
}
