import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Messages from '../components/Messages';
import SignOut from '../components/SignOut';
import ConversationList from '../components/ConversationList';
import AddConversationButton from '../components/AddConversationButton';
import {
  subscribeContactsAction,
  subscribeConversationsList,
  unsubscribeContactsAction,
  unsubscribeConversationsList,
} from '../store/actions';
import { userSelector } from '../store/selectors';
import { createConversation } from '../utils/utilsFirebase';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 4fr',
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateAreas: `
      "toolbar toolbar"
      "conversations messages"
      "conversations input"`,
    height: '100vh',
  },
  toolbar: {
    gridArea: 'toolbar',
  },
  conversations: {
    gridArea: 'conversations',
    overflowY: 'auto',
  },
  messages: {
    gridArea: 'messages',
  },
  input: {
    gridArea: 'input',
  },
});

function HomePage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const history = useHistory();

  const handleNewConv = (userIds) => {
    const convoUid = createConversation([...userIds, user.uid]);
    history.push(`/messages/${convoUid}`);
  };

  useEffect(() => {
    dispatch(subscribeContactsAction());
    dispatch(subscribeConversationsList());

    return () => {
      dispatch(unsubscribeContactsAction());
      dispatch(unsubscribeConversationsList());
    };
  }, []);

  return (
    <main className={classes.root}>
      <AppBar position="static" className={classes.toolbar}>
        <Toolbar>
          <AddConversationButton handleNewConv={handleNewConv} />
          <Box ml="auto">
            <SignOut />
          </Box>
        </Toolbar>
      </AppBar>

      <Paper className={classes.conversations}>
        <ConversationList />
      </Paper>

      <Route path="/messages/:convoUid">
        <Messages
          messagesClassName={classes.messages}
          inputClassName={classes.input}
        />
      </Route>
    </main>
  );
}

export default HomePage;
