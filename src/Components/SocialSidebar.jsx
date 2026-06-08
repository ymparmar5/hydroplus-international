import React from "react";

const socialLinks = [
  {
    icon: "/facebook.png",
    url: "https://www.facebook.com/people/Hydroplus-International/61576041157055/?mibextid=wwXIfr&rdid=Fbqr3NIgIqq5Eja9&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Hr5PnDc7J%2F%3Fmibextid%3DwwXIfr",
    label: "Facebook",
  },
  {
    icon: "/instagram.png",
    url: "https://www.instagram.com/hydroplus_international_",
    label: "Instagram",
  },
  {
    icon: "/linkedin.png",
    url: "https://in.linkedin.com/in/hydroplus-international-17a643365?original_referer=https%3A%2F%2Fwww.google.com%2F",
    label: "LinkedIn",
  },
  {
    icon: "/youtube.png",
    url: "https://www.youtube.com/@hydroplusinternational",
    label: "YouTube",
  },
  {
    icon: "/whatsapp.png",
    url: "https://wa.me/918000074088",
    label: "WhatsApp",
  },
];


const SocialSidebar = () => {
  return (
    <div
      className="fixed top-1/2 right-0 -translate-y-1/2 z-[1000] 
        sm:top-1/2 sm:right-0 sm:-translate-y-1/2
        top-auto bottom-4 right-2 translate-y-0 sm:bottom-auto sm:right-0"
    >
      <ul className="flex flex-col items-end space-y-2">
        {socialLinks.map((link, index) => (
          <li key={index} className="group relative">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center border-t border-b border-l border-orange-500 rounded-l-full px-1 py-1 shadow-md 
w-6 h-6 hover:w-[140px] sm:w-[35px] sm:h-auto sm:hover:w-[160px] 
transition-all duration-300 overflow-hidden whitespace-nowrap text-white
"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 sm:w-[35px] sm:h-[35px]">
                <img
                  src={link.icon}
                  alt={link.label}
                  className="w-[18px] h-[18px] object-contain sm:w-[25px] sm:h-[25px]"
                />
              </div>
              <span
                className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 hidden sm:inline"
              >
                {link.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialSidebar;
