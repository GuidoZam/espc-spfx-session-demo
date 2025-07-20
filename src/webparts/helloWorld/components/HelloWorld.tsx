import * as React from 'react';
import styles from './HelloWorld.module.scss';
import type { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useState } from 'react';
import * as strings from 'HelloWorldWebPartStrings';

const HelloWorld: React.FC<IHelloWorldProps> = (props) => {
  const {
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
      setError(strings.FormErrorRequiredFields);
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
    alert(strings.FormAlertCustomerAdded.replace('{0}', customerName).replace('{1}', customerEmail));
  };

  return (
    <section className={styles.helloWorld}>
      <div className={styles.welcome}>
        <h2>{strings.WelcomeTitle.replace('{0}', escape(userDisplayName))}</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.customerForm}>
        {error && <div className={styles.formError}>{error}</div>}
        <div className={styles.formRow}>
          <label htmlFor="customerName">{strings.FormLabelName}<span className={styles.required}>{strings.FormRequired}</span></label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={handleInputChange}
            placeholder={strings.FormPlaceholderName}
            className={styles.input}
          />
          {touched.name && !customerName && (
            <span className={styles.fieldError}>{strings.FormErrorNameRequired}</span>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerEmail">{strings.FormLabelEmail}<span className={styles.required}>{strings.FormRequired}</span></label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={handleEmailChange}
            placeholder={strings.FormPlaceholderEmail}
            className={styles.input}
          />
          {touched.email && !customerEmail && (
            <span className={styles.fieldError}>{strings.FormErrorEmailRequired}</span>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerPhone">{strings.FormLabelPhone}</label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={handlePhoneChange}
            placeholder={strings.FormPlaceholderPhone}
            className={styles.input}
          />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerAddress">{strings.FormLabelAddress}</label>
          <input
            id="customerAddress"
            type="text"
            value={customerAddress}
            onChange={handleAddressChange}
            placeholder={strings.FormPlaceholderAddress}
            className={styles.input}
          />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerCompany">{strings.FormLabelCompany}<span className={styles.required}>{strings.FormRequired}</span></label>
          <input
            id="customerCompany"
            type="text"
            value={customerCompany}
            onChange={handleCompanyChange}
            placeholder={strings.FormPlaceholderCompany}
            className={styles.input}
          />
          {touched.company && !customerCompany && (
            <span className={styles.fieldError}>{strings.FormErrorCompanyRequired}</span>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerNotes">{strings.FormLabelNotes}</label>
          <textarea
            id="customerNotes"
            value={customerNotes}
            onChange={handleNotesChange}
            placeholder={strings.FormPlaceholderNotes}
            className={styles.textarea}
          />
        </div>
        <button type="submit" className={styles.submitBtn}>{strings.FormButtonAddCustomer}</button>
      </form>
    </section>
  );
}

export default HelloWorld;
