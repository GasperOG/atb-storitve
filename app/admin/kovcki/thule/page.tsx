"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ThuleRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/admin/inventura");
  }, [router]);

  return <div className="p-6">Preusmerjam na Inventuro...</div>;
}
