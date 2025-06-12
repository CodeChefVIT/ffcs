import Loader from "@/components/ui/Loader";

export default function Loading() {
  return (

    <div className="flex flex-col items-center justify-center h-screen bg-[#CEE4E5]">
      <div className="text-4xl mb-8 font-pangolin text-[#00000088]">
          Loading
        </div>
      <Loader />
    </div>
  );
}
