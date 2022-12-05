import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Grid,
  Box,
} from "@mui/material";
import { FC } from "react";

import { useStomp } from "../../../../services/hooks/useStomp";
import { Message } from "../../../../types";

type MessagesProps = {
  messages: Message[];
};

export const Messages: FC<MessagesProps> = ({ messages }) => {
  const { username } = useStomp();

  return (
    <List>
      {messages.map((msg) =>
        username === msg.senderName ? (
          <Grid item key={msg.date}>
            <ListItem sx={{ justifyContent: "flex-end", pr: 0, mr: 0 }}>
              <Grid item mr={1} minWidth={30} justifySelf={"flex-end"}>
                <Box
                  sx={{
                    bgcolor: "#b6e5b6",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 10,
                    borderBottomRightRadius: 0,
                  }}
                >
                  <ListItemText primary={msg.message} />
                </Box>
              </Grid>
            </ListItem>
          </Grid>
        ) : (
          <Grid item key={msg.date}>
            <ListItem>
              <Grid item container>
                <ListItemAvatar sx={{ minWidth: 46 }}>
                  <Avatar>{msg.senderName.slice(0, 1)}</Avatar>
                </ListItemAvatar>
                <Box
                  sx={{
                    bgcolor: "#bbeef5",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 10,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <ListItemText primary={msg.message} />
                </Box>
              </Grid>
            </ListItem>
          </Grid>
        )
      )}
    </List>
  );
};
