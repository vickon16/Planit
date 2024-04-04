import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { appLinks } from "./lib/appLinks";
import { NextResponse } from "next/server";

const privateRoutes = [
  appLinks.agency,
  appLinks.subAccount,
  appLinks.invitation,
  appLinks.editor,
];

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;

    const searchParams = url.searchParams.toString();
    let hostname = req.headers;
    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // verify authentication
    const isAuth = await getToken({ req });

    const isAccessingPrivateRoutes = privateRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAuth && !!isAccessingPrivateRoutes) {
      return NextResponse.redirect(new URL(appLinks.signIn, req.url));
    }

    const customSubDomain = hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];

    if (customSubDomain) {
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized({ token }) {
        return Boolean(token);
      },
    },
  }
);

export const config = {
  matcher: ["/agency/:path*", "/subaccount/:path*", "/invitation/:path*", "/editor/:path*"],
};
