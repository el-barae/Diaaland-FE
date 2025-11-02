'use client';
import { createContext } from 'react';

export interface CustomerContextType {
  token: string | null;
  customerId: number | null;
  customerEmail: string | null;
}

export const CustomerContext = createContext<CustomerContextType>({
  token: null,
  customerId: null,
  customerEmail: null,
});
