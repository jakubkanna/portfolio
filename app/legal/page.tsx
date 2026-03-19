import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności i regulamin",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#d9d9d9] px-6 pb-24 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto w-full max-w-3xl space-y-10 rounded-3xl border border-black/20 bg-[#f0ff5e] p-8">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">
            Polityka Prywatności i Regulamin
          </h1>
          <p className="text-sm text-black/70">
            Niniejszy dokument dotyczy formularza dostępnego pod adresem{" "}
            <Link href="/order" className="font-mono underline underline-offset-4">
              /order
            </Link>{" "}
            i określa zasady
            przetwarzania danych oraz warunki współpracy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Polityka prywatności</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>
              Administratorem danych jest właściciel strony. Kontakt w sprawach
              danych osobowych odbywa się przez adres e-mail podany na stronie{" "}
              <Link
                href="/contact"
                className="font-mono underline underline-offset-4"
              >
                /contact
              </Link>
              .
            </li>
            <li>
              Przetwarzamy wyłącznie dane przesłane przez formularz{" "}
              <Link href="/order" className="font-mono underline underline-offset-4">
                /order
              </Link>
              , w szczególności: dane
              kontaktowe, informacje o projekcie, preferencje dotyczące
              spotkania, materiały referencyjne i opcje zamówienia.
            </li>
            <li>
              Przesłane dane są wykorzystywane do przygotowania
              spersonalizowanej oferty, kontaktu zwrotnego i ustalenia zakresu
              współpracy.
            </li>
            <li>
              Strona korzysta z narzędzia Google Analytics 4 (GA4) w celu
              analizy ruchu i kliknięć (statystyki odwiedzin, interakcje z
              elementami strony, podstawowe dane techniczne o urządzeniu i
              przeglądarce).
            </li>
            <li>
              Google Analytics wykorzystuje pliki cookies. Narzędzie jest
              uruchamiane dopiero po wyrażeniu zgody w banerze cookies.
            </li>
            <li>
              Możesz odmówić zgody na cookies analityczne; w takim przypadku dane
              analityczne nie są wysyłane do Google Analytics.
            </li>
            <li>
              Dane są przechowywane w naszej skrzynce e-mail i nie są
              sprzedawane podmiotom trzecim.
            </li>
            <li>
              W każdej chwili możesz zażądać usunięcia danych. W tym celu
              skontaktuj się z nami wiadomością zwrotną.
            </li>
            <li>
              Przesłanie formularza nie powoduje automatycznego założenia konta,
              profilowania ani automatycznego podejmowania decyzji.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            2. Zasady dotyczące formularza{" "}
            <Link href="/order" className="font-mono underline underline-offset-4">
              /order
            </Link>
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>
              Wybór daty spotkania w formularzu nie jest jednoznaczny z
              rezerwacją terminu.
            </li>
            <li>
              Informację o dostępności terminu otrzymasz w wiadomości zwrotnej.
            </li>
            <li>
              Przesłanie formularza nie jest jednoznaczne z rozpoczęciem
              zlecenia.
            </li>
            <li>
              Zlecenie rozpoczyna się dopiero po zawarciu odrębnej umowy.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            3. Umowa wstępna i kluczowe warunki współpracy
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>
              Projekt wizualny strony otrzymasz w formacie udostępnianym przez
              aplikację Figma.
            </li>
            <li>
              Po opłaceniu projektu wizualnego na klienta zostaną przeniesione
              prawa autorskie do warstwy graficznej, zgodnie z postanowieniami
              umowy.
            </li>
            <li>
              Program (kod) udostępniany przez nas nie jest objęty przeniesieniem
              praw autorskich, chyba że odrębna umowa stanowi inaczej.
            </li>
            <li>
              Możliwe jest wykupienie indywidualnej licencji lub szerszych praw
              do kodu na podstawie osobnych ustaleń.
            </li>
            <li>
              W przypadku braku indywidualnej licencji modyfikacja kodu wymaga
              naszej uprzedniej zgody.
            </li>
            <li>
              Do usługi instalacji klient dostarcza własny hosting oraz
              przekazuje tymczasowy dostęp do serwera/usługi, na której ma zostać
              zainstalowana strona, w ustalonym terminie.
            </li>
            <li>
              W przypadku niedostarczenia wymaganych dostępów w uzgodnionym
              terminie zastrzegamy sobie prawo do anulowania zlecenia bez
              obowiązku zwrotu wpłaconej zaliczki (depozytu).
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Dodatkowe ważne postanowienia</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>
              Harmonogram realizacji jest ustalany indywidualnie po spotkaniu i
              potwierdzeniu zakresu.
            </li>
            <li>
              Zastrzegamy sobie prawo do zmiany terminu realizacji lub terminu
              spotkania; klient zostanie o tym poinformowany na adres e-mail
              podany w formularzu.
            </li>
            <li>
              Rozpoczęcie prac następuje po akceptacji oferty, podpisaniu umowy
              oraz opłaceniu zaliczki w wysokości 50% kwoty całkowitej.
            </li>
            <li>
              Cena podana w formularzu ma charakter umowny i może ulec zmianie
              po doprecyzowaniu zakresu prac.
            </li>
            <li>
              Klient oświadcza, że posiada prawa do materiałów przekazywanych do
              realizacji (teksty, grafiki, zdjęcia, znaki towarowe).
            </li>
            <li>
              Istotna zmiana zakresu po akceptacji projektu może wymagać aneksu,
              aktualizacji wyceny lub wydłużenia terminu realizacji.
            </li>
            <li>
              Poprawki projektu oraz dodatkowe warianty mogą zostać wycenione
              w stawce godzinowej 35 € / h.
            </li>
            <li>
              Obowiązuje limit wariantów (wersji projektów wizualnych) dla
              pakietów, zgodnie z opisem pakietów poniżej.
            </li>
            <li>
              Odpowiadamy za realizację usługi w granicach uzgodnionych w umowie;
              nie odpowiadamy za przerwy i awarie po stronie dostawców
              zewnętrznych (np. hosting, domena, usługi third-party).
            </li>
            <li>
              Niniejsze postanowienia mają charakter informacyjny i obowiązują do
              czasu podpisania odrębnej umowy, która ma pierwszeństwo w razie
              rozbieżności.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Opis pakietów</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>
              <span className="font-semibold">Minimal</span>: projekt strony
              typu one-page, podstawowe SEO, 1 spotkanie online, wersja mobilna.
              Limit wariantów: 0.
            </li>
            <li>
              <span className="font-semibold">Standard</span>: do 3 podstron,
              rozszerzony proces projektowy, wsparcie multimediów (wideo, zdjęcia,
              audio), 3 spotkania online. Limit wariantów: 1.
            </li>
            <li>
              <span className="font-semibold">Advanced</span>: do 7 podstron,
              animacje/3D, struktura wielojęzyczna i szerszy zakres zmian
              projektowych. Limit wariantów: 2.
            </li>
            <li>
              <span className="font-semibold">Institutional</span>: zakres
              indywidualny dla większych projektów, funkcje custom, wycena
              ustalana po analizie potrzeb. Limit wariantów: 3.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Opis pozostałych usług</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>
              <span className="font-semibold">CMS / Zarządzanie treścią</span>:
              WordPress, WooCommerce, strona statyczna lub rozwiązanie inne
              (ustalane indywidualnie).
            </li>
            <li>
              <span className="font-semibold">Domena</span>: przed instalacją
              musisz być właścicielem domeny i przekazać nam dostęp do strefy
              zarządzania DNS (domeną). W przypadku konieczności asysty zaznacz
              opcję <span className="font-mono">I need assistance</span> w
              formularzu (może zostać naliczony dodatkowy koszt).
            </li>
            <li>
              <span className="font-semibold">Biznesowy e-mail</span>: możliwość
              konfiguracji adresu e-mail w domenie klienta.
            </li>
            <li>
              <span className="font-semibold">Instalacja</span>: instalacja
              projektu na hostingu klienta lub przekazanie plików do samodzielnego
              wdrożenia.
            </li>
            <li>
              <span className="font-semibold">Dodatkowe podstrony</span>:
              rozszerzenie serwisu o kolejne strony ponad zakres wybranego pakietu.
            </li>
            <li>
              <span className="font-semibold">Projekt logo</span>: przygotowanie
              indywidualnego znaku i podstawowych wersji użytkowych.
            </li>
            <li>
              <span className="font-semibold">Projekt wizytówek</span>:
              przygotowanie projektu do druku i/lub publikacji cyfrowej.
            </li>
            <li>
              <span className="font-semibold">Aplikacja mobilna</span>:
              usługa wyceniana indywidualnie na podstawie zakresu.
            </li>
            <li>
              <span className="font-semibold">Inne usługi</span>: dodatkowe
              potrzeby opisane w formularzu są analizowane i wyceniane osobno.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
