import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full min-h-[100svh] flex items-center justify-center mb-10">
      {children}
    </div>
  );
}
