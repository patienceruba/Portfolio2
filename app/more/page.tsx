// app/more/page.tsx (server component)
import React, { Suspense } from "react";
import ClientMorePage from "./ClientMorePage";

export default function MorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientMorePage />
    </Suspense>
  );
}
