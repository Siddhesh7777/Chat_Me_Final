import React from 'react'
import { useDisclosure } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Modal } from '@chakra-ui/react';
import { ModalContent } from '@chakra-ui/react';
import { ModalOverlay } from '@chakra-ui/react';
import { ModalHeader } from '@chakra-ui/react';
import { ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import { FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import UserListItem from '../UserAvatar/UserListItem'
import { Box } from '@chakra-ui/react';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

export default function GroupChatModel({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats } = ChatState();
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
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:5100/api/chat/group", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ name: groupChatName, users: JSON.stringify(selectedUsers.map((user) => user._id)) })
            })
            const json = await response.json();
            setChats([json, ...chats])
            console.log(chats);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }





    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center">Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}></Input>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {/* selected users */}
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers?.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>

                        {/* render search users  */}
                        {loading ? <div>Loading...</div> : (searchResult?.slice(0, 4)
                            .map((user) => (
                                <UserListItem key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />)))}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
