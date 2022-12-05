import { Container } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { StompSessionProvider } from "./services/StompSessionProvider";

const WS = "http://localhost:8080/ws";

type AppContextType = {
  onLogin: (username: string) => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, []);

  const handleLogin = (username: string) => {
    setUsername(username);
  };

  return (
    <StompSessionProvider url={WS} username={username}>
      <AppContext.Provider
        value={{
          onLogin: handleLogin,
        }}
      >
        <Container sx={{ height: "90vh" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Container>
      </AppContext.Provider>
    </StompSessionProvider>
  );
}

export default App;
