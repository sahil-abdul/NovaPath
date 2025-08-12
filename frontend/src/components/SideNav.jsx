import HomeIcon from "@mui/icons-material/Home";

import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, NavLink } from "react-router-dom";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

function SideNav({ isDetail = false }) {
  return (
    <>
      <ul className="flex justify-around gap-y-2 sm:sticky sm:top-[106px] sm:min-h-[calc(100vh-130px)] sm:flex-col">
        <Link to="/">
          <li className="">
            <button className="flex flex-col items-center justify-center border-white py-1 sm:w-full  sm:flex-row sm:border sm:p-1.5  sm:hover:text-black sm:focus:border-[#ae7aff] s sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <HomeIcon />
              </span>
              <span
                className={`block sm:hidden sm:group-hover:inline ${
                  isDetail ? "" : "lg:inline"
                }`}
              >
                Home
              </span>
            </button>
          </li>
        </Link>
        <Link to="/dashboard">
          <li className="hidden sm:block">
            <button className="flex flex-col items-center justify-center border-white py-1  sm:w-full sm:flex-row sm:border sm:p-1.5  sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <DashboardCustomizeIcon />
              </span>
              <span
                className={`block sm:hidden sm:group-hover:inline ${
                  isDetail ? "" : "lg:inline"
                }`}
              >
                Dashboard
              </span>
            </button>
          </li>
        </Link>

        <NavLink to="/MyContent">
          <li className="hidden sm:block">
            <button className="flex flex-col items-center justify-center border-white py-1  sm:w-full sm:flex-row sm:border sm:p-1.5  sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <ContentPasteSearchIcon />
              </span>
              <span
                className={`block sm:hidden sm:group-hover:inline ${
                  isDetail ? "" : "lg:inline"
                }`}
              >
                My Content
              </span>
            </button>
          </li>
        </NavLink>

        <NavLink to="/tweets">
          <li className="">
            <button className="flex flex-col items-center justify-center border-white py-1  sm:w-full sm:flex-row sm:border sm:p-1.5  sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <GroupOutlinedIcon />
              </span>
              <span
                className={`block sm:hidden sm:group-hover:inline ${
                  isDetail ? "" : "lg:inline"
                }`}
              >
                Tweets
              </span>
            </button>
          </li>
        </NavLink>
        <NavLink to="/setting">
          <li className="hidden sm:block">
            <button className="flex flex-col items-center justify-center border-white py-1  sm:w-full sm:flex-row sm:border sm:p-1.5  sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <SettingsIcon />
              </span>
              <span
                className={`block sm:hidden sm:group-hover:inline ${
                  isDetail ? "" : "lg:inline"
                }`}
              >
                Settings
              </span>
            </button>
          </li>
        </NavLink>
        
        <li className="hidden sm:block mt-auto">
        <NavLink to = "/Privacy-Policy">
          <button className="flex flex-col items-center justify-center border-white py-1  sm:w-full sm:flex-row sm:border sm:p-1.5  sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4">
            <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
              <HelpIcon />
            </span>
            <span
              className={`block sm:hidden sm:group-hover:inline ${
                isDetail ? "" : "lg:inline"
              }`}
            >
              Privacy Policy
            </span>
          </button>
        </NavLink>
        </li>
      </ul>
    </>
  );
}

export default SideNav;
