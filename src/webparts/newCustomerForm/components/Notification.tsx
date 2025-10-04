import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';

export interface NotificationProps {
  message: string;
  type?: MessageBarType;
  onDismiss?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = MessageBarType.success, onDismiss }) => (
  <MessageBar
    messageBarType={type}
    isMultiline={false}
    onDismiss={onDismiss}
    dismissButtonAriaLabel="Close"
    data-testid="customer-notification"
  >
    {message}
  </MessageBar>
);

export default Notification;
