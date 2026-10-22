# Audyt portfolio i publicznych demonstracji — 21.10.2026

**Werdykt: brak podstaw do oznaczenia całego portfolio jako gotowego według wymaganego kryterium publicznej dostępności.** Cztery aplikacje wykonały rzeczywiste operacje w przeglądarce. Nie wykonano jednak ich pełnych scenariuszy z niezależnej sieci. SentinelHub korzysta dodatkowo z adresu, który zmienia się po odtworzeniu tymczasowego tunelu. To otwarte kryteria odbioru o priorytecie krytycznym, a nie dowód, że aplikacje obecnie nie działają.

Ocena interfejsów: aplikacje mają działające backendy, ale szczególnie TaskMesh i Dual-Agent zasłaniają funkcje sloganami, powtarzalnymi instrukcjami i panelami prezentacyjnymi. Należy usunąć te elementy, zachowując formularze, wyniki, rzeczywiste statusy, źródła odpowiedzi i ograniczenia danych.

## Zakres i wiarygodność ustaleń

Sprawdzono publiczne portfolio, strony główną, projektów, O mnie i Kontakt, cztery demonstracje oraz dwie podlinkowane realizacje stron. Odczytano również lokalne HTML/CSS/JavaScript i istniejące dokumenty w `docs/`. W załączniku był tekst wymagań; nie było zaznaczonych zrzutów ekranu. Własne zrzuty wykonano podczas testów.

**Stan publiczny różni się od lokalnego checkoutu.** Opublikowane `projects.html` zawiera TaskMesh i odnośnik do Posture Lab. Lokalny `projects.html` nie zawiera TaskMesh ani odnośnika uruchamiającego Posture Lab. Lokalny katalog `taskmesh/` nie istnieje. W repozytorium już przed audytem były niezacommitowane zmiany czterech stron i nieśledzone pliki. Zachowano je. Nie należy publikować tego checkoutu przez nadpisanie aktualnego wdrożenia — można stracić już dostępne projekty.

Rodzaje dowodów:

- **Przeglądarka na komputerze użytkownika:** rzeczywiste kliknięcia, formularze, backend, odczyt wyników i eksport. Ta sesja nie jest niezależną siecią; istniejące ciasteczka także nie dowodzą zachowania nowego odwiedzającego.
- **Bezpośredni klient HTTP:** publiczne rekordy A pobrane przez DNS-over-HTTPS; połączenia wymuszone na te adresy z zachowaniem SNI i walidacji TLS. Omija to lokalny hosts/MagicDNS w wyborze adresu docelowego, ale nie zmienia sieci wyjściowej komputera.
- **Zewnętrzne narzędzie WWW:** zwróciło treści KawiARKI i OVILE (z informacją o indeksowaniu sprzed kilku dni), nie otworzyło portfolio i demonstracji. Nie podało wiarygodnej diagnozy połączenia. Nie traktuję tego jako pomiaru awarii ani testu pełnego przepływu.
- **Źródła publiczne:** sprawdzono wybrane pliki dwóch repozytoriów. To nie dowodzi ich zgodności z kodem pracującym na serwerze. Repozytorium Posture Lab pod wskazanym adresem zwróciło 404 w GitHub API; przyczyna nie została ustalona.

Nie uzyskano dostępu administracyjnego do hosta. Nie zmieniano DNS, firewalla, tuneli ani usług. Nie wykonywano skanowania portów, prób logowania na konto właściciela, testu przeciążeniowego ani restartu. Nie potwierdzono izolacji dwóch niezależnych sesji i usuwania danych po upływie retencji. Dane przesłane w audycie były syntetyczne; rozmowa używała `recruiter@example.com` i demonstracyjnego zwrotu.

## 1. Tabela dostępności z niezależnej sieci

Poniższe statusy odnoszą się do **wymaganego testu spoza sieci użytkownika**, nie do udanych testów na jego komputerze.

| Projekt | Frontend | API/backend | Pełny test | Problem / brakujący dowód |
| --- | --- | --- | --- | --- |
| TaskMesh | Niezweryfikowany | Niezweryfikowany | Niezweryfikowany | Publiczny DNS, TLS i HTTP działają z obecnego komputera; zadanie zakończyło się wynikiem. Brakuje pełnego testu z innej sieci bez sesji użytkownika. Port 8443 wymaga sprawdzenia także w sieci firmowej. |
| SentinelHub | Niezweryfikowany | Niezweryfikowany | Niezweryfikowany | Obliczenie i historia działają w tej sesji. Adres Quick Tunnel jest tymczasowy; import WMS opisano jako niedostępny. Brak niezależnego testu. |
| Dual-Agent Support | Niezweryfikowany | Niezweryfikowany | Niezweryfikowany | Routing TECH/BILLING i wieloturowy zwrot demonstracyjny działają w tej sesji. Brak niezależnego testu. Publiczny tryb nie wywołuje LLM. |
| Posture Lab / System Analizy Postury | Niezweryfikowany | Niezweryfikowany | Niezweryfikowany | Gość, upload syntetycznych RGB-D, obliczenie, historia i PDF działają w tej sesji. Brak niezależnego testu; nie sprawdzono kamery ani klinicznej poprawności pomiarów. |

Dokładne adresy:

| Projekt | Frontend | Adres API widoczny w pobranym JavaScript |
| --- | --- | --- |
| TaskMesh | `https://luxonis.tail6ad453.ts.net:8443/taskmesh/` | ten sam origin, `/taskmesh/public/v1/`; `session`, `jobs`, `workers`, próby i zdarzenia zadania |
| SentinelHub | `https://proud-publicly-dependent-talk.trycloudflare.com/` | ten sam origin, `/api/workspaces` i zasoby danej przestrzeni |
| Dual-Agent | `https://luxonis.tail6ad453.ts.net:8443/support/` | ten sam origin, `/support/api/chat`, `/support/api/health`, `/support/api/session` |
| Posture Lab | `https://luxonis.tail6ad453.ts.net:8443/`; przykład `/lab` | ten sam origin, `/api/private/session`, `/api/private/guest`, `/api/private/captures`; przykład `/api/analyze` |

Inne realizacje podlinkowane w portfolio:

| Realizacja | Odczyt strony | Interakcja w obecnej sesji | Zakres niezweryfikowany |
| --- | --- | --- | --- |
| KawiARKA — `https://kawiarka.org/` | HTTP 200, poprawna walidacja TLS; treść zwróciło też zewnętrzne narzędzie | Otwarcie zdjęcia Kasi w modalu i zamknięcie przyciskiem | Pełny przebieg z niezależnej sieci, wszystkie zdjęcia i mapa |
| OVILE — `https://ovile.pl/` | HTTP 200, poprawna walidacja TLS; treść zwróciło też zewnętrzne narzędzie | Bezpośrednie `/o-nas/` i odświeżenie zachowały stronę | Wszystkie aktualności, zależności od Facebook CDN i niezależny przebieg przeglądarkowy |

CI/CD Test Management Platform, Embedded Linux Test Farm i Sorno opisują pracę zawodową, ale w sprawdzonym portfolio nie udostępniają publicznych demonstracji. Nie należy otwierać w tym celu wewnętrznych paneli ani danych klientów.

## 2. Wykonane pełne scenariusze

| Projekt | Operacja → backend → widoczny wynik | Dowód i granice |
| --- | --- | --- |
| TaskMesh | Wpisano `Audit 2026-10-21\nAlpha beta gamma.`, wysłano jedno zadanie, otwarto szczegóły | Zadanie `a99ae6c3-c4ac-4833-bb8d-b565b09a2339`: Completed, 34 znaki, 2 linie, 5 słów. To zgadza się z wejściem. Ślad Queued → Running → Completed, jedna próba; UI pokazał 130 ms. Wynik przetrwał odświeżenie. To jeden przebieg, nie benchmark i nie test odzyskiwania po awarii. |
| SentinelHub | Wczytano przykład, obliczono trasę, odczytano ten sam wynik z historii | UI pokazał 137 m bazowo, 582 m po wykluczeniu zalania, 445 m różnicy i 1/4 zablokowanych odcinków. Historia odczytała wynik bez ponownych obliczeń. Potwierdza to przepływ danych syntetycznych, nie prawdziwy import WMS ani poprawność ewakuacyjną. |
| Dual-Agent | HTTP 401 → źródło dokumentacji; pytanie o Pro → BILLING; zwrot → email → przyczyna | TECH zwrócił fragment `troubleshooting.md#1` o `X-API-Key`. Cennik zwrócił demonstracyjne $49. Wieloturowy scenariusz utworzył `DEMO-0CCED860` i jasno poinformował, że nie wysyła emaila ani pieniędzy. |
| Posture Lab — główna aplikacja | Gość → upload PNG RGB 8-bit, depth 16-bit i JSON kalibracji → analiza → historia → PDF | Ujęcie `32abb17a0a234b94af5c2a7730fc658d` zaakceptowano. Syntetyczne przesunięcie 18 px, depth 2000 mm, fy=600 daje 60 mm; UI pokazał 6,00 cm i kąt 10,20°. Pojawiło się ostrzeżenie o prześwietlonym RGB; nie ukryto go. Historia przetrwała reload. Pobrano plik z nagłówkiem `%PDF-1.3`; nie oceniano składu PDF. |
| Posture Lab — `/lab` | Scena asymetryczna → wynik; scenariusz brakującej głębi → odrzucenie | Dodatni wynik: 8/8 punktów z depth, 6 cm różnicy barków. Brak depth: odrzucenie, 6/8 punktów, wskazane brakujące barki. |

Przygotowane pliki RGB-D są fixture'ami testowymi: płaski obraz, cztery punkty i stała głębia, bez danych człowieka. Nie wolno przedstawiać ich jako nagrania z OAK-D. Sesje i wynik testowy pozostawiono zgodnie z retencją aplikacji; nie usuwano danych innych użytkowników.

### DNS, HTTPS, API, CORS i podstrony

- Publiczny resolver zwrócił dla `luxonis.tail6ad453.ts.net` adresy `185.40.234.37`, `.172` i `.210`, a dla hosta Cloudflare `104.16.230.132` i `104.16.231.132`. Nie są to adresy prywatnej sieci. Sam sufiks `ts.net` **nie oznacza konieczności VPN**: Tailscale Funnel służy również dostępowi publicznemu. Nie ustalono konfiguracji działającego hosta.
- Skrypt wykonał 17 odczytów HTTP, wszystkie z wynikiem 200. Obejmowały cztery aplikacje, portfolio, trzy strony opisów, podstrony `/lab`, `/process/`, `/sample.html`, przykłady GeoJSON i health Dual-Agent.
- Połączenia HTTPS zaakceptowały certyfikaty bez wyłączania walidacji. Certyfikat `luxonis.tail6ad453.ts.net` ma koniec ważności 16.01.2027 UTC; certyfikat tunelu Cloudflare 03.01.2027 UTC. Automatyczne odnowienie i cała obsługa TLS na serwerze pozostają niezweryfikowane. Szczegóły są w `network-audit.json`.
- W pięciu pobranych skryptach aplikacji nie znaleziono wzorców localhost, loopback ani wskazanych prywatnych IPv4. Wszystkie rozpoznane wywołania aplikacyjne korzystają z własnego originu. Adres SVG `http://www.w3.org/2000/svg` jest identyfikatorem przestrzeni nazw, nie niezaszyfrowanym wywołaniem API.
- Próby preflight z `Origin: https://adam-sapiecha.github.io` otrzymały: TaskMesh 403, Dual-Agent 200, Posture 200, SentinelHub 400; żadna odpowiedź nie zezwoliła przez `Access-Control-Allow-Origin` na ten origin. **Nie jest to wykryty błąd CORS**: portfolio otwiera osobną aplikację, a ona wywołuje własny origin. Nie należy naprawiać tego przez `*` lub udostępnianie API całemu internetowi. Próby nie dowodzą pełnej ochrony CSRF ani zachowania wszystkich originów i metod.
- Nie znaleziono klienta WebSocket ani SSE w tych skryptach. TaskMesh odświeża dane przez polling. W tych scenariuszach nie ma podstaw do deklaracji „WebSocket sprawdzony”. WebSocket opisany w zawodowej platformie CI nie ma publicznego demo.
- Potwierdzono odświeżenie TaskMesh i głównego Posture Lab oraz bezpośrednie wejście i reload `/o-nas/` w OVILE. `/support/` i `/lab` otwarto bezpośrednio. Nie sprawdzono dowolnych nieistniejących tras SPA. SentinelHub celowo trzyma klucz przestrzeni w pamięci: reload bez zachowania klucza nie jest testem trwałości bazy. Zachowanie dostępu po zamknięciu wymaga osobnego testu zapisu/odczytu klucza.

## 3. Oceny redakcyjne i UX, 0–10

Oceny są opinią opartą na oględzinach i opisanych przebiegach; nie stanowią oceny całego kodu backendów. Brak niezależnej weryfikacji sieci blokuje odbiór niezależnie od ocen.

| Kryterium | Ocena | Uzasadnienie |
| --- | ---: | --- |
| Portfolio ogółem | 7 | Czytelny układ i realne projekty; rozjazd wdrożenia z checkoutem komplikuje utrzymanie. |
| UX/UI | 6 | Funkcje działają, ale formularze konkurują z dużymi nagłówkami i panelami objaśnień. |
| Treści | 6 | Konkretne technologie i ograniczenia; zbyt wiele sloganów i powtórzeń w aplikacjach. |
| Prezentacja projektów | 7 | Można wykonać operację i obejrzeć wynik; zbyt długie opisy przed wejściem do narzędzia. |
| Profesjonalizm demonstracji | 6 | Wyniki i błędy są rzeczywiste; oznaczenia production/live i język reklamowy są nadmiarowe. |
| Przejrzystość | 6 | TaskMesh ma kilka warstw nawigacji, statystyk i tekstu nad historią; Dual-Agent trzy kolumny. |
| Wrażenie autentyczności | 7 | Dane wejściowe, historia prób, cytaty i odrzucenie błędnego ujęcia budują wiarygodność. |
| Skuteczność rekrutacyjna | 6 | Jest materiał do rozmowy technicznej, lecz publiczny dostęp i odtwarzalność wdrożenia wymagają domknięcia. |

## 4. Konkretne elementy do usunięcia lub uproszczenia

Ocena dotyczy użyteczności elementów, a nie domniemanego sposobu ich wygenerowania. Wygląd ani styl zdania nie dowodzą użycia AI.

### TaskMesh

Główna funkcja: zlecić zadanie, śledzić wykonanie, odczytać wynik i próby. Potrzebne: wybór handlera, wejście, submit, stan, lista zadań, szczegóły, limity i błędy. Obecny układ przypomina landing page połączony z konsolą.

| Element | Lokalizacja | Decyzja | Uzasadnienie |
| --- | --- | --- | --- |
| „Small tasks. Built to go further.” | H1 konsoli | Uprość | Nie nazywa wykonywanej czynności. |
| „Submit a job. Follow its journey. Inspect the result.” i kolejne zdanie o workerach | Pod H1 | Usuń | Formularz i historia przekazują to samo; zajmuje wysokość ekranu. |
| „LIVE WORKSPACE”, „portfolio / production”, „AS” | Sidebar i pasek górny | Usuń | Nie pomagają obsłużyć zadania; production sugeruje więcej niż publiczne demo. |
| „System operational” | Pasek górny | Uprość | Zastąpić konkretnym błędem połączenia, gdy wystąpi; liczba workerów przekazuje użyteczny stan. Nie ustalono, jakie warunki obejmuje obecny komunikat. |
| Cztery karty statystyk sesji | Nad formularzem | Uprość | Jedna linia „N aktywnych · M zakończonych · 3 workery”; limit zadań przy submit. |
| „Run something real”, „Your input. Our queue…” i „NEW JOB” | Formularz | Uprość | Jeden nagłówek „New job” wystarczy. |
| „UNDER THE HOOD”, „Durable by design.”, „No black boxes.” i trzy kroki | Obok formularza | Usuń z głównego widoku | Architektura jest w portfolio; szczegóły konkretnego zadania już pokazują ślad wykonania. |
| „Built for the unexpected.” i cztery badge'e gwarancji | Pod historią | Usuń z konsoli | Przenieść wyłącznie potrzebne wyjaśnienie at-least-once do dokumentacji. |
| Worker fleet oraz zakładka Workers | Sidebar i historia | Uprość | Jeden widok workerów; obecna nawigacja dubluje cel. |
| Status zadania, input, result, próby, lease generation | Szczegóły zadania | Zostaw | To dowody rzeczywistej pracy silnika, istotne dla rekrutera technicznego. |
| Informacja o prywatności i 24 h retencji | Stopka / sesja | Zostaw | Użytkownik musi znać granice przechowywania. „Private” wymaga osobnego testu izolacji. |

Docelowy porządek: „TaskMesh / Jobs” → formularz → lista zadań → szczegóły wybranego zadania. Widok workerów jako jedna zakładka. Bez dodawania nowego dashboardu.

### SentinelHub

Główna funkcja: z danych dróg i zalania obliczyć przejezdność i zapisać wynik. Potrzebne: przykład lub własne dane, punkty, obliczenie, mapa, wynik, historia, odzyskiwanie dostępu i ograniczenia interpretacji.

| Element | Lokalizacja | Decyzja | Uzasadnienie |
| --- | --- | --- | --- |
| „ANALIZA DOSTĘPNOŚCI DROGOWEJ” + „Sprawdź trasę omijającą zalanie.” | Intro | Uprość | Jeden rzeczowy H1; temat powtarza się w dwóch miejscach. |
| Podtytuł krok po kroku + osobny opis przykładu | Pod H1 | Uprość | Krótka instrukcja przy przykładzie; oznaczenie syntetycznych danych pozostaje widoczne. |
| „Przygotuj dane i punkty trasy · bez plików” | W przycisku przykładu | Usuń | Przycisk może mieć jedną etykietę. |
| „Rzeczywiste przetwarzanie” | Dolny blok 01 | Usuń | Nie pomaga wykonać analizy ani ocenić konkretnego wyniku. |
| „Trwałe, prywatne wyniki” | Dolny blok 02 | Usuń | Informacja o kluczu i historia są już w części operacyjnej. |
| „Jawne źródło i ograniczenia” | Dolny blok 03 | Usuń | Źródło i ograniczenia należy pokazać przy danych i wyniku. |
| „Import zewnętrzny · tylko operator” z polem klucza serwera | Panel boczny | Usuń z publicznego UI | Rekruter nie ma klucza operatora; funkcję umieścić w prywatnym narzędziu. Backend nadal musi wymagać autoryzacji. |
| Zmiana klucza, zapis klucza i usunięcie przestrzeni | Dostęp do przestrzeni | Uprość | Schować operacje rzadkie w istniejących szczegółach; nie usuwać możliwości zachowania dostępu. |
| Limity GeoJSON, WGS84 i typy geometrii | Formularz uploadu | Zostaw | Bezpośrednio wpływają na poprawność wejścia. |
| Cztery metryki trasy, źródło danych, historia | Wynik | Zostaw | W przeciwieństwie do kart reklamowych opisują wynik wykonanej analizy. |
| Zastrzeżenie o braku rekomendacji ewakuacyjnej | Przy wyniku/obliczeniu | Zostaw | Konieczne dla właściwej interpretacji; nie ukrywać w README. |

Docelowy porządek: przykład jako najkrótsza ścieżka; własne GeoJSON jako druga opcja; punkty i obliczenie bezpośrednio pod mapą; historia poniżej. Nie zaczynać wizyty od ręcznego zarządzania przestrzenią, gdy przycisk przykładu może ją utworzyć.

### Dual-Agent Support / Relay

Główna funkcja: routing pytania do części technicznej lub rozliczeniowej, odpowiedź z dowodem, wieloturowy przypadek. Potrzebne: przykłady, rozmowa, stan oczekiwania, źródła i narzędzia odpowiedzi, reset oraz informacja o symulacji. Trzy kolumny i rozbudowane intro nadają mu charakter prezentacji produktu.

| Element | Lokalizacja | Decyzja | Uzasadnienie |
| --- | --- | --- | --- |
| „The right agent. The right context.” | H1 | Uprość | Nie nazywa funkcji; sugeruje inteligencję, której publiczny tryb regułowy nie demonstruje. |
| „Ask a question. Follow the route. Inspect the evidence.” | Intro | Usuń | Dubluje układ rozmowy i inspektora. |
| „JAVA 17 / TWO SPECIALISTS / ONE CONVERSATION” | Nad H1 | Usuń | Stos jest w opisie projektu; niepotrzebny w operacyjnym interfejsie. |
| Zielona kropka „Interactive sample” | Intro | Uprość | Zostawić rzeczową informację „Rule-based demo; no live AI calls”, bez ozdobnej kropki. |
| „01 / TRY A SCENARIO”, A.01/B.01/R.01, „02 / CONVERSATION”, „03 / BEHIND THE REPLY” | Kolumny | Usuń | Dekoracyjne numery komplikują skanowanie. |
| Pięć dużych kart scenariuszy | Lewa kolumna | Uprość | Krótkie przyciski przykładów nad rozmową; bez osobnej pełnej kolumny. |
| Duża wiadomość powitalna | Pusty czat | Uprość | Przykłady i informacja o regułach są już widoczne. |
| Schemat You → router → dwóch specjalistów | Inspektor | Usuń | Trasa odpowiedzi poniżej podaje konkretną decyzję. |
| Selected route, Tools executed, Documentation sources | Inspektor | Zostaw / Uprość układ | To wartościowa funkcja diagnostyczna. Na wąskim ekranie pod odpowiedzią albo w zwijanych szczegółach. |
| How this demo works | Dół inspektora | Uprość | Link do README/opisu projektu zamiast kolejnego akapitu na ekranie. |
| Dane fikcyjne, brak emaili/płatności, limit 30 tur i retencja | Scenariusz / formularz | Zostaw | Wyjaśniają rzeczywiste granice działania i kosztu. |

Docelowy porządek: rozmowa z przykładami nad formularzem i szczegóły aktualnej odpowiedzi obok. Zachować rozróżnienie demo regułowego i integracji OpenAI w CLI.

### Posture Lab

Główna funkcja: obliczyć geometrię z RGB-D i punktów, pokazać jakość danych i wynik; w głównej aplikacji zapisać historię i eksport. To narzędzie, ale wejście nadal jest rozbudowaną prezentacją. Rekruter bez RGB-D ma łatwiejszy start w `/lab`.

| Element | Lokalizacja | Decyzja | Uzasadnienie |
| --- | --- | --- | --- |
| „Twoje ujęcia. Sprawdzalna geometria.” | H1 `/` | Uprość | Rzeczowa nazwa funkcji będzie krótsza i bardziej jednoznaczna. |
| „APLIKACJA / WŁASNE DANE / TRWAŁA HISTORIA” | Nad H1 `/` | Usuń | Powtarza formularz, historię i tytuł. |
| „Konto właściciela” i login/hasło | Publiczny ekran startowy | Usuń z publicznego wejścia | Przenieść do prywatnego originu/panelu; sam formularz nie oznacza ujawnienia uprawnień administracyjnych. Gość ma być główną akcją. |
| „Najpierw jakość danych. Potem pomiar.” | H1 `/lab` | Uprość | Nazwać analizę zamiast budować slogan. |
| „ENGINEERING DEMO / 01”, „01 / ZDEFINIUJ UJĘCIE”, „02 / WYNIK SILNIKA” | Nagłówek i panele `/lab` | Usuń | Dekoracyjne indeksy nie odpowiadają potrzebnym krokom użytkownika. |
| Schemat projekcji depth do 3D | Formularz `/lab` | Uprość | Przenieść do istniejących „Metryk i śladu obliczeń”; nie usuwać wyjaśnienia z projektu. |
| Ręczne punkty i kalibracja rozwinięte po wyborze JSON | Formularz `/` | Uprość | Schować po udanym wczytaniu metadanych; pokazanie 0/4 myli mimo kompletu punktów w JSON. |
| Ogólny limit 50 ujęć / 100 MiB w sesji gościa | Upload `/` | Uprość | Gość widzi już 3 ujęcia / 20 MiB; pokazywać limit właściwy dla bieżącego trybu. |
| Ostrzeżenia o kalibracji, wyrównaniu i jakości | Formularz i wynik | Zostaw | Decydują o interpretacji; „zaakceptowane” nie znaczy wiarygodne klinicznie. |
| Informacje: syntetyczne dane, brak AI, brak walidacji klinicznej | `/lab` | Zostaw | Usunięcie sugerowałoby właściwości, których przykład nie pokazuje. |
| Historia i eksport PDF/JSON | `/` | Zostaw | Konkretne działające funkcje, a nie ozdoby. |

Docelowy start z portfolio: „Przykład syntetyczny” jako najprostsza ścieżka i „Własne RGB-D” jako druga. Nie podstawiać symulacji pod opis rzeczywistego pomiaru z kamery.

### KawiARKA i OVILE

To strony kawiarni i fundacji, więc ton zapraszający nie jest sam w sobie wadą. Nie trzeba upodabniać ich do narzędzi developerskich.

| Element | Lokalizacja | Decyzja | Uzasadnienie |
| --- | --- | --- | --- |
| „Proste smaki, zrobione z sercem” | KawiARKA, menu | Uprość | „Menu” szybciej prowadzi do informacji; nie usuwać samej zawartości menu. |
| Powtórzona etykieta i nagłówek „Napoje” | KawiARKA, karta menu | Usuń etykietę | Jedna nazwa kategorii wystarczy. |
| „Każda kawa jest zaproszeniem do spotkania.” | KawiARKA, zdjęcia | Usuń | Powtarza misję opisaną obok. |
| Dane odwiedzin, menu, zdjęcia gospodarzy | KawiARKA | Zostaw | Są celem strony i zostały powiązane z działającymi kontrolkami. |
| „Bądź na bieżąco” nad „Aktualności” | OVILE, strona główna | Usuń etykietę | Duplikat informacji. |
| Ogólny drugi akapit hero o relacjach | OVILE, hero | Uprość | Jedno konkretne zdanie o odbiorcach i działalności wystarczy. |
| Aktualności, kontakt, statut, sprawozdania | OVILE | Zostaw | Mają konkretne znaczenie dla odbiorców fundacji. |

## 5. PRZED / PO / DLACZEGO / WPŁYW

Dla pozycji oznaczonych powyżej „Usuń” wersją PO jest usunięcie całego wskazanego tekstu/panelu. Bez sloganu zastępczego; uzasadnienie i wpływ opisują sąsiednie kolumny. Poniższe przykłady precyzują pozycje wymagające nowego tekstu lub zmiany przepływu.

| Miejsce | PRZED | PO (PL / EN, gdy dotyczy) | DLACZEGO | WPŁYW |
| --- | --- | --- | --- | --- |
| TaskMesh, H1 | Small tasks. Built to go further. | Zadania / Jobs | Nazywa widok, bez obietnicy marketingowej. | Formularz i historia stają się główną treścią. |
| TaskMesh, panel trwałości | Under the hood + Durable by design + No black boxes | Usunąć panel; szczegóły pozostają przy zadaniu i w opisie projektu | Konkretna próba jest lepszym dowodem od deklaracji. | Mniej przewijania do listy zadań. |
| SentinelHub, H1 | Sprawdź trasę omijającą zalanie. | Analiza przejezdności / Route analysis | Opisuje funkcję bez rozbudowanego intro. | Mapa i wejście są widoczne wcześniej. |
| SentinelHub, przykład | Wielowierszowy przycisk i dwa opisy | Wczytaj przykład / Load example; obok „Dane syntetyczne / Synthetic data” | Jedna akcja i niezbędny kontekst danych. | Mniej czytania, zachowana uczciwość przykładu. |
| SentinelHub, import operatora | Pole klucza operatora w publicznym panelu | Usunąć z publicznego panelu; prywatne narzędzie operatora | Odwiedzający nie ma tych uprawnień. | Krótszy interfejs i mniejsza powierzchnia błędów obsługi. |
| Dual-Agent, H1 | The right agent. The right context. | Support demo | Nazwa narzędzia; informacja „Rule-based; no live AI calls” zostaje przy wejściu. | Mniej nadinterpretacji możliwości AI. |
| Dual-Agent, scenariusze | Pięć rozbudowanych kart z indeksami | HTTP 401 · Webhooks · Pricing · Sample refund · Out of scope | Same nazwy przekazują wybór. | Więcej szerokości dla rozmowy i dowodów. |
| Posture, H1 `/` | Twoje ujęcia. Sprawdzalna geometria. | Analiza RGB-D / RGB-D analysis | Konkretna funkcja zamiast hasła. | Krótsze wejście, bez zmiany tożsamości projektu. |
| Posture, H1 `/lab` | Najpierw jakość danych. Potem pomiar. | Przykład analizy geometrii / Geometry analysis example | Tryb danych opisuje istniejąca informacja o syntetycznym przykładzie. | Jasne oczekiwanie co do wyniku. |
| Posture, start | Login właściciela obok gościa i osobny link `/lab` | Przyciski „Przykład syntetyczny” i „Własne RGB-D”; logowanie poza publicznym startem | Rekruter zwykle nie ma kamery ani konta. | Może zacząć bez przygotowania plików. |
| Publiczne portfolio, opis CI | I designed the system… | Wprowadzić potwierdzony w lokalnej wersji podział: projekt zespołowy i osobisty zakres autora | Wdrożony opis nie wyjaśnia tego tak jasno jak lokalny. | Większa precyzja oceny wkładu; bez dopisywania nowych zasług. |
| Karty portfolio | Explore the project: my implementation, architecture, and skills | Opis projektu / Project details | Zawartość nie wymaga listy w etykiecie przycisku. | Szybsze skanowanie i mniej zawijania na wąskim ekranie. |
| KawiARKA, menu | Proste smaki, zrobione z sercem | Menu | Użytkownik szuka oferty. | Krótsza droga do informacji. |
| OVILE, aktualności | Bądź na bieżąco + Aktualności | Aktualności | Jedna etykieta zamiast dwóch. | Mniej wizualnego szumu. |

### Treści portfolio

Zachować neutralną paletę, typografię Inter, prostą nawigację, fotografie, odnośnik do CV, podział PL/EN i rzeczowe opisy ograniczeń. Nie ma powodu projektować strony od nowa.

Ograniczyć powtarzanie informacji między kartą, rozwinięciem i osobną stroną projektu. Karta: funkcja, wkład, istotny kompromis, wynik, linki. Architektura i szczegółowe testy: osobny opis. Numery kategorii i techniczne badge'e nie muszą pojawiać się w każdym miejscu. Stos w jednej linii albo kilka najważniejszych technologii, reszta w szczegółach.

Publiczne O mnie ma długi wstęp biograficzny przed informacją zawodową. Skrócić go do krótkiego akapitu o kierunku pracy, a zainteresowania zachować jako wybrane przykłady. Lokalna wersja już lepiej rozdziela doświadczenie zawodowe i osobiste zainteresowania. Nie usuwać osobowości autora w ramach walki z „AI-owością”.

Nie przenosić bez sprawdzenia lokalnych metryk i zapowiedzi na stronę publiczną. Szczególnie lokalna zapowiedź NASA Space Apps 2026 wymaga aktualizacji do stanu na 21.10.2026 na podstawie rzeczywistego udziału autora. Nie dopisywać wyniku ani osiągnięcia. Deklaracje o 101 testach, 1000 zadaniach i pomiarach z wcześniejszych opisów nie zostały odtworzone podczas tego audytu.

## 6. Technika, dostępność i wydajność

**Sprawdzone:** przełączenie PL/EN na publicznej stronie projektów, zmiana tytułu, otwarcie menu i zamknięcie Escape; odnośniki mailto/tel i CV są obecne na stronie Kontakt. Strony mają H1, opisy meta, a lokalne źródła zawierają canonical, OG i link pomijający nawigację. Publiczne Contact nadal opisuje stanowisko automotive, podczas gdy lokalna treść kieruje profil ku backendowi — uspójnić po ustaleniu wersji do publikacji.

Zebrane logi nie zawierały błędów/warningów JavaScript dla sprawdzonych siedmiu kart w momencie pomiaru. Nie jest to test wszystkich funkcji. TaskMesh, SentinelHub, Dual-Agent i Posture miały szerokość 1280 px bez poziomego przepełnienia dokumentu. Publiczne projekty w widocznym panelu miały 622 px, również bez przepełnienia. Zrzuty i rozmiary są zapisane. Próba ustawienia 390/1440 px przez narzędzie nie zmieniła rzeczywistych wymiarów; nie deklaruję testu tych breakpointów. Potrzebny jest jeszcze prawdziwy telefon lub wiarygodna emulacja 390/360 px.

Przy ocenie `missingImages` należy rozróżnić niezainicjowane obrazy lazy-load od błędnego pobrania. W KawiARCE część zdjęć poza widokiem nie była jeszcze załadowana; nie zakwalifikowano ich automatycznie jako 404. OVILE ma również zewnętrzne obrazy Facebook CDN — do osobnego sprawdzenia w widoku i po czasie. Nie ogłoszono awarii tych obrazów bez dowodu.

TaskMesh ma pobrany bundle JavaScript ok. 247 kB bez kompresji. Pozostałe sprawdzone skrypty mają ok. 5–19 kB. To rozmiary plików, nie wynik Lighthouse ani transfer po kompresji. Bez pomiaru LCP/INP/CLS na telefonie nie nadaję oceny Core Web Vitals. Najprostsza optymalizacja postrzeganej szybkości: usunąć treści nad formularzem i historią, nie dodawać nowego frameworka.

Nie wykonano pełnego audytu WCAG ani pomiaru wszystkich kontrastów. Następny odbiór powinien objąć kolejność fokusu, fokus w modalu zadania, wybór punktów mapy bez myszy, czytnik ekranu i skalowanie 200%. W SentinelHub istnieją tekstowe pola współrzędnych, więc kliknięcie mapy nie jest jedyną drogą. W Posture ręczne oznaczanie na canvasie wymaga osobnego sprawdzenia alternatywy klawiaturowej; JSON jest alternatywnym wejściem, ale nie dowodem pełnej dostępności.

## 7. Infrastruktura i bezpieczeństwo: ustalenia i plan

| Obszar | Ustalenie | Działanie i sposób potwierdzenia |
| --- | --- | --- |
| Stabilny adres SentinelHub | Potwierdzony Quick Tunnel; hostname tymczasowy | Zastąpić nazwanym tunelem i stałą domeną albo istniejącym publicznym Funnel z właściwą trasą. Po restarcie link ma pozostać identyczny; powtórzyć przykład z innej sieci. |
| Tailscale | Publiczne A i działające połączenie do publicznego IP; konfiguracja hosta nieznana | Na serwerze sprawdzić `tailscale funnel status` i `tailscale serve status`; Serve samo w sobie nie wystarcza dla odbiorcy bez VPN. Nie wnioskować z domeny ani nie przełączać ustawień w ciemno. |
| Port 8443 | Trzy aplikacje używają niestandardowego portu HTTPS | Sprawdzić LTE i sieć firmową. Jeśli blokowany, wystawić potrzebne demo przez istniejący publiczny ingress na 443; nie otwierać dodatkowych portów backendów. |
| CORS / API | Obserwowane żądania są same-origin | Zachować API pod originem każdej aplikacji; preflight z portfolio nie musi być dozwolony. Przy faktycznym rozdzieleniu originów dodać ścisłą listę adresów, metod i nagłówków oraz test przeglądarkowy. |
| Reverse proxy | Nagłówki i przepływy HTTP działają; konfiguracja Nginx/Caddy niedostępna | Zweryfikować mapowanie ścieżek, trailing slash, limity body/timeouts i brak fallbacku HTML na błędny adres API. Nie zmieniać globalnego proxy bez konfiguracji i kopii. |
| Restart usług | Brak dostępu do uruchomionych jednostek | Potwierdzić autostart demona kontenerów, tunelu i samych usług. Następnie kontrolowany restart jednego demo i hosta w uzgodnionym oknie; test z LTE po każdym etapie. Healthcheck sam nie restartuje niezdrowego kontenera. |
| NAT, CGNAT, firewall | Nie ustalono topologii; działające publiczne przekaźniki nie wymagają dowodu publicznego IP domu | Zachować publikację przez tunel wychodzący. Nie otwierać routera, SSH, Dockera, baz ani podsieci. CGNAT nie diagnozować na podstawie samego braku odpowiedzi narzędzia WWW. |
| Dostęp operatora | SentinelHub pokazuje pole klucza operatora; Posture formularz właściciela | Usunąć je z publicznego przepływu i pozostawić prywatny dostęp. Nie stwierdzono ominięcia autoryzacji ani dostępu do panelu admina. Sprawdzić brak uprzywilejowanych tras w konfiguracji ingressu. |
| Sekrety | W odczytanych zasobach nie zidentyfikowano jawnych haseł ani sekretnego klucza API | Sprawdzić także zmienne backendu, obrazy, historię Git i logi na serwerze; tego nie obejmowała obecna kontrola. Klucze operatora/LLM wyłącznie po stronie serwera. |
| Izolacja demo | Wspólny origin i różne prefiksy dla trzech projektów | Preferować osobne subdomeny, kontenery, sieci i magazyny. Przy wspólnym originie sprawdzić Path/HttpOnly/Secure/SameSite cookies i wpływ ewentualnego XSS między aplikacjami. Dwa różne taby tego samego profilu nie są testem izolacji. |
| Limity | UI pokazuje limity zadań, tur, uploadów i historii; nie wykonano testu wyczerpania | Potwierdzić serwerowe limity żądań, czasu, współbieżności i pojemności globalnej, także po utworzeniu wielu sesji. Limit jednej sesji nie ogranicza całej usługi. |
| Dane użytkowników | Testy używały fikcyjnych danych; zachowanie retencji tylko zadeklarowane w UI | Test dwóch sesji bez dostępu do cudzych obiektów; walidacja plików i rozpakowanych obrazów; automatyczne sprzątanie po czasie i globalny limit dysku. Bez danych medycznych w publicznym przykładzie. |
| Bezczynność i zasilanie | Nie przeprowadzono próby wielogodzinnej | Powtórzyć po 1 h i 24 h, po restarcie tunelu oraz po odzyskaniu łącza. Monitoring z zewnątrz ma wykonać drobny scenariusz, a nie tylko sprawdzać HTML. |

### Co rzeczywiście widać w publicznych konfiguracjach

Publiczny `SentinelHub/docker-compose.yml` (odczytane HEAD `bf4fff531a27c5ddf2034af6bc439c7b2168f5af`) publikuje `8000:8000` i `8080:80`, bez wskazania loopback i bez widocznej polityki restartu w tym pliku. To potencjalnie zbyt szerokie nasłuchiwanie **w tej konfiguracji**, nie dowód publicznego dostępu do tych portów ani opis faktycznego wdrożenia. Plik nie odpowiada w oczywisty sposób bogatszym deklaracjom utrzymaniowym w portfolio. Trzeba wskazać rzeczywisty commit wdrożenia i właściwy compose/override.

Publiczny `Dual-agent-support-chatbot/compose.yaml` (HEAD `60f839e446a4102edf33c2d94c932a6e76d3b3bb`) zawiera loopback `127.0.0.1:${DEMO_PORT:-8091}:8080`, `restart: unless-stopped`, healthcheck, read-only filesystem, tmpfs, ograniczenia CPU/RAM/PID, usunięte capabilities i rotację logów. To sensowny punkt wyjścia. Nie sprawdzono egzekwowania tych ograniczeń przez kernel hosta ani zgodności uruchomionego obrazu z repozytorium.

### Najprostszy wariant dla obecnego homelabu

Zachować Raspberry Pi i działający stos aplikacji. Najpierw sprawdzić, czy obecny Funnel już publikuje potrzebne trasy. Jeżeli tak, nie ma potrzeby migracji wszystkich aplikacji do chmury. Dla SentinelHub usunąć zależność od losowego adresu Quick Tunnel. Jeśli autor ma domenę w Cloudflare, użyć nazwanego tunelu uruchamianego jako usługa i osobnych subdomen aplikacji; bez domeny można rozważyć istniejący adres Funnel. Własna domena jest opcją stabilnego nazewnictwa, nie warunkiem zakupu hostingu.

Publiczny tunel ma prowadzić tylko do dedykowanego reverse proxy demonstracji. Proxy udostępnia konkretne aplikacje i ich potrzebne endpointy, a nie cały host. Przy proxy na hoście backendy wiązać do loopback; przy proxy w kontenerze użyć wydzielonej sieci kontenerów bez publikowania portów baz. Ostatnia reguła ingressu powinna odrzucać niepasujące hosty/ścieżki. Dostęp właściciela, SSH i narzędzia utrzymaniowe pozostają prywatne.

Nie podano gotowego pliku do nadpisania działającego proxy: brak jego konfiguracji i dokładnych portów wszystkich usług. Powyższy plan nie wymaga otwierania portów w routerze ani udostępniania sieci domowej.

## 8. Plan naprawy i ponownego odbioru dla projektów

| Projekt | Zmiana przed odbiorem | Ponowna weryfikacja poza siecią domową |
| --- | --- | --- |
| TaskMesh | Potwierdzić publiczny Funnel i zachowanie portu 8443; przy blokadzie przejść na 443. Usunąć marketingowe intro, zachować ślad zadania. | Nowa sesja → jedno zadanie ze znanym tekstem → stan Completed → zgodne liczniki → reload i odczyt; potem druga niezależna sesja bez pierwszego zadania. |
| SentinelHub | Stały adres tunelu, autostart, ograniczony publiczny proxy; schować import operatora. WMS oznaczać jako niedostępny niezależnie od działającego przykładu. | LTE → przykład → objazd → historia → eksport → zapis klucza → nowa wizyta i odczyt; po kontrolowanym restarcie sprawdzić ten sam URL i wynik. |
| Dual-Agent | Zweryfikować publiczny ingress; uprościć intro, scenariusze i schemat routera. Zachować oznaczenie publicznego trybu regułowego. | HTTP 401 → TECH ze źródłem → Pro → BILLING → zwrot z fikcyjnymi danymi w kilku turach → identyfikator DEMO; brak wywołania email/płatności; test limitu w środowisku testowym. |
| Posture Lab | Publiczny start prowadzący do przykładu; konto właściciela poza tym startem; limity adekwatne do gościa. Zweryfikować właściwe źródła wdrożenia. | LTE → `/lab` dodatni i ujemny scenariusz; następnie gość → syntetyczne pliki z audytu → 6 cm → historia → PDF → reload; druga sesja bez dostępu do ujęcia. Nie używać prawdziwych danych osoby. |

Jeżeli test pozostaje niewykonany lub nie przechodzi, stosować w portfolio **„Demo tymczasowo niedostępne” / “Demo temporarily unavailable”** zamiast aktywnego „Live Demo”. To decyzja o czasowym wyłączeniu linku do demonstracji, nie stwierdzenie diagnozy awarii serwera. Usunąć wtedy klikany przycisk uruchomienia i pozostawić opis/kod. Nie podmieniać aplikacji na makietę i nie dodawać fałszywego zielonego statusu. Oznaczenie musi objąć wszystkie miejsca: główną stronę, listę projektów i osobne opisy.

**Nie zmieniono publicznych etykiet ani serwera w tym audycie.** Przygotowano raport i narzędzie odczytowe. Wcześniejsza zapowiedź oznaczenia demonstracji nie jest informacją o wykonanym wdrożeniu. Ze względu na rozjazd lokalnej i publicznej wersji zmiany etykiet należy nanieść na uzgodnioną aktualną wersję, bez cofania TaskMesh i Posture Lab.

### Jak wykonać brakujący test

1. Telefon: wyłączyć Wi-Fi i VPN/Tailscale na urządzeniu testowym, użyć LTE/5G i prywatnej sesji przeglądarki. Otworzyć **portfolio**, a dopiero stamtąd kliknąć każdy link. Nie kopiować właścicielskich sesji ani kluczy.
2. Przejść scenariusze z tabeli powyżej. Zapisać datę, sieć, finalny URL, operację, wynik i zrzut. W narzędziach developerskich na drugim niezależnym komputerze potwierdzić prawdziwy endpoint, status odpowiedzi i brak mixed content/CORS.
3. Z drugiego komputera na niezależnej sieci uruchomić `node scripts/audit-public-demos.mjs > network-audit-external.json`. Wymaga Node z wbudowanym fetch, np. Node 18+. Skrypt sprawdza publiczny IPv4 DNS, TLS, 17 adresów HTTP oraz cztery preflighty, bez cookies i bez tworzenia danych. Nie zastępuje kliknięć ani testu IPv6.
4. Osobno sprawdzić sieć firmową (szczególnie 8443), odświeżenie i bezpośrednie podstrony, a z właścicielem serwera restart i ponowne wejście po 1/24 h. Nie wykonywać restartu wszystkich prywatnych usług.
5. Dla każdej aplikacji dopiero po poprawnym przebiegu zmienić zewnętrzne statusy w tabeli i przywrócić przycisk demo. Pojedynczy wynik 200 albo działanie z VPN nie spełnia odbioru.

## 9. Ranking 15 zmian

| Priorytet | Zmiana | Wpływ / warunek zakończenia |
| --- | --- | --- |
| 1 — krytyczny | Pełne testy czterech aplikacji z niezależnej sieci albo wyłączenie linków z czytelnym statusem | Zamknięcie podstawowego warunku publikacji; zapisy scenariuszy i wyników. |
| 2 — krytyczny | Ustalenie aktualnej wersji portfolio przed publikacją | Brak cofnięcia TaskMesh/Posture i wcześniejszej pracy autora. |
| 3 — wysoki | Stały adres SentinelHub i autostart tunelu | Ten sam link po restarcie, pełny scenariusz po ponownym uruchomieniu. |
| 4 — wysoki | Kontrola zakresu publicznego proxy i usunięcie UI operatora/właściciela z wejścia do demo | Publiczne tylko niezbędne operacje; prywatne usługi bez ekspozycji. |
| 5 — wysoki | Powiązanie kodu, obrazu i konfiguracji wdrożenia; naprawa nieodtwarzalnego compose SentinelHub | Znany commit i powtarzalne uruchomienie bez rozszerzania portów. |
| 6 — wysoki | Potwierdzenie limitów globalnych, izolacji i sprzątania danych | Dwie niezależne sesje bez wymiany danych; ograniczona pojemność całego demo. |
| 7 — wysoki | Usunięcie sloganów i panelu Under the hood w TaskMesh | Główna akcja i wyniki zajmują pierwszy plan. |
| 8 — wysoki | Usunięcie trzech dolnych kart SentinelHub | Krótszy interfejs; potrzebne ograniczenia pozostają przy danych/wyniku. |
| 9 — wysoki | Uproszczenie Dual-Agent do rozmowy, przykładów i dowodów odpowiedzi | Mniej dekoracyjnej nawigacji bez utraty diagnostyki. |
| 10 — wysoki | Łatwy przykład Posture Lab z wejścia portfolio | Rekruter otrzymuje wynik bez kamery i konta. |
| 11 — średni | Testy 360/390 px, klawiatury, modali i kontrastu | Rzeczywiste sprawdzenie, nie wniosek z samych media queries. |
| 12 — średni | Jedno miejsce szczegółów architektury zamiast powielania na trzech ekranach | Krótsze karty i opisy bez utraty treści technicznej. |
| 13 — średni | Uspójnienie PL/EN, osobistego wkładu i dat na publicznej wersji | Jedna aktualna narracja bez dopisywania osiągnięć. |
| 14 — średni | Restart, bezczynność, odnowienie TLS i zewnętrzny test funkcjonalny | Działanie po czasie i awarii; monitoring nie kończy się na HTML 200. |
| 15 — niski | Drobna redukcja etykiet i powtórzeń w KawiARCE/OVILE | Zachowany charakter stron i informacje potrzebne odbiorcom. |

## 10. Wdrożenie uproszczeń w czterech etapach

**1. Szybkie usunięcia.** Najpierw domknąć bramkę dostępności lub czasowo wyłączyć niezweryfikowane linki. Usunąć wskazane slogany, duplikaty nagłówków, indeksy i dekoracyjne badge'e. Nie zmieniać wyglądu rzeczywistych statusów zadania, źródeł i ostrzeżeń jakości.

**2. Layouty aplikacji.** TaskMesh: formularz nad historią, szczegóły zadania i jedna zakładka workerów. SentinelHub: przykład/własne dane, mapa, punkty, wynik, historia; rzadkie operacje przestrzeni w szczegółach. Dual-Agent: jedna rozmowa i dowody odpowiedzi. Posture: wejście przez przykład albo własne pliki, bez loginu właściciela na pierwszym ekranie. Zachować istniejące kolory i komponenty, o ile spełniają te cele.

**3. Struktura i UX.** Zweryfikować prawdziwe szerokości mobilne, kolejność klawiatury, fokus, walidację i komunikaty. W Posture rozróżnić ręczne punkty od poprawnie wczytanego JSON i pokazywać właściwe limity gościa. W SentinelHub sprawdzić zapis i ponowne otwarcie klucza. Wykonać odpowiednie testy po zmianach logiki; sama zmiana tekstu nie wymaga budowy nowego zestawu testów jednostkowych.

**4. Uspójnienie portfolio.** Uzgodnić wersję publiczną z checkoutem; skrócić karty i etykiety przycisków, zachować rzetelny wkład i ograniczenia. Aktualizować adresy we wszystkich miejscach naraz. Publikować dopiero po ponownych scenariuszach z zewnętrznej sieci lub po czytelnym wyłączeniu danej demonstracji.

### Konkretne pliki i miejsca sprawdzone podczas audytu

| Plik / zasób | Proponowana zmiana |
| --- | --- |
| Lokalne `index.html`, `projects.html` | Uzgodnić z publicznymi odpowiednikami; nie nadpisywać bez przeniesienia TaskMesh i linku Posture. Skrócić CTA i dublowane opisy. |
| Lokalne `sentinelhub/index.html` | Dwa odnośniki do tymczasowego hosta; aktualizować razem. Rozdzielić historyczne sprawdzenia od aktualnego statusu. |
| Lokalne `dual-agent/index.html` | Odnośnik do aplikacji i treści opisujące publiczny tryb; utrzymać jawny podział reguły/CLI OpenAI. |
| Lokalne `about.html`, `contact.html` | Uspójnić publiczne i lokalne stanowisko/profil; zwięzły wstęp zawodowy i czytelny kontakt. |
| Lokalne `script.js`, `style.css` | Zachować przełączanie języka, menu, focus states i reduced motion; obecny audyt nie uzasadnia ich przepisania. |
| Pobrane TaskMesh `assets/index-BE_JjJel.js` | Rozpoznane hasła, formularz, historia i API. Brak lokalnego źródła React; nie wymyślano nazw komponentów TSX. Zmianę wykonać w prawdziwym źródle i zbudować ponownie, nie edytować zminifikowanego bundle'a. |
| Pobrane Dual-Agent `/support/` i `/support/app.js` | Intro, scenariusze, inspektor; zachować kontrakt `api/chat` i obsługę błędów/resetu. |
| Pobrane SentinelHub `/`, `/workspace.js` | Usunięcia `.explanation`, uproszczenie intro, schowanie operatora; zachować obsługę klucza, historii i błędów. |
| Pobrane Posture `/`, `/lab`, `/assets/full-app.js`, `/assets/app.js` | Uproszczenie nagłówków i startu, pola kalibracji zależne od trybu, właściwe limity. Źródło repozytorium pozostaje niepotwierdzone. |
| Publiczne `SentinelHub/docker-compose.yml` i `Dual-agent-support-chatbot/compose.yaml` | Powiązać z rzeczywistym wdrożeniem; konfigurację dostosować do sposobu uruchomienia proxy. |

## 11. Ocena rekrutacyjna

To nie są wyłącznie efektowne makiety. Wykonane scenariusze dowodzą pracy kolejki, API, obliczeń, źródeł odpowiedzi i trwałej historii w zakresie opisanym w raporcie. Najlepsze momenty prezentacji to wynik zadania z inputem i próbą, objazd z zapisanym wynikiem, źródło odpowiedzi TECH oraz świadome odrzucenie ujęcia bez depth.

Nie dowiedziono podczas tego audytu odporności na awarie workerów, dokładnej semantyki ponowień, izolacji wszystkich danych ani poprawności wszystkich algorytmów. Te kompetencje wymagają kodu, testów i konkretnych przebiegów, a nie dopisku „production” czy „durable”. Publiczna wersja Dual-Agent demonstruje router regułowy i narzędzia, a nie jakość działania LLM. Posture demonstruje geometrię i kontrolę wejścia, a nie walidację medyczną.

Największy efekt dadzą: stabilny publiczny dostęp, krótsza droga do własnego wyniku, pokazanie dowodów działania i usunięcie deklaracji powtarzających te dowody. Zachować istniejącą tożsamość wizualną.

## Materiały, źródła i stan zmian

- `output/audit-2026-10-21/network-audit.json`: publiczne DNS, IP połączenia, certyfikaty, statusy, wybrane nagłówki, preflighty. Wygenerowano z tego komputera.
- `output/audit-2026-10-21/browser-flow-evidence.json`: konkretne wyniki przebiegów, bez klucza przestrzeni i cookies.
- `output/audit-2026-10-21/browser-metrics.json`: rzeczywiste szerokości, przepełnienia i logi; niezainicjowane obrazy nie są automatycznie uszkodzone.
- Zrzuty: `taskmesh-result.jpg`, `sentinelhub-result.jpg`, `support-refund.jpg`, `posture-sample.jpg`, `posture-upload-result.jpg`, `portfolio-622.jpg` w tym samym katalogu.
- `posture-report.pdf`: faktycznie pobrany eksport testowego ujęcia, bez audytu składu dokumentu.
- `make-synthetic-capture.mjs`, `synthetic-rgb.png`, `synthetic-depth.png`, `synthetic-capture.json`: odtwarzalne sztuczne wejście do testu uploadu.
- Pobrane publiczne HTML/JS i wybrane źródła konfiguracji: materiał odniesienia do stanu z dnia audytu, nie nowe źródła aplikacji do publikacji.
- [Cloudflare — Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/): tymczasowy hostname, brak gwarancji uptime, przeznaczenie testowe; stały adres wymaga odpowiedniego rozwiązania publikacji.
- [Tailscale — Funnel](https://tailscale.com/docs/features/tailscale-funnel): usługa może udostępniać aplikację osobom bez Tailscale; Serve ma inny zakres dostępu.
- [SentinelHub — sprawdzony compose](https://github.com/Adam-Sapiecha/SentinelHub/blob/bf4fff531a27c5ddf2034af6bc439c7b2168f5af/docker-compose.yml).
- [Dual-Agent — sprawdzony compose](https://github.com/Adam-Sapiecha/Dual-agent-support-chatbot/blob/60f839e446a4102edf33c2d94c932a6e76d3b3bb/compose.yaml).

Dodano raport, odczytowy skrypt `scripts/audit-public-demos.mjs` i lokalne materiały dowodowe. Nie modyfikowano wcześniejszych zmian HTML autora, nie publikowano aplikacji ani konfiguracji serwera. **Gotowość rekrutacyjna pozostaje niepotwierdzona do zamknięcia zewnętrznych testów lub czytelnego wyłączenia odnośnych demo w rzeczywistej wersji publicznej.**
