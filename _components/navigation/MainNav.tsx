import Link from "next/link";
import NavList from "./NavList";

export default function MainNav() {
  const accountNav = [
    {
      name: "Overview",
      href: "/",
    },
    {
      name: "Projects",
      href: "/projects",
    },
    {
      name: "All Updates",
      href: "/updates",
    },
    {
      name: "Impact Indicators",
      href: "/impact",
    },
    {
      name: "Funding Requests",
      href: "/fundingrequests",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pr-4 pb-3 flex justify-between items-center">
      <NavList items={accountNav} />
      <Link
        href="/newupdate"
        className="px-4 py-2 flex justify-between items-center gap-2 text-sm rounded-md bg-btn-background hover:bg-btn-background-hover transition-all duration-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className=""
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>{" "}
        <span>Add Update</span>
      </Link>
    </div>
  );
}
