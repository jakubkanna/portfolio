"use client";

import Link from "next/link";
import { useI18n } from "../hooks/useI18n";

type LegalCopy = {
  title: string;
  introBeforeOrder: string;
  introAfterOrder: string;
  sections: Array<{
    title: string;
    items: string[];
  }>;
};

const plCopy: LegalCopy = {
  title: "Polityka Prywatności i Regulamin",
  introBeforeOrder:
    "Niniejszy dokument dotyczy korzystania z całej strony oraz współpracy ze STUDIO JAKUB KANNA, w tym formularza dostępnego pod adresem ",
  introAfterOrder:
    ", i określa zasady przetwarzania danych oraz warunki współpracy.",
  sections: [
    {
      title: "1. Polityka prywatności",
      items: [
        "Administratorem danych jest właściciel strony. Kontakt w sprawach danych osobowych odbywa się przez adres e-mail podany na stronie /contact.",
        "Przetwarzamy dane przesłane przez formularze i kanały kontaktu dostępne na stronie, w szczególności: dane kontaktowe, informacje o projekcie, preferencje dotyczące spotkania, materiały referencyjne i opcje zamówienia.",
        "Przesłane dane są wykorzystywane do przygotowania spersonalizowanej oferty, kontaktu zwrotnego i ustalenia zakresu współpracy.",
        "Strona korzysta z narzędzia Google Analytics 4 (GA4) w celu analizy ruchu i kliknięć (statystyki odwiedzin, interakcje z elementami strony, podstawowe dane techniczne o urządzeniu i przeglądarce).",
        "Google Analytics wykorzystuje pliki cookies. Narzędzie jest uruchamiane dopiero po wyrażeniu zgody w banerze cookies.",
        "Możesz odmówić zgody na cookies analityczne; w takim przypadku dane analityczne nie są wysyłane do Google Analytics.",
        "Dane są przechowywane w naszej skrzynce e-mail i nie są sprzedawane podmiotom trzecim.",
        "W każdej chwili możesz zażądać usunięcia danych. W tym celu skontaktuj się z nami wiadomością zwrotną.",
        "Przesłanie formularza nie powoduje automatycznego założenia konta, profilowania ani automatycznego podejmowania decyzji.",
      ],
    },
    {
      title: "2. Zasady dotyczące formularza /order",
      items: [
        "Wybór daty spotkania w formularzu nie jest jednoznaczny z rezerwacją terminu.",
        "Informację o dostępności terminu otrzymasz w wiadomości zwrotnej.",
        "Przesłanie formularza nie jest jednoznaczne z rozpoczęciem zlecenia.",
        "Zlecenie rozpoczyna się dopiero po zawarciu odrębnej umowy.",
      ],
    },
    {
      title: "3. Umowa wstępna i kluczowe warunki współpracy",
      items: [
        "Projekt wizualny strony otrzymasz w formacie udostępnianym przez aplikację Figma.",
        "Po opłaceniu projektu wizualnego na klienta zostaną przeniesione prawa autorskie do warstwy graficznej, zgodnie z postanowieniami umowy.",
        "Program (kod) udostępniany przez nas nie jest objęty przeniesieniem praw autorskich, chyba że odrębna umowa stanowi inaczej.",
        "Możliwe jest wykupienie indywidualnej licencji lub szerszych praw do kodu na podstawie osobnych ustaleń.",
        "W przypadku braku indywidualnej licencji modyfikacja kodu wymaga naszej uprzedniej zgody.",
        "Do usługi instalacji klient dostarcza własny hosting oraz przekazuje tymczasowy dostęp do serwera/usługi, na której ma zostać zainstalowana strona, w ustalonym terminie.",
        "W przypadku niedostarczenia wymaganych dostępów w uzgodnionym terminie zastrzegamy sobie prawo do anulowania zlecenia bez obowiązku zwrotu wpłaconej zaliczki (depozytu).",
      ],
    },
    {
      title: "4. Dodatkowe ważne postanowienia",
      items: [
        "Harmonogram realizacji jest ustalany indywidualnie po spotkaniu i potwierdzeniu zakresu.",
        "Zastrzegamy sobie prawo do zmiany terminu realizacji lub terminu spotkania; klient zostanie o tym poinformowany na adres e-mail podany w formularzu.",
        "Rozpoczęcie prac następuje po akceptacji oferty, podpisaniu umowy oraz opłaceniu zaliczki w wysokości 50% kwoty całkowitej.",
        "Cena podana w formularzu ma charakter umowny i może ulec zmianie po doprecyzowaniu zakresu prac.",
        "Klient oświadcza, że posiada prawa do materiałów przekazywanych do realizacji (teksty, grafiki, zdjęcia, znaki towarowe).",
        "Istotna zmiana zakresu po akceptacji projektu może wymagać aneksu, aktualizacji wyceny lub wydłużenia terminu realizacji.",
        "Poprawki projektu oraz dodatkowe warianty mogą zostać wycenione w stawce godzinowej 35 € / h.",
        "Obowiązuje limit wariantów (wersji projektów wizualnych) dla pakietów, zgodnie z opisem pakietów poniżej.",
        "Odpowiadamy za realizację usługi w granicach uzgodnionych w umowie; nie odpowiadamy za przerwy i awarie po stronie dostawców zewnętrznych (np. hosting, domena, usługi third-party).",
        "Niniejsze postanowienia mają charakter informacyjny i obowiązują do czasu podpisania odrębnej umowy, która ma pierwszeństwo w razie rozbieżności.",
      ],
    },
    {
      title: "5. Opis pakietów",
      items: [
        "Minimal: projekt strony typu one-page, podstawowe SEO, 1 spotkanie online, wersja mobilna. Limit wariantów: 0.",
        "Standard: do 3 podstron, rozszerzony proces projektowy, wsparcie multimediów (wideo, zdjęcia, audio), 3 spotkania online. Limit wariantów: 1.",
        "Advanced: do 7 podstron, animacje/3D, struktura wielojęzyczna i szerszy zakres zmian projektowych. Limit wariantów: 2.",
        "Institutional: zakres indywidualny dla większych projektów, funkcje custom, wycena ustalana po analizie potrzeb. Limit wariantów: 3.",
      ],
    },
    {
      title: "6. Opis pozostałych usług",
      items: [
        "CMS / Zarządzanie treścią: WordPress, WooCommerce, strona statyczna lub rozwiązanie inne (ustalane indywidualnie).",
        "Domena: przed instalacją musisz być właścicielem domeny i przekazać nam dostęp do strefy zarządzania DNS. W przypadku konieczności asysty zaznacz opcję I need assistance w formularzu (może zostać naliczony dodatkowy koszt).",
        "Biznesowy e-mail: możliwość konfiguracji adresu e-mail w domenie klienta.",
        "Instalacja: instalacja projektu na hostingu klienta lub przekazanie plików do samodzielnego wdrożenia.",
        "Dodatkowe podstrony: rozszerzenie serwisu o kolejne strony ponad zakres wybranego pakietu.",
        "Projekt logo: przygotowanie indywidualnego znaku i podstawowych wersji użytkowych.",
        "Projekt wizytówek: przygotowanie projektu do druku i/lub publikacji cyfrowej.",
        "Aplikacja mobilna: usługa wyceniana indywidualnie na podstawie zakresu.",
        "Inne usługi: dodatkowe potrzeby opisane w formularzu są analizowane i wyceniane osobno.",
      ],
    },
  ],
};

const enCopy: LegalCopy = {
  title: "Privacy Policy and Terms",
  introBeforeOrder:
    "This document applies to the use of the entire website and cooperation with STUDIO JAKUB KANNA, including the form available at ",
  introAfterOrder:
    ", and defines the rules of data processing and cooperation terms.",
  sections: [
    {
      title: "1. Privacy policy",
      items: [
        "The data controller is the website owner. For personal data matters, contact us via the e-mail address provided on /contact.",
        "We process data submitted through forms and contact channels available on the website, including: contact details, project information, meeting preferences, reference materials, and order options.",
        "Submitted data is used to prepare a tailored offer, respond to inquiries, and define the scope of cooperation.",
        "The website uses Google Analytics 4 (GA4) to analyze traffic and clicks (visit statistics, interactions with website elements, and basic technical data about the device and browser).",
        "Google Analytics uses cookies. The tool is activated only after consent is granted in the cookie banner.",
        "You may decline analytical cookies; in that case, analytics data is not sent to Google Analytics.",
        "Data is stored in our e-mail inbox and is not sold to third parties.",
        "You may request deletion of your data at any time by contacting us.",
        "Submitting a form does not automatically create an account, profiling, or automated decision-making.",
      ],
    },
    {
      title: "2. Rules for the /order form",
      items: [
        "Selecting a meeting date in the form does not automatically reserve a slot.",
        "You will receive availability confirmation in a follow-up message.",
        "Submitting the form does not automatically start a project.",
        "The project starts only after a separate agreement is concluded.",
      ],
    },
    {
      title: "3. Preliminary agreement and key cooperation terms",
      items: [
        "The visual website design is delivered in a format shared via Figma.",
        "After payment for the visual design, copyright to the graphic layer is transferred to the client as specified in the agreement.",
        "The software (code) provided by us is not covered by copyright transfer unless a separate agreement states otherwise.",
        "An individual license or broader code rights may be purchased based on separate arrangements.",
        "Without an individual license, code modification requires our prior consent.",
        "For installation services, the client provides their own hosting and temporary access to the server/service where the website is to be installed, within the agreed timeline.",
        "If required access is not provided within the agreed timeline, we reserve the right to cancel the order without the obligation to refund the paid advance (deposit).",
      ],
    },
    {
      title: "4. Additional important provisions",
      items: [
        "The delivery timeline is agreed individually after the meeting and scope confirmation.",
        "We reserve the right to change delivery or meeting dates; the client will be informed by e-mail provided in the form.",
        "Work begins after offer acceptance, agreement signing, and payment of a 50% advance.",
        "The price shown in the form is indicative and may change after scope clarification.",
        "The client declares they hold rights to materials provided for the project (texts, graphics, photos, trademarks).",
        "A significant scope change after project approval may require an annex, quote update, or timeline extension.",
        "Project revisions and additional variants may be billed at an hourly rate of 35 € / h.",
        "Variant limits (visual design versions) apply to packages as described below.",
        "We are responsible for service delivery within the agreed contractual scope; we are not responsible for outages and failures of third-party providers (e.g. hosting, domain, third-party services).",
        "These provisions are informational and apply until a separate agreement is signed, which takes precedence in case of discrepancies.",
      ],
    },
    {
      title: "5. Package descriptions",
      items: [
        "Minimal: one-page website design, basic SEO, 1 online meeting, mobile version. Variant limit: 0.",
        "Standard: up to 3 subpages, expanded design process, multimedia support (video, photos, audio), 3 online meetings. Variant limit: 1.",
        "Advanced: up to 7 subpages, animations/3D, multilingual structure, and broader design scope. Variant limit: 2.",
        "Institutional: custom scope for larger projects, custom features, quote defined after needs analysis. Variant limit: 3.",
      ],
    },
    {
      title: "6. Other services",
      items: [
        "CMS / Content management: WordPress, WooCommerce, static website, or another solution (agreed individually).",
        "Domain: before installation, you must own the domain and provide access to DNS management. If assistance is needed, select I need assistance in the form (additional cost may apply).",
        "Business e-mail: option to configure an e-mail address in the client's domain.",
        "Installation: project installation on the client's hosting or handoff of files for self-deployment.",
        "Additional subpages: expanding the website beyond the selected package scope.",
        "Logo design: preparation of an individual mark and core usage versions.",
        "Business card design: preparation for print and/or digital publication.",
        "Mobile app: service priced individually based on scope.",
        "Other services: additional needs described in the form are analyzed and quoted separately.",
      ],
    },
  ],
};

export default function LegalContent() {
  const { locale } = useI18n();
  const copy = locale === "pl" ? plCopy : enCopy;

  return (
    <main className="min-h-screen bg-[#d9d9d9] px-6 pb-24 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto w-full max-w-3xl space-y-10 rounded-3xl border border-black/20 bg-[#f0ff5e] p-8">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">{copy.title}</h1>
          <p className="text-sm text-black/70">
            {copy.introBeforeOrder}
            <Link href="/order" className="font-mono underline underline-offset-4">
              /order
            </Link>
            {copy.introAfterOrder}
          </p>
        </section>

        {copy.sections.map((section) => (
          <section className="space-y-4" key={section.title}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
