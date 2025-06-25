"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CCButton, ZButton } from "./Buttons";
import AlertModal from "./AlertModal";
import { useSession } from "next-auth/react";

export default function Footer({ type }: { type?: "desktop" | "mobile" }) {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    color: "",
  });

  useEffect(() => {
    if (session && session.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubscribe = async () => {
    if (!email || isSubscribing) return;

    try {
      setIsSubscribing(true);
      const response = await fetch("/api/collect-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setAlertState({
          open: true,
          message: "Thanks for subscribing!",
          color: "green",
        });
        setEmail(session?.user?.email || "");
      } else {
        setAlertState({
          open: true,
          message: "Failed to subscribe. Please try again.",
          color: "red",
        });
      }
    } catch {
      setAlertState({
        open: true,
        message: "Something went wrong. Please try again.",
        color: "red",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (type === "mobile") {
    return (
      <footer className="w-full bg-[#CEE4E5] text-center mt-auto relative overflow-hidden">
        {/* Foreground */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-12 pb-4 px-4">
          <div className="mb-4">
            <CCButton />
          </div>
          <p className="text-sm text-black font-poppins font-semibold">
            Made with <span className="font-[inter]">❤</span> by CodeChef-VIT
          </p>
        </div>

        {/* Background */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <Image
            src="/art/footer_mobile.svg"
            alt="Wave Design"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
            unselectable="on"
            draggable={false}
          />
        </div>

        <AlertModal
          open={alertState.open}
          onClose={() => setAlertState({ ...alertState, open: false })}
          message={alertState.message}
          color={alertState.color}
        />
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#CEE4E5] font-[poppins] text-black relative overflow-hidden flex items-center flex-col select-none">
      <div className="px-8 py-8 sm:py-6 xs:py-4 flex flex-col md:flex-row items-start justify-between relative z-10 w-full bg-[#A7D5D7] border-t-2 border-black gap-y-6">
        <div>
          <h2 className="text-6xl font-normal mb-4 font-[pangolin] md:text-4xl lg:text-6xl">
            FFCS-inator
          </h2>
          <div className="flex gap-5">
            {[
              {
                href: "https://www.facebook.com/codechefvit/",
                src: "/social/meta.svg",
                alt: "Facebook",
              },
              {
                href: "https://x.com/codechefvit",
                src: "/social/twitter.svg",
                alt: "Twitter",
              },
              {
                href: "https://github.com/CodeChefVIT",
                src: "/social/github.svg",
                alt: "Github",
              },
              {
                href: "https://www.linkedin.com/company/codechefvit/mycompany/",
                src: "/social/linkedin.svg",
                alt: "LinkedIn",
              },
              {
                href: "https://www.instagram.com/codechefvit/",
                src: "/social/instagram.svg",
                alt: "Instagram",
              },
            ].map(({ href, src, alt }) => (
              <a
                href={href}
                key={src}
                target="_blank"
                rel="noopener"
                title={`Follow us on ${alt}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={26}
                  height={26}
                  unselectable="on"
                  draggable={false}
                  priority
                />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-poppins font-semibold mb-2 text-2xl md:text-xl lg:text-2xl">
            About Us
          </h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.codechefvit.com/"
                target="_blank"
                rel="noopener"
              >
                CodeChef-VIT
              </a>
            </li>
            <li>
              <a
                href="https://www.codechefvit.com/board"
                target="_blank"
                rel="noopener"
              >
                Meet The Team
              </a>
            </li>
            <li>
              <a
                href="https://www.codechefvit.com/blog"
                target="_blank"
                rel="noopener"
              >
                Blogs
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-poppins font-semibold mb-2 text-2xl md:text-xl lg:text-2xl">
            Our Projects
          </h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://contactify.codechefvit.com/"
                target="_blank"
                rel="noopener"
              >
                Contactify
              </a>
            </li>
            <li>
              <a
                href="https://papers.codechefvit.com/"
                target="_blank"
                rel="noopener"
              >
                Papers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-2xl md:text-xl lg:text-2xl">
            Get Updates :)
          </h3>
          <div className="flex items-center gap-2">
            <div className="bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3">
              <input
                type="email"
                placeholder="Your email address"
                className="text-sm bg-transparent outline-none placeholder:text-black/50 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
            </div>

            <ZButton
              type="image"
              color="purple"
              image="/icons/bell.svg"
              onClick={handleSubscribe}
              disabled={isSubscribing}
            />
          </div>
        </div>
      </div>

      <div className="font-poppins font-semibold text-xl text-center py-4 bg-[#A7D5D7] w-full">
        Made with <span className="font-[inter]">❤</span> by CodeChef–VIT
      </div>

      
      <AlertModal
        open={alertState.open}
        onClose={() => setAlertState({ ...alertState, open: false })}
        message={alertState.message}
        color={alertState.color}
      />
    </footer>
  );
}
