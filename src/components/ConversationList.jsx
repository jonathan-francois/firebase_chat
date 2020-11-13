import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  subscribeContactsAction,
  subscribeConversationsList,
  unsubscribeContactsAction,
} from '../store/actions';
import {
  contactsSelector,
  conversationsListSelector,
  userSelector,
} from '../store/selectors';
import Contact from './Contact';

function ConversationList() {
  const user = useSelector(userSelector);
  const contacts = useSelector(contactsSelector);
  const conversationsList = useSelector(conversationsListSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subscribeContactsAction());
    dispatch(subscribeConversationsList());

    return () => {
      dispatch(unsubscribeContactsAction());
    };
  }, []);

  return (
    <ul className="divide-y-2 divide-opacity-50 divide-red-600 bg-red-200 border-r-2 border-red-600 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 h-screen overflow-y-auto p-2">
      {conversationsList.map((convo) => {
        // First contact that isn't the current user
        const contactUid = convo.userList.find((uid) => uid !== user.uid);
        const contact = contacts.find((c) => c.uid === contactUid);

        return (
          <li key={convo.uid_conv}>
            <Contact
              name={contact.displayName}
              image={contact.photoURL}
              isOnline={contact.isOnline}
              unreadCount={convo.unread}
              link={`/messages/${convo.uid_conv}`}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ConversationList;