'use client'; // คำสั่งนี้เพื่อให้คอมโพเนนต์เป็น client component

import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
