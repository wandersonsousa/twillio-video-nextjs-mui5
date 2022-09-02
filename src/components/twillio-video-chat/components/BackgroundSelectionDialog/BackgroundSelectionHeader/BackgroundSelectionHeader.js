import React from 'react';
import { makeStyles } from 'src/styles/makeStyles';
import CloseIcon from '../../../icons/CloseIcon';

const useStyles = makeStyles()(() => ({
  container: {
    minHeight: '56px',
    background: '#F4F4F6',
    borderBottom: '1px solid #E4E7E9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1em',
  },
  text: {
    fontWeight: 'bold',
  },
  closeBackgroundSelection: {
    cursor: 'pointer',
    display: 'flex',
    background: 'transparent',
    border: '0',
    padding: '0.4em',
  },
}));

export default function BackgroundSelectionHeader({ onClose }) {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.text}>Backgrounds</div>
      <button className={classes.closeBackgroundSelection} onClick={onClose}>
        <CloseIcon />
      </button>
    </div>
  );
}
