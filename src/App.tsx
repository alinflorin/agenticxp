import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Flex flexDirection="column" w="100%" h="100%">
      <Header />
      <Box p={4} flex="auto" minH={0} overflow="auto">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
}
