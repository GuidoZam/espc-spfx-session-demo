import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HelloWorld from './HelloWorld';

const baseProps = {
  hasTeamsContext: false,
  userDisplayName: 'Test User',
  description: '',
  isDarkTheme: false,
  environmentMessage: ''
};

describe('HelloWorld Component', () => {
  it('renders form fields', () => {
    render(<HelloWorld {...baseProps} />);
    expect(screen.getByLabelText(/New Customer Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Customer/i })).toBeInTheDocument();
  });

  it('handles input and submit', () => {
    window.alert = jest.fn();
    render(<HelloWorld {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/New Customer Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(window.alert).toHaveBeenCalledWith('Customer added: John Doe (john@example.com)');
  });
});
