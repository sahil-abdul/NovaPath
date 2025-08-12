import { Outlet } from "react-router";

import { Header, SideNav } from "../components/index";

function Home() {
  return (
    <>
      <div className="h-screen bg-black text-white w-screen">
        <Header />
        <div className=" flex flex-1 min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)] w-full">
          <aside className="fixed m-1.5 group inset-x-0 bottom-0 z-40 w-full shrink-0 border rounded-2xl border-[#1DCD9F] bg-[#121212] px-2 py-2 sm:absolute sm:inset-y-0 sm:max-w-[70px] sm:border-r sm:py-6 sm:hover:max-w-[250px] lg:sticky lg:max-w-[250px]">
            <SideNav />
          </aside>
          <section className="flex flex-1 min-h-0 w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="flex flex-1 h-full w-full items-center justify-center bg-black p-0">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
