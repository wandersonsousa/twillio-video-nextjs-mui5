import React from "react";
import { makeStyles } from "src/styles/makeStyles";

import Button from "@mui/material/Button";
import EndCallButton from "../Buttons/EndCallButton/EndCallButton";
import { isMobile } from "../../utils";
import Menu from "./Menu/Menu";
import useParticipants from "../../hooks/useParticipants/useParticipants";
import useRoomState from "../../hooks/useRoomState/useRoomState";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { Typography, Grid, Hidden } from "@mui/material";
import ToggleAudioButton from "../Buttons/ToggleAudioButton/ToggleAudioButton";
import ToggleChatButton from "../Buttons/ToggleChatButton/ToggleChatButton";
import ToggleVideoButton from "../Buttons/ToggleVideoButton/ToggleVideoButton";
import ToggleScreenShareButton from "../Buttons/ToogleScreenShareButton/ToggleScreenShareButton";

const useStyles = makeStyles()((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    left: 0,
    right: 0,
    height: `${theme.footerHeight}px`,
    position: "fixed",
    display: "flex",
    padding: "0 1.43em",
    zIndex: 10,
    [theme.breakpoints.down("md")]: {
      height: `${theme.mobileFooterHeight}px`,
      padding: 0,
    },
  },
  screenShareBanner: {
    position: "fixed",
    zIndex: 8,
    bottom: `${theme.footerHeight}px`,
    left: 0,
    right: 0,
    height: "104px",
    background: "rgba(0, 0, 0, 0.5)",
    "& h6": {
      color: "white",
    },
    "& button": {
      background: "white",
      color: theme.brand,
      border: `2px solid ${theme.brand}`,
      margin: "0 2em",
      "&:hover": {
        color: "#600101",
        border: `2px solid #600101`,
        background: "#FFE9E7",
      },
    },
  },
  hideMobile: {
    display: "initial",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

export default function MenuBar() {
  const { classes } = useStyles();
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === "reconnecting";
  const { room } = useVideoContext();
  const participants = useParticipants();

  return (
    <>
      {isSharingScreen && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className={classes.screenShareBanner}
        >
          <Typography variant="h6">
            Você está compartilhando sua tela
          </Typography>
          <Button onClick={() => toggleScreenShare()}>
            Parar compartilhamento
          </Button>
        </Grid>
      )}
      <footer className={classes.container}>
        <Grid container justifyContent="space-around" alignItems="center">
          <Hidden mdDown>
            <Grid style={{ flex: 1 }}>
              <Typography variant="body1">
                {room.name} | {participants.length + 1} participante
                {participants.length ? "s" : ""}
              </Typography>
            </Grid>
          </Hidden>
          <Grid item>
            <Grid container justifyContent="center">
              <ToggleAudioButton disabled={isReconnecting} />
              <ToggleVideoButton disabled={isReconnecting} />
              {!isSharingScreen && !isMobile && (
                <ToggleScreenShareButton disabled={isReconnecting} />
              )}
              {process.env.NEXT_PUBLIC_DISABLE_TWILIO_CONVERSATIONS !==
                "true" && <ToggleChatButton />}
              <Hidden mdDown>
                <Menu />
              </Hidden>
            </Grid>
          </Grid>
          <Hidden mdDown>
            <Grid style={{ flex: 1 }}>
              <Grid container justifyContent="flex-end">
                <EndCallButton />
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </footer>
    </>
  );
}
