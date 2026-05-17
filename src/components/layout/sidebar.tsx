"use client";

import { PanelRightIcon, SearchIcon, SquarePenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  {
    icon: SquarePenIcon,
    label: "New Chat",
    href: "/",
  },
  {
    icon: SearchIcon,
    label: "Search Chat",
  },
];

const Sidebar = () => {
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const handleSidebarClick = () => {
    if (!sidebarOpen) {
      setSideBarOpen(true);
      setSidebarHovered(false);
    }
  };

  const handleMouseEnter = () => {
    // Only track mouse enter if sidebar is closed
    if (!sidebarOpen) setSidebarHovered(true);
  };

  const handleMouseLeave = () => {
    // Only track mouse leave if sidebar is closed
    setSidebarHovered(false);
  };

  return (
    <aside
      onClick={handleSidebarClick}
      className={`flex h-screen min-w-12 flex-col items-center ${sidebarOpen ? "w-56" : "w-0 cursor-e-resize"} overflow-y-auto border-r px-2 transition-all duration-200 ease-in-out`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top part */}
      <div
        className={`mt-2 flex w-full items-center justify-between ${sidebarOpen ? "pl-2" : "pl-1"} ${sidebarHovered && "pl-2"}`}
      >
        <button className="h-7 w-7">
          {sidebarHovered ? (
            <PanelRightIcon
              size={20}
              className="text-muted-foreground block cursor-e-resize"
            />
          ) : (
            <Link href="/" className="block h-full w-full">
              <Image
                priority
                src="/logo.png"
                width={50}
                height={50}
                className="h-7 w-7 rounded-full object-contain"
                alt="Logo"
              />
            </Link>
          )}
        </button>

        <button
          className={`relative cursor-e-resize p-2 transition-[opacity,display] [transition-behavior:allow-discrete] duration-200 ease-in-out ${
            sidebarOpen
              ? "opacity-100"
              : "pointer-events-none z-[-1] hidden opacity-0"
          }`}
          onClick={() => setSideBarOpen((prev) => !prev)}
        >
          <PanelRightIcon size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Second top part */}
      <div className={`mt-4 w-full ${sidebarOpen ? "pl-3" : "pl-2"}`}>
        {links.map((link, idx) => {
          return (
            <Link
              key={idx}
              href="/"
              className={`my-1 ${sidebarOpen ? "flex" : "block"} items-center gap-2 py-2`}
            >
              {link.icon && <link.icon size={16} className="" />}

              <span className={`text-sm ${sidebarOpen ? "" : "hidden"}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
