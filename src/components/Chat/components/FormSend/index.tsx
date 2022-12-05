import { Button, Grid, TextField } from "@mui/material";
import React, { ChangeEvent, FC, useState } from "react";

type FormSendProps = {
  onSend: (msg: string) => void;
};

const FormSend: FC<FormSendProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const handleSendMessage = () => message && onSend(message);

  return (
    <Grid item container alignItems={"center"} mx={2}>
      <Grid item>
        <TextField
          size={"small"}
          value={message}
          onChange={handleChangeMessage}
        />
      </Grid>
      <Grid item ml={1}>
        <Button variant="contained" onClick={handleSendMessage}>
          SEND
        </Button>
      </Grid>
    </Grid>
  );
};

export default FormSend;
