import { List, ListItemButton, Typography } from "@mui/material";
import { FC } from "react";

type MenuProps = {
  chats: string[];
  onSetTab: (name: string) => void;
  currentTab: string;
};

export const Menu: FC<MenuProps> = ({ chats, onSetTab, currentTab }) => {
  return (
    <List sx={{ p: 0, m: 0 }}>
      {chats.map((chat) => (
        <ListItemButton
          key={chat}
          onClick={() => onSetTab(chat)}
          selected={chat === currentTab}
        >
          <Typography sx={{ px: 2 }}>{chat}</Typography>
        </ListItemButton>
      ))}
    </List>
  );
};
