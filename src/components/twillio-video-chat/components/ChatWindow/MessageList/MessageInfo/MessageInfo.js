import React from 'react';
import { makeStyles } from 'src/styles/makeStyles';

const useStyles = makeStyles()(() => ({
  messageInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.425em 0 0.083em',
    fontSize: '12px',
    color: '#606B85',
  },
}));

export default function MessageInfo({ author, dateCreated, isLocalParticipant }) {
  const { classes } = useStyles();

  return (
    <div className={classes.messageInfoContainer}>
      <div>{isLocalParticipant ? `${author} (You)` : author}</div>
      <div>{dateCreated}</div>
    </div>
  );
}
