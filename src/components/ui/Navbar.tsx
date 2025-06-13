"use client";

import React from 'react';
import { CCButton, FFCSButton, ZButton } from './Buttons';
import { useRouter } from 'next/navigation';

type NavbarProps = {
  page: "landing" | "404" | "slots" | "saved" | "phone";
  loggedin: boolean;
};

export function Navbar({ page, loggedin = false }: NavbarProps) {
  const router = useRouter();
  return (<div className="absolute top-0 left-0 w-full z-10 select-none">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

        {/* B1: CC or FFCS button */}
        {(page === 'landing' || page === '404') && (
          <CCButton />
        )}
        {(page === 'slots' || page === 'saved') && (
          <FFCSButton />
        )}

        {/* B2: Slots or Text */}
        {(page === 'landing' || page === '404') && (
          <ZButton
            type="long"
            text="Slot View"
            color="yellow"
            onClick={() => router.push('/slots')}
          />
        )}
        {(page === 'slots' || page === 'saved') && (
          <div
            className="text-4xl font-[pangolin] cursor-pointer"
            onClick={() => router.push('/')}
          >
            FFCS-inator
          </div>
        )}

      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

        {/* B3: Slots or Saved */}
        {(page === 'landing' || page === '404' || page == 'slots') && (
          <ZButton
            type="long"
            text="Saved Timetables"
            color='blue'
            onClick={() => router.push('/saved')}
          />
        )}
        {(page === 'saved') && (
          <ZButton
            type="long"
            text="Slot View"
            color="yellow"
            onClick={() => router.push('/slots')}
          />
        )}

        {/* B4: Login Logout */}
        {(page === 'landing' || page === '404' || page == 'slots') && (!loggedin) && (
          <ZButton
            type="long"
            text="Log In"
            color='green'
            onClick={() => router.push('/login')}
          />
        )}
        {((page === 'saved') || ((page === 'landing' || page === '404' || page == 'slots') && (loggedin))) && (
          <ZButton
            type="long"
            text="Log Out"
            color="red"
            onClick={() => router.push('/logout')}
          />
        )}

      </div>
    </div>
  </div>
  );
}
