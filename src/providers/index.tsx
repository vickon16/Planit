import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./react-query-provider";
import SessionProvider from "./session-provider";
import { getCustomSession } from "@/lib/auth-actions";
import ModalProvider from "./modal-provider";
import CheckUserSession from "@/components/check-user-session";

const Providers = async ({ children }: PropsWithChildren) => {
  const session = await getCustomSession();
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReactQueryProvider>
          <Toaster position="bottom-right" duration={5000} />
          <CheckUserSession session={session} />
          <ModalProvider />
          {children}
        </ReactQueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
