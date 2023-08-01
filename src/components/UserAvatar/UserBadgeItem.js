import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

export default function UserBadgeItem({user,handleFunction}) {
    return (
        <Badge
          px={2}
          py={1}
          borderRadius="lg"
          margin={1}
          mb={2}
          variant="solid"
          fontSize={12}
          colorScheme="purple"
          cursor="pointer"
          onClick={handleFunction}
        >
          {user.name} 
          <CloseIcon pl={1} />
        </Badge>
      );
}
