import { Grid, TextField } from "@mui/material";
import React, { FC } from "react";
import { useAppContext } from "../../hooks/context";
import { PaperLayout } from "../../layouts/PaperLayout";
import FormSend from "./components/FormSend";
import Menu from "./components/Menu";

export const Chat: FC = () => {
  const { chats, onSendMessage } = useAppContext();
  return (
    <PaperLayout>
      <Grid item>
        <button onClick={() => console.log(chats)}>asd</button>
        <Menu chats={chats} />
        <FormSend onSend={onSendMessage} />
      </Grid>
    </PaperLayout>
  );
};
