import React, { FC } from "react";
import {
  Alert,
  Grow,
  Snackbar as MUISnackbar,
  SnackbarProps as MUISnackbarProps,
} from "@mui/material";

type SnackbarProps = {
  onClose: () => void;
} & MUISnackbarProps;

export const Snackbar: FC<SnackbarProps> = ({ open, onClose }) => {
  return (
    <MUISnackbar
      TransitionComponent={Grow}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity="info">
        Новое сообщение!
      </Alert>
    </MUISnackbar>
  );
};
