import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#CEE4E5] text-black relative overflow-hidden flex items-center flex-col">

      <div className="px-8 py-8 sm:py-6 xs:py-4 flex flex-col md:flex-row items-start justify-between relative z-10 w-full bg-[#A7D5D7] border-t-2 border-black gap-y-6">
        <div>
          <h2 className="text-6xl font-normal mb-4 font-[pangolin] md:text-4xl lg:text-6xl">FFCS-inator</h2>
          <div className="flex gap-5">
            {[
              {
                href: "https://www.facebook.com/codechefvit/",
                src: "/meta.svg",
                alt: "Facebook",
              },
              {
                href: "https://x.com/codechefvit",
                src: "/twitter.svg",
                alt: "Twitter",
              },
              {
                href: "https://github.com/CodeChefVIT",
                src: "/github.svg",
                alt: "Github",
              },
              {
                href: "https://www.instagram.com/codechefvit/",
                src: "/instagram.svg",
                alt: "Instagram",
              },
              {
                href: "https://www.linkedin.com/company/codechefvit/mycompany/",
                src: "/linkedin.svg",
                alt: "LinkedIn",
              },
            ].map(({ href, src, alt }) => (
              <a href={href} key={src} target="_blank">
                <Image
                  src={src}
                  alt={alt}
                  width={26}
                  height={26}
                />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-poppins font-semibold mb-2 text-2xl md:text-xl lg:text-2xl">About Us</h3>
          <ul className="space-y-1">
            <li><a href="https://www.codechefvit.com/" target="_blank">CodeChef-VIT</a></li>
            <li><a href="https://www.codechefvit.com/board">Meet The Team</a></li>
            <li><a href="https://www.codechefvit.com/blog">Blogs</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-poppins font-semibold mb-2 text-2xl md:text-xl lg:text-2xl">Our Projects</h3>
          <ul className="space-y-1">
            <li><a href="#">Brainrot Arcade</a></li>
            <li><a href="#">FFCS-inator</a></li>
            <li><a href="https://papers.codechefvit.com/" target="_blank">Papers</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-2xl md:text-xl lg:text-2xl">Get Updates :)</h3>
          <div className="flex items-center gap-2">
            <div className="bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3">
              <input
                type="email"
                placeholder="Your email address"
                className="text-sm bg-transparent outline-none placeholder:text-black/50 w-full"
              />
            </div>
            <button className="bg-[#90BDFF] border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-13 h-13 flex items-center justify-center shrink-0">
              <Image src="/bell.svg" alt="Bell" width={23} height={23} />
            </button>

          </div>
        </div>
      </div>

      <div className="font-poppins font-semibold text-xl text-center py-4 bg-[#A7D5D7] w-full">
        Made with ❤ by CodeChef–VIT
      </div>
    </footer>
  );
}
