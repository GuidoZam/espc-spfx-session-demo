import * as React from 'react';
import styles from './NewCustomerForm.module.scss';
import type { INewCustomerFormProps } from './INewCustomerFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useState } from 'react';
import * as strings from 'NewCustomerFormWebPartStrings';
import Notification from './Notification';
import { MessageBarType } from '@fluentui/react';

const NewCustomerForm: React.FC<INewCustomerFormProps> = (props) => {
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
  const [notification, setNotification] = useState<string | null>(null);

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
    setNotification(strings.FormAlertCustomerAdded.replace('{0}', customerName).replace('{1}', customerEmail));
  };

  return (
    <section className={styles.newCustomerForm}>
      {notification && (
        <Notification
          message={notification}
          type={MessageBarType.success}
          onDismiss={() => setNotification(null)}
        />
      )}
      <div className={styles.welcome}>
        <h2>{strings.WelcomeTitle}</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.customerForm}>
        {error && <div className={styles.formError}>{error}</div>}
        <div className={styles.formRow}>
          <label htmlFor="customerName">Name<span className={styles.required} /></label>
          <input id="customerName" type="text" value={customerName} onChange={handleInputChange} className={styles.input} />
          {touched.name && !customerName && (
            <span className={styles.fieldError}>{strings.FormErrorNameRequired}</span>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerEmail">Email<span className={styles.required} /></label>
          <input id="customerEmail" type="email" value={customerEmail} onChange={handleEmailChange} className={styles.input} />
          {touched.email && !customerEmail && (
            <span className={styles.fieldError}>{strings.FormErrorEmailRequired}</span>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerPhone">Phone</label>
          <input id="customerPhone" type="tel" value={customerPhone} onChange={handlePhoneChange} className={styles.input} />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerAddress">Address</label>
          <input id="customerAddress" type="text" value={customerAddress} onChange={handleAddressChange} className={styles.input} />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="customerCompany">Company<span className={styles.required} /></label>
          <input id="customerCompany" type="text" value={customerCompany} onChange={handleCompanyChange} className={styles.input} />
          {touched.company && !customerCompany && (
            <span className={styles.fieldError}>{strings.FormErrorCompanyRequired}</span>
          )}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="customerNotes">Notes</label>
          <textarea id="customerNotes" value={customerNotes} onChange={handleNotesChange} className={styles.textarea} />
        </div>
        <button type="submit" className={styles.submitBtn}>Add Customer</button>
      </form>
    </section>
  );
}

export default NewCustomerForm;
