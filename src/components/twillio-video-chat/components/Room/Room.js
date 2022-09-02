import React, { useEffect, useRef } from 'react';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import ChatWindow from '../ChatWindow/ChatWindow';
import { GalleryView } from '../GalleryView/GalleryView';
import { MobileGalleryView } from '../MobileGalleryView/MobileGalleryView';
import MainParticipant from '../MainParticipant/MainParticipant';
import { useMediaQuery, useTheme } from '@mui/material';
import { ParticipantAudioTracks } from '../ParticipantAudioTracks/ParticipantAudioTracks';
import ParticipantList from '../ParticipantList/ParticipantList';
import { useAppState } from '../../state';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { makeStyles } from 'src/styles/makeStyles';

const useStyles = makeStyles()(theme => {
  const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth}px`;
  return {
    container: {
      position: 'relative',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
      gridTemplateRows: '100%',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: `100%`,
        gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
      },
    },
    rightDrawerOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px` },
  };
});

/**
 * This hook turns on speaker view when screensharing is active, regardless of if the
 * user was already using speaker view or gallery view. Once screensharing has ended, the user's
 * view will return to whatever they were using prior to screenshare starting.
 */

export function useSetSpeakerViewOnScreenShare(
  screenShareParticipant,
  room,
  setIsGalleryViewActive,
  isGalleryViewActive
) {
  const isGalleryViewActiveRef = useRef(isGalleryViewActive);

  // Save the user's view setting whenever they change to speaker view or gallery view:
  useEffect(() => {
    isGalleryViewActiveRef.current = isGalleryViewActive;
  }, [isGalleryViewActive]);

  useEffect(() => {
    if (screenShareParticipant && screenShareParticipant !== room.localParticipant) {
      // When screensharing starts, save the user's previous view setting (speaker or gallery):
      const prevIsGalleryViewActive = isGalleryViewActiveRef.current;
      // Turn off gallery view so that the user can see the screen that is being shared:
      setIsGalleryViewActive(false);
      return () => {
        // If the user was using gallery view prior to screensharing, turn gallery view back on
        // once screensharing stops:
        if (prevIsGalleryViewActive) {
          setIsGalleryViewActive(prevIsGalleryViewActive);
        }
      };
    }
  }, [screenShareParticipant, setIsGalleryViewActive, room]);
}

export default function Room() {
  const { classes, cx } = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { isBackgroundSelectionOpen, room } = useVideoContext();
  const { isGalleryViewActive, setIsGalleryViewActive } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const screenShareParticipant = useScreenShareParticipant();

  // Here we switch to speaker view when a participant starts sharing their screen, but
  // the user is still free to switch back to gallery view.
  useSetSpeakerViewOnScreenShare(screenShareParticipant, room, setIsGalleryViewActive, isGalleryViewActive);

  return (
    <div
      className={cx(classes.container, {
        [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
      })}
    >
      {/* 
        This ParticipantAudioTracks component will render the audio track for all participants in the room.
        It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
        unnecessarily unmounted/mounted as the user switches between Gallery View and speaker View.
      */}
      <ParticipantAudioTracks />

      {isGalleryViewActive ? (
        isMobile ? (
          <MobileGalleryView />
        ) : (
          <GalleryView />
        )
      ) : (
        <>
          <MainParticipant />
          <ParticipantList />
        </>
      )}

      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
