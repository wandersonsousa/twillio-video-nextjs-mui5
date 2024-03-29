import React from "react";
import { Typography, Grid, Button, Hidden } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import LocalVideoPreview from "./LocalVideoPreview/LocalVideoPreview";
import SettingsMenu from "./SettingsMenu/SettingsMenu";
import { Steps } from "../PreJoinScreens";
import ToggleAudioButton from "../../Buttons/ToggleAudioButton/ToggleAudioButton";
import ToggleVideoButton from "../../Buttons/ToggleVideoButton/ToggleVideoButton";
import { useAppState } from "../../../state";
import useChatContext from "../../../hooks/useChatContext/useChatContext";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { makeStyles } from "src/styles/makeStyles";

const useStyles = makeStyles()((theme) => ({
  gutterBottom: {
    marginBottom: "1em",
  },
  marginTop: {
    marginTop: "1em",
  },
  deviceButton: {
    width: "100%",
    border: "2px solid #aaa",
    margin: "1em 0",
  },
  localPreviewContainer: {
    paddingRight: "2em",
    [theme.breakpoints.down("md")]: {
      padding: "0 2.5em",
    },
  },
  joinButtons: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      width: "100%",
      "& button": {
        margin: "0.5em 0",
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-between",
      margin: "1.5em 0 1em",
    },
  },
  mobileButton: {
    padding: "0.8em 0",
    margin: 0,
  },
}));

export default function DeviceSelectionScreen({ name, roomName, setStep }) {
  const { classes } = useStyles();
  const { getToken, isFetching } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const {
    connect: videoConnect,
    isAcquiringLocalTracks,
    isConnecting,
  } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  const handleJoin = () => {
    getToken(name, roomName).then(({ token }) => {
      videoConnect(token);
      process.env.NEXT_PUBLIC_DISABLE_TWILIO_CONVERSATIONS !== "true" &&
        chatConnect(token);
    });
  };

  if (isFetching || isConnecting) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        style={{ height: "100%" }}
      >
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography
            variant="body2"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            Entrando na sala
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Entre na sala: {roomName}
      </Typography>

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton
                className={classes.mobileButton}
                disabled={disableButtons}
              />
              <ToggleVideoButton
                className={classes.mobileButton}
                disabled={disableButtons}
              />
            </Hidden>
            <SettingsMenu mobileButtonClass={classes.mobileButton} />
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            style={{ height: "100%" }}
          >
            <div>
              <Hidden mdDown>
                <ToggleAudioButton
                  className={classes.deviceButton}
                  disabled={disableButtons}
                />
                <ToggleVideoButton
                  className={classes.deviceButton}
                  disabled={disableButtons}
                />
              </Hidden>
            </div>
            <div className={classes.joinButtons}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setStep(Steps.roomNameStep)}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                data-cy-join-now
                onClick={handleJoin}
                disabled={disableButtons}
              >
                Entrar
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
