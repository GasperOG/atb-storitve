"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NosilciRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/inventura");
  }, [router]);
  return <div className="p-6">Preusmerjam na Inventuro...</div>;
}