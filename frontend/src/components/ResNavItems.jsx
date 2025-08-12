import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import { Link } from "react-router";

function ResNavItems() {
  return (
    <>
      <ul className="my-4 flex w-full flex-wrap gap-2 px-4  sm:hidden">
        <Link to="/dashboard">
          <li className="w-full">
            <button className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
              <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                <DashboardCustomizeIcon />
              </span>
              <span>Dashboard</span>
            </button>
          </li>
        </Link>
        <Link to="/MyContent">
          <li className="w-full">
            <button className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
              <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                <ContentPasteSearchIcon />
              </span>
              <span>My Content</span>
            </button>
          </li>
        </Link>
        <li className="w-full">
          <button className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
            <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
              <HelpIcon />
            </span>
            <span>Support</span>
          </button>
        </li>
        <li className="w-full">
          <button className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
            <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
              <SettingsIcon />
            </span>
            <span>Settings</span>
          </button>
        </li>
      </ul>
    </>
  );
}

export default ResNavItems;
