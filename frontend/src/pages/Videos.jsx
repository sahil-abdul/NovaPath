import { Video as VideoComponent } from "../components";

function Videos() {
  return (
    <>
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 ">
        <div className="flex flex-wrap gap-4 p-4 sm:justify-start justify-center">
          <VideoComponent />
        </div>
      </section>
    </>
  );
}

export default Videos;
