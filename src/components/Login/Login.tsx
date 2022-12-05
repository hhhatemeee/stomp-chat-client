import { Grid, Box, TextField, Button } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../../helpers/hooks/context";
import { Layout } from "../../layouts/Layout";
import { useStomp } from "../../services/hooks/useStomp";

export const Login: FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { onLogin } = useAppContext();
  const { client } = useStomp();

  useEffect(() => {
    if (client) navigate("/chat");
  }, [client]);

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleLogin = () => {
    onLogin(name);
  };

  return (
    <Layout>
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
    </Layout>
  );
};
