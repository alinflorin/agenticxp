import { Flex, Spinner } from "@chakra-ui/react";

export default function Loading() {
    return <Flex w="100%" h="100%" flex="1" justifyContent={"center"} alignItems={"center"}>
        <Spinner size="xl" />
    </Flex>
}