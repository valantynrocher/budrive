import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import { supabase } from "@/utils/supabase/browser";
import translateErrorCode from "@/utils/supabase/error-translation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutButtonManagerProps } from "./props";

const translateAuthErrorCode = translateErrorCode("auth");

const LogoutButtonManager = ({ Component }: LogoutButtonManagerProps) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignOutClick = async () => {
    setServerError(null);

    const { error: authError } = await supabase.auth.signOut();

    if (authError) {
      setServerError(translateAuthErrorCode(authError.code));
    } else {
      router.push("/auth/sign-in");
    }
  };

  const handleErrorClose = () => {
    setServerError(null);
  };

  return (
    <>
      <Component onClick={handleSignOutClick} />
      <ErrorSnackbar message={serverError} onClose={handleErrorClose} />
    </>
  );
};

export default LogoutButtonManager;
