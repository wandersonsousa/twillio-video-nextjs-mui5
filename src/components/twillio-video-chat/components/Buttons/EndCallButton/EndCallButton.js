import React from 'react';
import { makeStyles } from 'src/styles/makeStyles';

import { Button } from '@mui/material';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles()(theme => ({
  button: {
    background: theme.brand,
    color: 'white',
    '&:hover': {
      background: '#600101',
    },
  },
}));

export default function EndCallButton(props) {
  const { classes, cx } = useStyles();
  const { room } = useVideoContext();

  return (
    <Button onClick={() => room.disconnect()} className={cx(classes.button, props.className)} data-cy-disconnect>
      Disconnect
    </Button>
  );
}
