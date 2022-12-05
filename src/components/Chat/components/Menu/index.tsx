import { List, ListItemButton } from "@mui/material";
import React, { FC } from "react";
import { ChatType } from "../../../../services/stompService";

type MenuProps = {
  chats: ChatType;
};

const Menu: FC<MenuProps> = ({ chats }) => {
  console.log(Object.keys(chats));
  console.log(chats);
  return (
    <List>
      {Object.keys(chats).map((chat) => (
        <ListItemButton>{chat}</ListItemButton>
      ))}
    </List>
  );
};

export default Menu;
