"use client";

import { useEffect } from "react";

export default function RoomRedirect({ destination }: { destination: string }) {
  const href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/#${destination}`;
  useEffect(() => { window.location.replace(href); }, [href]);
  return <main><a href={href}>Continue to Ixotic’s room</a></main>;
}
