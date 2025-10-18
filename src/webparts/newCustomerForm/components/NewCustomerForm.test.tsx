// jest.mock calls must come first
jest.mock('NewCustomerFormWebPartStrings', () => ({
  FormAlertCustomerAdded: 'Customer {0} ({1}) added successfully.',
  FormErrorRequiredFields: 'Required fields missing.',
  FormErrorNameRequired: 'Name is required',
  FormErrorEmailRequired: 'Email is required',
  FormErrorCompanyRequired: 'Company is required',
  FormErrorSocialHandleFormat: 'Social handle must start with @',
  WelcomeTitle: 'Welcome, {0}!'
}));

jest.mock('@fluentui/react');

jest.mock('@fluentui/react', () => {
  const original = jest.requireActual('@fluentui/react');
  const ReactImport = require('react'); // eslint-disable-line @typescript-eslint/no-var-requires
  return {
    ...original,
    MessageBar: ReactImport.forwardRef(
      (props: { children?: React.ReactNode }, ref: React.Ref<HTMLDivElement>) =>
        <div ref={ref}>{props.children}</div>
    )
  };
});

import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewCustomerForm from './NewCustomerForm';
import { initializeIcons } from '@fluentui/react';

const baseProps = {
  userDisplayName: 'Test User'
};

beforeAll(() => {
  initializeIcons();
});

describe('NewCustomerForm Component', () => {
  it('renders all customer fields', () => {
    render(<NewCustomerForm {...baseProps} />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Add Customer/i })).toBeInTheDocument();
  });

  it('handles input and submit when required fields are filled', () => {
    window.alert = jest.fn();
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: 'VIP customer' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(
      screen.getByText((content, element) =>
        typeof content === 'string' && content.indexOf('Customer John Doe (john@example.com) added successfully') !== -1
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Company/i)).toHaveValue('');
    expect(screen.getByLabelText(/Phone/i)).toHaveValue('');
    expect(screen.getByLabelText(/Address/i)).toHaveValue('');
    expect(screen.getByLabelText(/Notes/i)).toHaveValue('');

  });

  it('shows error message only for missing field when submitting blank form', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Name is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Email is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Company is required/i).length).toBeGreaterThan(0);
  });


  it('shows error message only for missing Name', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Corp' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Name is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Email is required/i).length).toBe(0);
    expect(screen.queryAllByText(/Company is required/i).length).toBe(0);
  });

  it('shows error message only for missing Email', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Corp' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Email is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Name is required/i).length).toBe(0);
    expect(screen.queryAllByText(/Company is required/i).length).toBe(0);
  });

  it('shows error message only for missing Company', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Company is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Name is required/i).length).toBe(0);
    expect(screen.queryAllByText(/Email is required/i).length).toBe(0);
  });
});
