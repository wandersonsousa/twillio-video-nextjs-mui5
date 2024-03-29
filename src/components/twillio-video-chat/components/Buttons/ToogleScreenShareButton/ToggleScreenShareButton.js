import React from "react";
import { makeStyles } from "src/styles/makeStyles";
import Button from "@mui/material/Button";
import ScreenShareIcon from "../../../icons/ScreenShareIcon";
import Tooltip from "@mui/material/Tooltip";

import useScreenShareParticipant from "../../../hooks/useScreenShareParticipant/useScreenShareParticipant";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

export const SCREEN_SHARE_TEXT = "Compartilhar tela";
export const STOP_SCREEN_SHARE_TEXT = "Parar ShareScreen";
export const SHARE_IN_PROGRESS_TEXT =
  "Cannot share screen when another user is sharing";
export const SHARE_NOT_SUPPORTED_TEXT =
  "Screen sharing is not supported with this browser";

const useStyles = makeStyles()((theme) => ({
  button: {
    "&[disabled]": {
      color: "#bbb",
      "& svg *": {
        fill: "#bbb",
      },
    },
  },
}));

export default function ToggleScreenShareButton(props) {
  const { classes } = useStyles();
  const screenShareParticipant = useScreenShareParticipant();
  const { toggleScreenShare } = useVideoContext();
  const disableScreenShareButton = Boolean(screenShareParticipant);
  const isScreenShareSupported =
    navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled =
    props.disabled || disableScreenShareButton || !isScreenShareSupported;

  let tooltipMessage = "";

  if (disableScreenShareButton) {
    tooltipMessage = SHARE_IN_PROGRESS_TEXT;
  }

  if (!isScreenShareSupported) {
    tooltipMessage = SHARE_NOT_SUPPORTED_TEXT;
  }

  return (
    <Tooltip
      title={tooltipMessage}
      placement="top"
      PopperProps={{ disablePortal: true }}
      style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
    >
      <span>
        {/* The span element is needed because a disabled button will not emit hover events and we want to display
          a tooltip when screen sharing is disabled */}
        <Button
          className={classes.button}
          onClick={toggleScreenShare}
          disabled={isDisabled}
          startIcon={<ScreenShareIcon />}
          data-cy-share-screen
        >
          {SCREEN_SHARE_TEXT}
        </Button>
      </span>
    </Tooltip>
  );
}
