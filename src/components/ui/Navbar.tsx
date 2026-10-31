'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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

// Navbar buttons get smaller below xl so the row fits.
const navButton = 'shrink-0 whitespace-nowrap max-xl:h-10 max-xl:px-3 max-xl:text-sm';

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
        <div className="flex flex-wrap justify-between max-xl:justify-start items-center gap-4 max-xl:gap-2 p-4">
          <div className="flex flex-1 gap-4 items-center max-xl:contents">
            {(page === 'landing' || page === '404' || page === 'placeholder') && (
              <>
                <span className="shrink-0 max-xl:[&_img]:w-14">
                  <CCButton />
                </span>

                <ZButton
                  type="long"
                  className={navButton}
                  text="Slot View"
                  color="yellow"
                  onClick={() => router.push('/slots')}
                />

                {onSchoolClick && (
                  <div className="relative shrink-0">
                    <ZButton
                      type="long"
                      text={school}
                      forceColor="#FFFFFF"
                      image="/icons/chevron_down.svg"
                      imageSize={10}
                      onClick={onSchoolClick}
                      className={navButton}
                    />
                    {vtopOn && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-black bg-ffcs-violet" />
                    )}
                  </div>
                )}
              </>
            )}
            {onSchoolClick && !vtopOn && (
              <div className="mx-5 flex items-center max-xl:order-first max-xl:mx-0 max-xl:basis-full max-xl:justify-center">
                <div className="flex max-w-[34rem] items-center gap-3 rounded-2xl border-3 border-black bg-ffcs-violet py-2 pl-3 pr-5 font-poppins text-sm font-medium text-black shadow-hard">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-ffcs-yellow">
                    <Image src="/icons/qmark.svg" width={14} height={14} alt="" draggable={false} />
                  </span>
                  <p>
                    Can&apos;t find faculty for your branch? Choose <b>My VTOP</b> to fetch
                    faculties straight from your VTOP.
                  </p>
                </div>
              </div>
            )}

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

          <div className="flex gap-4 max-xl:gap-2 items-center max-xl:ml-auto">
            {(page === 'landing' || page === '404' || page === 'shared' || page === 'slots') && (
              <ZButton
                type="long"
                className={navButton}
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
                className={navButton}
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
                  className={navButton}
                  text="Log In"
                  color="green"
                  onClick={() => setShowLoginPopup(true)}
                />
              ) : (
                <ZButton
                  type="long"
                  className={navButton}
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
