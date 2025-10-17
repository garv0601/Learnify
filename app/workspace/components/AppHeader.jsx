"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';

function AppHeader({ hideSidebar = false }) {
  const router = useRouter();
  const pathname = usePathname();

  const isOnWorkspace = pathname?.startsWith('/workspace');

  return (
    <div className="p-4 flex justify-between items-center border-b border-b-slate-200 shadow-sm flex-wrap sm:flex-nowrap">
      {/* Left section: Sidebar + UserButton */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {!hideSidebar && <SidebarTrigger />}
        <UserButton className="flex-shrink-0" />
      </div>

      {/* Right section: Show Workspace button only if NOT on workspace */}
      {!isOnWorkspace && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => router.push('/workspace')}
          aria-label="Go to Workspace"
          className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-full shadow-md flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span className="font-medium">Workspace</span>
        </motion.button>
      )}
    </div>
  );
}

export default AppHeader;
