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
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, company: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCustomerName(e.target.value);
    setTouched(t => ({ ...t, name: true }));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCustomerEmail(e.target.value);
    setTouched(t => ({ ...t, email: true }));
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCustomerPhone(e.target.value);
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCustomerAddress(e.target.value);
  };
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCustomerCompany(e.target.value);
    setTouched(t => ({ ...t, company: true }));
  };
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setCustomerNotes(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setTouched({ name: true, email: true, company: true });
    if (!customerName || !customerEmail || !customerCompany) {
      setError('Name, Email, and Company are required.');
      return;
    }
    setError('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerAddress('');
    setCustomerCompany('');
    setCustomerNotes('');
    setTouched({ name: false, email: false, company: false });
    alert(`Customer added: ${customerName} (${customerEmail})`);
  };

  return (
    <section className={`${styles.helloWorld} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
        <h2>Well done, {escape(userDisplayName)}!</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.customerForm}>
        {error && <div className={styles.formError}>{error}</div>}
        <div className={styles.formRow}>
          <label htmlFor="customerName">Name<span className={styles.required}>*</span></label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={handleInputChange}
            placeholder="Enter customer name"
            className={styles.input}
          />
          {touched.name && !customerName && (
            <span className={styles.fieldError}>Name is required.</span>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerEmail">Email<span className={styles.required}>*</span></label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={handleEmailChange}
            placeholder="Enter customer email"
            className={styles.input}
          />
          {touched.email && !customerEmail && (
            <span className={styles.fieldError}>Email is required.</span>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerPhone">Phone:</label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            className={styles.input}
          />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerAddress">Address:</label>
          <input
            id="customerAddress"
            type="text"
            value={customerAddress}
            onChange={handleAddressChange}
            placeholder="Enter address"
            className={styles.input}
          />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerCompany">Company<span className={styles.required}>*</span></label>
          <input
            id="customerCompany"
            type="text"
            value={customerCompany}
            onChange={handleCompanyChange}
            placeholder="Enter company"
            className={styles.input}
          />
          {touched.company && !customerCompany && (
            <span className={styles.fieldError}>Company is required.</span>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerNotes">Notes:</label>
          <textarea
            id="customerNotes"
            value={customerNotes}
            onChange={handleNotesChange}
            placeholder="Additional notes"
            className={styles.textarea}
          />
        </div>
        <button type="submit" className={styles.submitBtn}>Add Customer</button>
      </form>
    </section>
  );
}

export default HelloWorld;
