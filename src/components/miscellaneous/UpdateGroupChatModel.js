import React, { useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalBody, ModalContent, ModalCloseButton, ModalHeader, ModalFooter, Button } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import { Box } from '@chakra-ui/react';
import { FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import UserListItem from '../UserAvatar/UserListItem';



export default function UpdateGroupChatModel({ fetchAgain, setFetchAgain,fetchMessages,socket }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const handleRemove =async (user1) => { 
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
              title: "Only admins can remove someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
          const response=await fetch('http://localhost:5100/api/chat/groupremove',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({ chatId:selectedChat._id,userId:user1._id })
        })
        const json=await response.json();
        user1._id === user._id ? setSelectedChat() : setSelectedChat(json);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      socket.emit('RemoveUser1',user1);
      socket.emit('RemoveUser',json);
      setLoading(false);

    }




    const handleAddUser=async (user1)=>{
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
              title: "User Already in group!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }

          if (selectedChat.groupAdmin._id !== user._id) {
            toast({
              title: "Only admins can add someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
          try{
            setLoading(true);

            const response=await fetch('http://localhost:5100/api/chat/groupadd',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ chatId:selectedChat._id,userId:user1._id })
            })
            const json=await response.json();
            setSelectedChat(json);
            setFetchAgain(!fetchAgain)
            socket.emit('AddUser',json);
            setLoading(false)
          }catch(error){
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);}
            setGroupChatName("");
          

    }


    const handleRename = async () => {
        if (!groupChatName) return;
        // console.log(selectedChat._id)
        // console.log(JSON.stringify({ chatId:selectedChat._id,chatName:groupChatName }))

        try {
            const response = await fetch("http://localhost:5100/api/chat/rename", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ chatId:selectedChat._id,chatName:groupChatName })
            })
            const json=await response.json();
            setSelectedChat(json);
            // console.log(json)
            setFetchAgain(!fetchAgain)
            socket.emit('Rename',json);
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setRenameLoading(false);
            }
            setGroupChatName("");
        
    }


    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const data = await fetch(`http://localhost:5100/api/userData?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            const json = await data.json();
            // console.log(json);
            setLoading(false);
            setSearchResult(json)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                                {loading?(<Spinner size="lg"/>):(
                                        searchResult?.map((user) => (
                                            <UserListItem key={user._id}
                                                user={user}
                                                handleFunction={() => handleAddUser(user)}
                                            />))
                                )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
