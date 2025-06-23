"use client";

import { useEffect, useState } from "react";
import useScreenSize from "@/hooks/useScreenSize";
import Saved from "./saved";
import SavedMobile from "./saved-mobile";
import Loader from "@/components/ui/Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/AlertModal";

export default function View() {
  const { status } = useSession();
  const router = useRouter();
  const size = useScreenSize();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowAlert(true);
    }
  }, [status]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    router.push("/");
  };

  if (status === "loading" || size === null) return <Loader />;

  if (status !== "authenticated") {
    return (
      <>
        {showAlert && (
          <AlertModal
            open={showAlert}
            message="Please login to continue."
            onClose={handleCloseAlert}
            color="red"
          />
        )}
      </>
    );
  }

  return size === "mobile" ? <SavedMobile /> : <Saved />;
}
