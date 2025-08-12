import { useSelector } from "react-redux";
import authService from "../srvices/auth.service";
import SearchIcon from "@mui/icons-material/Search";
import SwitchVideoIcon from "@mui/icons-material/SwitchVideo";
import CloseIcon from "@mui/icons-material/Close";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import ResNavItems from "./ResNavItems";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";

function Header() {
  const userData = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
// console.log(user)
  const logout = async (e) => {
    e.preventDefault();
    await authService.logout();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-[#1DCD9F] bg-[#121212] px-4">
        <nav className="mx-auto flex max-w-7xl items-center py-2">
          <div className="mr-4 w-12 shrink-0 sm:w-16">
            <SwitchVideoIcon fontSize="large"></SwitchVideoIcon> 
          </div>
          <div className="relative mx-auto hidden w-full max-w-md overflow-hidden sm:block">
            <input
              className="w-full border rounded-3xl border-[#169976] bg-transparent py-1 pl-8 pr-3 placeholder-white outline-none sm:py-2"
              placeholder="Search"
            />
            <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2 ">
              <SearchIcon />
            </span>
          </div>
          <button className="ml-auto sm:hidden">
            <SearchIcon />
          </button>
          <button className="group peer ml-4 flex justify-center w-6 shrink-0 flex-wrap gap-y-1.5 sm:hidden">
            <DensityMediumIcon />
          </button>
          <div className="fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 translate-x-full flex-col border-l border-white bg-[#121212] duration-200 hover:translate-x-0 peer-focus:translate-x-0 sm:static sm:ml-4 sm:w-auto sm:translate-x-0 sm:border-none">
            <div className="relative flex w-full items-center justify-between border-b border-white px-4 py-2 sm:hidden">
              <span className="inline-block w-12">
                <SwitchVideoIcon fontSize="large" />
              </span>
              <button className="inline-block w-8 items-center justify-center">
                <CloseIcon />
              </button>
            </div>
            <ResNavItems />

            <div className="mb-8 mt-auto flex w-full flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
              {userData ? (
                
                <div className="flex gap-1.5">
                  
                  <div className=" px-4 sm:mb-0 sm:mt-0 sm:px-0">
                    <img
                      src={user?.user?.avatar}
                      alt="React-Patterns"
                      className="h-16 w-16 shrink-0 rounded-full sm:h-12 sm:w-12"
                    />
                  </div>
                  <button
                    className="w-full bg-[#383737] px-3 py-2 sm:w-auto sm:bg-transparent"
                    onClick={logout}
                  >
                    <LogoutIcon className="mr-1" />
                    LogOut
                  </button>
                </div>
              ) : (
                <div>
                  <button className="w-full bg-[#383737] px-3 py-2  sm:w-auto sm:bg-transparent mr-1.5">
                    Log in
                  </button>
                  <button className="w-full bg-[#383737] px-3 py-2 sm:w-auto sm:bg-transparent">
                    sigup
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
