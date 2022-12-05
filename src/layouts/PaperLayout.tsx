import { Grid, Paper } from "@mui/material";
import React, { FC, ReactNode } from "react";

type PaperLayoutProps = {
  children: ReactNode;
};

export const PaperLayout: FC<PaperLayoutProps> = ({ children }) => {
  return (
    <Grid
      container
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Paper sx={{ py: 3 }}>{children}</Paper>
    </Grid>
  );
};
