import { Box, Divider, Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Layout } from "../../layouts/Layout";

import { PaperLayout } from "../../layouts/Paper";
import { useStomp } from "../../services/hooks/useStomp";
import { PublicChat, StatusType, ResponseBody, Message } from "../../types";
import { FormSend } from "./components/FormSend";
import { Menu } from "./components/Menu";
import { Messages } from "./components/Messages";
import { Snackbar } from "./components/Snackbar";

const PUBLIC = "PUBLIC";

export const Chat: FC = () => {
  const [isNewMessage, setNewMessage] = useState(false);
  const { client, subscribe, username } = useStomp();
  const [currentTab, setCurrentTab] = useState(PUBLIC);
  const [chats, setChats] = useState<PublicChat>({ PUBLIC: [] });
  const [privateChats, setPrivateChats] = useState<Map<string, Message[]>>(
    new Map()
  );

  useEffect(() => {
    if (client) {
      userJoin();
      subscribe("/chatroom/public", onMessageReceived, {});
      subscribe("/app/message", onMessageReceived, {});
      subscribe("/user/" + username + "/private", onPrivateMessage, {});
    }
  }, [client]);

  const handleSetTab = (name: string) => setCurrentTab(name);

  const handleCloseSnackbar = () => setNewMessage(false);

  const userJoin = () => {
    if (client && username) {
      const chatMessage = {
        senderName: username,
        status: StatusType.JOIN,
      };
      client.publish({
        destination: "/chatroom/public",
        body: JSON.stringify(chatMessage),
      });
    }
  };

  const onMessageReceived = (payload: { body: string }) => {
    const payloadData: ResponseBody = JSON.parse(payload.body);
    const { status, ...message } = payloadData;

    switch (status) {
      case StatusType.JOIN:
        if (
          !privateChats.get(payloadData.senderName) &&
          username !== payloadData.senderName
        ) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case StatusType.MESSAGE:
        setChats((prev) => ({
          ...prev,
          PUBLIC: [...prev.PUBLIC, message],
        }));
        break;
    }
  };

  const onPrivateMessage = (payload: { body: string }) => {
    const message: ResponseBody = JSON.parse(payload.body);
    const list = [];

    if (privateChats.get(message.senderName)) {
      privateChats.get(message.senderName)?.push(message);
      setPrivateChats(new Map(privateChats));

      if (currentTab !== message.senderName) {
        setNewMessage(true);
      }

      return;
    }

    list.push(message);
    privateChats.set(message.senderName, list);
    setPrivateChats(new Map(privateChats));

    if (currentTab !== message.senderName) {
      setNewMessage(true);
    }
  };

  const handleSendMessage = (message: string) => {
    if (client && username) {
      if (currentTab !== PUBLIC) {
        const chatMessage: Message = {
          senderName: username,
          receiverName: currentTab,
          message,
          date: uuid(),
        };
        if (username !== currentTab) {
          privateChats.get(currentTab)?.push(chatMessage);
          setPrivateChats(new Map(privateChats));
        }
        client.publish({
          destination: "/app/private-message",
          body: JSON.stringify(chatMessage),
        });
        return;
      }
      client.publish({
        destination: "/app/message",
        body: JSON.stringify({
          senderName: username,
          status: StatusType.MESSAGE,
          message,
          date: uuid(),
        }),
      });
    }
  };

  return (
    <Layout>
      <PaperLayout>
        <Grid
          item
          container
          alignItems={"flex-end"}
          width={700}
          mr={2}
          flexWrap={"nowrap"}
        >
          <Grid item>
            <Box height={600}>
              <Menu
                chats={[PUBLIC, ...privateChats.keys()]}
                onSetTab={handleSetTab}
                currentTab={currentTab}
              />
            </Box>
          </Grid>
          <Grid height={600}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item container flexGrow={1} flexDirection={"column"}>
            <Grid item>
              <Messages
                messages={
                  currentTab === PUBLIC
                    ? chats.PUBLIC
                    : [...(privateChats.get(currentTab) || [])]
                }
              />
            </Grid>
            <Grid item ml={2} mb={3}>
              <FormSend onSend={handleSendMessage} />
            </Grid>
          </Grid>
        </Grid>
        <Snackbar open={isNewMessage} onClose={handleCloseSnackbar} />
      </PaperLayout>
    </Layout>
  );
};
