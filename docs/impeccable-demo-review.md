# Przegląd interfejsów demo — 17 listopada 2026

Zastosowano Impeccable 4.9.2 z [repozytorium autora](https://github.com/pbakaus/impeccable), przede wszystkim instrukcje `distill`, `polish`, `operate` i `craft-floor`. Zachowano działanie aplikacji, ich identyfikację i treści merytoryczne. Przegląd dotyczy pięciu aplikacji oraz pięciu odpowiadających im stron opisowych w portfolio.

## Zmiany

| Projekt | Interfejs aplikacji | Strona opisowa |
| --- | --- | --- |
| TaskMesh | Formularz i historia obok siebie na dużym ekranie, zwarte pozycje wyboru zadania, spokojniejszy kolor przycisków, rzeczowy pusty stan i usunięte nieużywane style. | Krótszy opis wprowadzający, rzeczywisty zrzut konsoli z zakończonym zadaniem. |
| SentinelHub | Kontrolki trasy obok mapy i wyników, własne GeoJSON w rozwijanej sekcji, większe etykiety, czytelniejsze przyciski i komunikaty. Poprawiono także samodzielny przykład `sample.html`. | Zrzut obliczonego objazdu, krótki opis funkcji, zachowane ograniczenie importu WMS. |
| Dual-Agent Support | Rozmowa stanowi główny obszar pracy, szczegóły odpowiedzi mają lżejszą oprawę. Ujednolicono wielkości tekstu, odstępy, focus i pola formularza. | Konkretne wprowadzenie i zrzut demonstracyjnego zwrotu z widocznym routingiem. |
| Posture Lab | Poprawiono analizę własnych RGB-D i przykład syntetyczny. Ograniczono jaskrawość akcentów, uproszczono prezentację metryk i rozwijane informacje sesji gościa. Dodano odnośnik pomijający nawigację w przykładzie. | Rzeczywisty zrzut syntetycznej analizy, zachowane rozróżnienie przykładu i zapisu z kamery. |
| SPHEREx | Usunięto powtarzające się etykiety nad nagłówkami oraz dodatkowe obramowania wyboru pola. Zachowano narzędzia naukowe, opis jakości danych i nawigację. Poprawiono focus i rozmiary pól na telefonie. | Zrzut obserwacji WISE 0855 oraz wspólny, czytelniejszy układ opisu. |

Strony opisowe korzystają ze wspólnego `case-study.css`: mniejsze nagłówki, opis i obraz aplikacji w pierwszym widoku, węższa kolumna tekstu i liniowe sekcje implementacji. Zrzuty w `assets/demos/` pochodzą z uruchomionych aplikacji w przeglądarce testowej z podmienionymi lokalnie zasobami frontendu. Przedstawiają dane testowe lub jawnie oznaczone obserwacje archiwalne, bez danych użytkowników.

## Weryfikacja

- Build produkcyjny i kontrola typów TaskMesh oraz SPHEREx: poprawne.
- Istniejące testy frontendu SPHEREx: **53/53**.
- TaskMesh: zgłoszenie, wynik 22 znaki / 4 słowa / 2 linie, szczegóły wykonania, zamknięcie klawiaturą i przywrócenie focusu, widok trzech workerów.
- SentinelHub: przykład, objazd **582 m**, zapis i odczyt historii; osobno obliczenie w `sample.html`.
- Dual-Agent: odpowiedź techniczna z `X-API-Key`, cennik oraz wieloturowy przykładowy zwrot. Pieniądze i wiadomości nie są wysyłane.
- Posture Lab: syntetyczny upload RGB-D, wynik **6,00 cm**, pobranie rzeczywistego PDF; osobno akceptacja i odrzucenie sceny syntetycznej.
- SPHEREx: otwarcie przygotowanej obserwacji WISE 0855 i wyświetlenie obrazu w narzędziu porównywania.
- Siedem sprawdzonych widoków aplikacji: szerokości **1440, 768, 390 i 360 px**, bez błędów JavaScript, bez poziomego przepełnienia strony i bez naruszeń wykrywanych przez axe dla tagów WCAG 2 A/AA i 2.1 AA w sprawdzonych stanach.
- Pięć opisów: oba języki, cztery szerokości, poprawne obrazy, po jednym H1, brak przepełnienia i wykrytych naruszeń WCAG w sprawdzonych stanach.
- `npm run test:links`: pliki, odnośniki, kotwice, unikalne identyfikatory i H1 na **12 stronach**.

Testy aplikacji używały działających backendów oraz lokalnych zasobów frontendu podmienianych przez Playwright wyłącznie w przeglądarce testowej. Nie zmieniano odpowiedzi API. Utworzone podczas testów przestrzenie SentinelHub, gości Posture Lab i rozmowy wsparcia usunięto. Zadania TaskMesh pozostają objęte istniejącą retencją sesji.

## Wynik detektora Impeccable

Wykonano pojedynczy skan zmienianych plików. Jego ostrzeżenia oceniono względem renderu:

- Inter na opisach pozostaje częścią istniejącej typografii portfolio. Nie zmieniano globalnego kroju na podstawie samej reguły o popularnych fontach.
- Mapy SentinelHub celowo wypełniają obszar SVG do krawędzi; podpisy mają własny odstęp. Zwarty tekst metadanych i etykiet pomiarowych nie jest tekstem głównym.
- Obrazy wyników Posture Lab otrzymują `src` z odpowiedzi API, a ich rodzice pozostają ukryci przed uzyskaniem wyniku. Nie są to puste obrazy widoczne użytkownikowi.
- Statyczny skaner nie rozwiązuje tras serwera `/assets/` dla HTML Posture Lab. Zgłoszona płaska hierarchia jest skutkiem braku tych arkuszy w analizie plikowej; render i testy przeglądarkowe korzystały z właściwego CSS.
- Obramowanie 3 px w SPHEREx oznacza aktywną zakładkę. Ten komponent ma jawne `border-radius: 0`.

Brak naruszeń w axe dotyczy wskazanych scenariuszy i nie zastępuje pełnego audytu dostępności.

## Źródła i publikacja

Zmiany zapisano w lokalnych repozytoriach `TaskMesh`, `Dual-agent-support-chatbot`, `SentinelHub`, `SystemAnalizyWadPostawy` i `NASA-Space-Apps-Challenge-Project` (lokalny katalog `Hackaton`). Dla SentinelHub i Posture Lab wykorzystano czyste checkouty audytu w `.codex/audit-source-checkouts`, zachowując równoległe, niezacommitowane prace w starszych kopiach na pulpicie. Sprawdzono czystość 13 docelowych plików przed zapisem oraz zgodność ich sum SHA-256 po skopiowaniu.

W trakcie pracy pojawiły się także równoległe zmiany innych plików portfolio. Zostały zachowane; nie przypisano ich temu przeglądowi.

**Stan po publikacji 17 listopada 2026: kod pięciu aplikacji wypchnięto na `main`, wszystkie pięć demo wdrożono na serwerze, a opisy, CSS i zrzuty opublikowano w GitHub Pages.**

Wydanie aplikacji: `impeccable-20261117`. Każdy nowy obraz dodaje wyłącznie zasoby interfejsu do dokładnego obrazu poprzednio działającej usługi. Zachowano backendy, bazy, dane, limity i dostęp. Wszystkie pięć usług ma status `healthy`; identyfikatory i obrazy pozostałych **21 kontenerów** pozostały bez zmian. Poprzednie wydania i obrazy są zachowane do wycofania aktualizacji.

Publiczne pliki sprawdzono przez HTTP: **42/42** zasobów aplikacji i **11/11** plików portfolio zgadza się z wydaniem. W HTML SentinelHub uwzględniono wyłącznie istniejące w Nginx dodanie `<base href="/sentinelhub/">`. Wszystkie siedem scenariuszy aplikacji przeszło ponownie na wdrożeniach publicznych, bez lokalnej podmiany zasobów. Sprawdzono także pięć opublikowanych opisów w PL/EN na komputerze i telefonie; bez błędów JavaScript, przepełnienia i wykrytych naruszeń WCAG A/AA w tych stanach.

Kod portfolio: `acd486931621a0cca3601d6ff1e2a887f9b92c4c`. [Publikacja Pages](https://github.com/Adam-Sapiecha/Portfolio-AdamSapiecha/actions/runs/43987127163) i [testy publicznych przepływów z niezależnego runnera GitHub](https://github.com/Adam-Sapiecha/Portfolio-AdamSapiecha/actions/runs/43987128608) zakończyły się powodzeniem. SPHEREx dodatkowo sprawdzono lokalną przeglądarką na jego publicznym adresie.

Dokładne commity aplikacji, aktywne obrazy i sumę paczki zapisano w [manifeście wydania](impeccable-release-2026-11-17.json). Każdy katalog wydania na serwerze zawiera `ui-release.json` oraz prywatny, rozstrzygnięty plik `compose.ui.json` z zachowanymi ścieżkami danych. Ten ostatni jest receptą uruchomienia wydania i zawiera konfigurację wykonawczą; nie trafia do repozytorium. Raporty JSON, zrzuty i patche do przeglądu pozostają w ignorowanym katalogu `output/impeccable-20261117/`.
