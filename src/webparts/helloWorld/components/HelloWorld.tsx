import * as React from 'react';
import styles from './HelloWorld.module.scss';
import type { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useState } from 'react';

const HelloWorld: React.FC<IHelloWorldProps> = (props) => {
  const {
    hasTeamsContext,
    userDisplayName
  } = props;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCustomerName(e.target.value);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCustomerEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Add logic to save customer data
    alert(`Customer added: ${customerName} (${customerEmail})`);
    setCustomerName('');
    setCustomerEmail('');
  };

  return (
    <section className={`${styles.helloWorld} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
        <h2>Well done, {escape(userDisplayName)}!</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">New Customer Name:</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={handleInputChange}
            placeholder="Enter customer name"
            style={{ marginLeft: '0.5em' }}
          />
        </div>
        <div>
          <label htmlFor="customerEmail">Email:</label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={handleEmailChange}
            placeholder="Enter customer email"
            style={{ marginLeft: '0.5em' }}
          />
        </div>
        <button type="submit" style={{ marginLeft: '0.5em' }}>Add Customer</button>
      </form>
    </section>
  );
}

export default HelloWorld;
