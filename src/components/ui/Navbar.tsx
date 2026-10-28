'use client';

import React, { useState } from 'react';
import { CCButton, FFCSButton, ZButton } from './Buttons';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import Popup from './Popup';

type NavbarProps = {
  page: 'landing' | '404' | 'slots' | 'saved' | 'shared' | 'mobile' | 'placeholder';
  school?: string;
  vtopOn?: boolean;
  onSchoolClick?: () => void;
};

export default function Navbar({ page, school, vtopOn, onSchoolClick }: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const loggedin = !!session;
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showLoginPopupSaved, setShowLoginPopupSaved] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  let userName = 'User';
  if (loggedin) {
    userName = (session?.user?.name ?? '').trim().split(' ').slice(0, -1).join(' ') || userName;
  }

  return (
    <>
      {showLoginPopup && (
        <Popup
          type="login"
          closeLink={() => setShowLoginPopup(false)}
          action={() => signIn('google', { callbackUrl: '/', redirect: true })}
        />
      )}
      {showLoginPopupSaved && (
        <Popup
          type="login"
          closeLink={() => setShowLoginPopupSaved(false)}
          action={() => signIn('google', { callbackUrl: '/saved', redirect: true })}
        />
      )}
      {showLogoutPopup && (
        <Popup
          type="logout"
          closeLink={() => setShowLogoutPopup(false)}
          action={() => {
            try {
              localStorage.removeItem('school');
            } catch {
              // Storage is blocked, so there is nothing to forget.
            }
            signOut({ callbackUrl: '/' });
          }}
        />
      )}

      <div className="absolute top-0 left-0 w-full z-10 select-none">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4 items-center">
            {(page === 'landing' || page === '404' || page === 'placeholder') && (
              <>
                <CCButton />

                <ZButton
                  type="long"
                  text="Slot View"
                  color="yellow"
                  onClick={() => router.push('/slots')}
                />

                {onSchoolClick && (
                  <div className="relative">
                    <ZButton
                      type="long"
                      text={school}
                      forceColor="#FFFFFF"
                      image="/icons/chevron_down.svg"
                      imageSize={10}
                      onClick={onSchoolClick}
                      className="whitespace-nowrap"
                    />
                    {vtopOn && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-black bg-ffcs-violet" />
                    )}
                  </div>
                )}
              </>
            )}
            <div className="flex gap-4 mx-5 items-center">
              <div className="rounded-xl bg-[#ffea79] text-black outline-2 outline-black px-6 py-2 text-sm font-medium">
                Can&apos;t find faculty for your branch? Use the my VTOP option to diretly fetch
                faculties from your VTOP.
              </div>
            </div>

            {(page === 'slots' || page === 'saved' || page === 'shared') && (
              <>
                <FFCSButton />

                <div
                  className="text-4xl font-pangolin cursor-pointer"
                  onClick={() => router.push('/')}
                >
                  FFCS-inator
                </div>
              </>
            )}

            {page === 'mobile' && (
              <div
                className="text-3xl font-pangolin cursor-pointer"
                onClick={() => router.push('/')}
              >
                FFCS-inator
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center">
            {(page === 'landing' || page === '404' || page === 'shared' || page === 'slots') && (
              <ZButton
                type="long"
                text="Saved Timetables"
                color="blue"
                onClick={
                  loggedin ? () => router.push('/saved') : () => setShowLoginPopupSaved(true)
                }
              />
            )}

            {page === 'saved' && (
              <ZButton
                type="long"
                text="Slot View"
                color="yellow"
                onClick={() => router.push('/slots')}
              />
            )}

            {(page === 'landing' ||
              page === '404' ||
              page === 'shared' ||
              page === 'saved' ||
              page === 'slots') &&
              (!loggedin ? (
                <ZButton
                  type="long"
                  text="Log In"
                  color="green"
                  onClick={() => setShowLoginPopup(true)}
                />
              ) : (
                <ZButton
                  type="long"
                  text={userName}
                  color="purple"
                  onClick={() => setShowLogoutPopup(true)}
                />
              ))}

            {page === 'mobile' && loggedin && (
              <ZButton
                type="regular"
                text="Log Out"
                color="purple"
                onClick={() => {
                  try {
                    localStorage.removeItem('school');
                  } catch {
                    // Storage is blocked, so there is nothing to forget.
                  }
                  signOut({ callbackUrl: '/' });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
