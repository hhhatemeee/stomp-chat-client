import { Grid, Paper, Box, TextField, Button } from "@mui/material";
import React, { ChangeEvent, FC, useState } from "react";
import { useAppContext } from "../../hooks/context";
import { PaperLayout } from "../../layouts/PaperLayout";

export const Login: FC = () => {
  const [name, setName] = useState("");
  const { onLogin } = useAppContext();

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleLogin = () => {
    onLogin(name);
  };

  return (
    <PaperLayout>
      <Grid item>
        <Box mx={5}>
          <Grid item>
            <Grid item container alignItems={"center"}>
              <Grid item>
                <TextField
                  value={name}
                  onChange={handleChangeName}
                  size="small"
                  placeholder="Введите имя"
                />
              </Grid>
              <Grid ml={1}>
                <Button variant="contained" onClick={handleLogin}>
                  Войти
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </PaperLayout>
  );
};
