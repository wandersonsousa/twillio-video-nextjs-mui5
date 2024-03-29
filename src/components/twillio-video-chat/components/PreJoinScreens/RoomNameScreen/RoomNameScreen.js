import React from "react";
import { Typography, TextField, Grid, Button, InputLabel } from "@mui/material";
import { useAppState } from "../../../state";
import { makeStyles } from "src/styles/makeStyles";

const useStyles = makeStyles()((theme) => ({
  gutterBottom: {
    marginBottom: "1em",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "1.5em 0 3.5em",
    "& div:not(:last-child)": {
      marginRight: "1em",
    },
    [theme.breakpoints.down("md")]: {
      margin: "1.5em 0 2em",
    },
  },
  textFieldContainer: {
    width: "100%",
  },
  continueButton: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
}));

export default function RoomNameScreen({
  name,
  roomName,
  setName,
  setRoomName,
  handleSubmit,
}) {
  const { classes } = useStyles();
  const { user } = useAppState();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  const hasUsername =
    !window.location.search.includes("customIdentity=true") &&
    user?.displayName;

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Entre na sala
      </Typography>
      <Typography variant="body1">
        {hasUsername
          ? "Digite o nome da sala para entrar"
          : "Digite seu nome e o nome da sala para entrar"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <InputLabel shrink htmlFor="input-user-name">
                Seu nome
              </InputLabel>
              <TextField
                id="input-user-name"
                variant="outlined"
                fullWidth
                size="small"
                value={name}
                onChange={handleNameChange}
              />
            </div>
          )}
          <div className={classes.textFieldContainer}>
            <InputLabel shrink htmlFor="input-room-name">
              Nome da sala
            </InputLabel>
            <TextField
              autoCapitalize="false"
              id="input-room-name"
              variant="outlined"
              fullWidth
              size="small"
              value={roomName}
              onChange={handleRoomNameChange}
            />
          </div>
        </div>
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!name || !roomName}
            className={classes.continueButton}
          >
            Continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
