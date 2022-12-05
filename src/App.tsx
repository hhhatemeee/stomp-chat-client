import { Container } from "@mui/material";
import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { ChatType, StompService } from "./services/stompService";

type AppContextType = {
  onLogin: (username: string) => void;
  chats: ChatType;
  onSendMessage: (msg: string) => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

function App() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });

  useEffect(() => {
    if (!userData.username) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (userData.username)
      stompService.connect(userData).then(() => {
        navigate("/chat");
        stompService.sendMessage("test");
      });
  }, [userData]);

  const stompService = new StompService("http://localhost:8080/ws");

  const handleLogin = (username: string) => {
    setUserData({ ...userData, username, connected: true });
  };

  const handleSendMessage = (msg: string) => stompService.sendMessage(msg);

  return (
    <AppContext.Provider
      value={{
        onLogin: handleLogin,
        chats: stompService.getChats(),
        onSendMessage: handleSendMessage,
      }}
    >
      <Container sx={{ height: "90vh" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Container>
    </AppContext.Provider>
  );
}

export default App;
