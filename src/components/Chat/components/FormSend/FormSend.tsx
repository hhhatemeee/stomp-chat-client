import { Button, Grid, TextField } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";

type FormSendProps = {
  onSend: (msg: string) => void;
};

export const FormSend: FC<FormSendProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const handleSendMessage = () => {
    if (message) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <Grid item container alignItems={"center"}>
      <Grid item flex={1}>
        <TextField
          size={"small"}
          fullWidth
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
