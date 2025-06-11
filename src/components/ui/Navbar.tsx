"use client";

import React from 'react';
import { CCButton, FFCSButton, LongButton } from './Buttons';

type NavbarProps = {
  page: "landing" | "404" | "slots" | "saved" | "phone";
  loggedin: boolean;
};

export function Navbar({ page, loggedin = false }: NavbarProps) {
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
          <LongButton
            text="Slot View"
            color="yellow"
            onClick={() => window.location.href = '/slots'}
          />
        )}
        {(page === 'slots' || page === 'saved') && (
          <div className={"text-4xl font-[pangolin]"}>
            FFCS-Inator
          </div>
        )}

      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

        {/* B3: Slots or Saved */}
        {(page === 'landing' || page === '404' || page == 'slots') && (
          <LongButton
            text="Saved Timetables"
            color='blue'
            onClick={() => window.location.href = '/saved'}
          />
        )}
        {(page === 'saved') && (
          <LongButton
            text="Slot View"
            color="yellow"
            onClick={() => window.location.href = '/slots'}
          />
        )}

        {/* B4: Login Logout */}
        {(page === 'landing' || page === '404' || page == 'slots') && (!loggedin) && (
          <LongButton
            text="Log In"
            color='green'
            onClick={() => window.location.href = '/login'}
          />
        )}
        {((page === 'saved') || ((page === 'landing' || page === '404' || page == 'slots') && (loggedin))) && (
          <LongButton
            text="Log Out"
            color="red"
            onClick={() => window.location.href = '/logout'}
          />
        )}

      </div>
    </div>
  </div>
  );
}
