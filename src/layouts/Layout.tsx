import { Grid } from "@mui/material";
import { FC, ReactNode } from "react";

type PaperLayoutProps = {
  children: ReactNode;
};

export const Layout: FC<PaperLayoutProps> = ({ children }) => {
  return (
    <Grid
      container
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {children}
    </Grid>
  );
};
