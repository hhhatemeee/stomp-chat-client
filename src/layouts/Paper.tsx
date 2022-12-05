import { Paper } from "@mui/material";
import { FC, ReactNode } from "react";

type PaperLayoutProps = {
  children: ReactNode;
};

export const PaperLayout: FC<PaperLayoutProps> = ({ children }) => {
  return <Paper>{children}</Paper>;
};
