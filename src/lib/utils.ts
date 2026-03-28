import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserProfile } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function getSubordinateUids(userId: string, allUsers: UserProfile[]): string[] {
  const subordinates = allUsers.filter(u => u.parentUid === userId);
  let uids = subordinates.map(u => u.uid);
  
  for (const sub of subordinates) {
    uids = [...uids, ...getSubordinateUids(sub.uid, allUsers)];
  }
  
  return uids;
}
