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
    userDisplayName,
    environment
  } = props;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [customerSector, setCustomerSector] = useState('');
  const [requiresNDA, setRequiresNDA] = useState(false);

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
  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const sector = e.target.value;
    setCustomerSector(sector);
    // Reset NDA checkbox when sector changes
    setRequiresNDA(false);
  };
  const handleNDAChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRequiresNDA(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setTouched({ name: true, email: true, company: true });
    if (!customerName || !customerEmail || !customerCompany) {
      setError(strings.FormErrorRequiredFields);
      return;
    }

    // Create customer data object with NDA logic
    const customerData = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      address: customerAddress,
      company: customerCompany,
      notes: customerNotes,
      sector: customerSector,
      requiresNDA: customerSector === 'Government' ? requiresNDA : false
    };

    // For demonstration purposes, we'll just log the customer data
    console.log('Customer data:', customerData);

    setError('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerAddress('');
    setCustomerCompany('');
    setCustomerNotes('');
    setCustomerSector('');
    setRequiresNDA(false);

    setTouched({ name: false, email: false, company: false });
    setNotification(strings.FormAlertCustomerAdded.replace('{0}', customerName).replace('{1}', customerEmail));
  };

  return (
    <section className={styles.newCustomerForm} data-testid="new-customer-form-section">
      {notification && (
        <Notification
          message={notification}
          type={MessageBarType.success}
          onDismiss={() => setNotification(null)}
        />
      )}
      <div className={styles.welcome}>
        <h2>{strings.WelcomeTitle.replace('{0}', escape(userDisplayName))}</h2>
        {environment && environment.toLowerCase() !== 'prod' && (
          <div 
            style={{ marginTop: '1rem' }} 
            data-testid="environment-badge"
          >
            <span 
              style={{ 
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                backgroundColor: '#0078d4', // Always blue for non-prod environments
                color: '#ffffff'
              }}
            >
              {environment}
            </span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className={styles.customerForm} data-testid="customer-form">
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
          <label htmlFor="customerSector">{strings.FormLabelCustomerSector}</label>
          <select id="customerSector" value={customerSector} onChange={handleSectorChange} className={styles.input}>
            <option value="">Select sector...</option>
            <option value="Non profit">{strings.FormSectorNonProfit}</option>
            <option value="Private">{strings.FormSectorPrivate}</option>
            <option value="Government">{strings.FormSectorGovernment}</option>
          </select>
        </div>

        {customerSector === 'Government' && (
          <div className={styles.formRow}>
            <label htmlFor="requiresNDA">
              <input 
                id="requiresNDA" 
                type="checkbox" 
                checked={requiresNDA} 
                onChange={handleNDAChange} 
              />
              {strings.FormLabelRequiresNDA}
            </label>
          </div>
        )}

        <div className={styles.formRow}>
          <label htmlFor="customerNotes">Notes</label>
          <textarea id="customerNotes" value={customerNotes} onChange={handleNotesChange} className={styles.textarea} />
        </div>
        <button type="submit" className={styles.submitBtn} data-testid="submit-button">Add Customer</button>
      </form>
    </section>
  );
}

export default NewCustomerForm;
