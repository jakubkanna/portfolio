"use client";

import { useState } from "react";
import { useI18n } from "../hooks/useI18n";
import Button from "./Button";

const FORM_ID_EN = "EkWdAq";
const FORM_ID_PL = "0QOByP";

type TallyWindow = Window & {
  Tally?: {
    openPopup: (formId: string, options?: Record<string, unknown>) => void;
  };
};

export default function TallyPopup() {
  const [isVisible, setIsVisible] = useState(true);
  const { locale, t } = useI18n();

  const handleClick = () => {
    const tally = (window as TallyWindow).Tally;
    if (!tally?.openPopup) return;
    const formId = locale === "pl" ? FORM_ID_PL : FORM_ID_EN;
    tally.openPopup(formId, {
      autoClose: true,
      width: 425,
      onOpen: () => setIsVisible(false),
      onClose: () => setIsVisible(true),
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 right-8 z-40">
      <Button
        label={t.cta?.tally ?? "Start Project"}
        variant="light"
        action={handleClick}
        size="lg"
        className="shadow-lg backdrop-blur"
      />
    </div>
  );
}
