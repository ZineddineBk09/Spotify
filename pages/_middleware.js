import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  //Token exists if user is logged in
  //secret is like an extra layer for security to not allow anyone to request the data
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  //Allow the requests if the following is true :
  //1)IT'S A REQUEST FOR NEXT-AUTH SESSION & PROVIDER FETCHING --> user is doing authentication
  //2)the token exists
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next(); //let them pass
  }

  //ELSE Redirect them to login if they don't have token AND are requesting protected routes(other than /login)
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
