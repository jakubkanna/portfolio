"use client";

import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();

  const items = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact us", href: "/contact" },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-30 flex flex-col gap-3">
      {items.map((item) => (
        <Button
          key={item.label}
          label={item.label}
          variant="outline"
          action={() => router.push(item.href)}
          className="w-full text-left"
        />
      ))}
    </div>
  );
}
