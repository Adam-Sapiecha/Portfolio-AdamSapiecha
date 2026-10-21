# Publikacja statycznego case study

> Ta prezentacja jest dodatkiem. Po nadrzędnej zmianie wymagań główną aplikacją jest tryb full z własnymi danymi i historią (README repozytorium). Samo case study nie oznacza ukończenia integracji sprzętowej.

Wystarczy skopiować **zawartość** tego katalogu do podkatalogu portfolio, np. `projekty/posture-lab/`, i dodać link do `projekty/posture-lab/`. Wszystkie adresy zdjęć, CSS, PDF i JSON są względne. Nie jest potrzebny backend, Docker, build frontendowy ani JavaScript.

Podgląd z repozytorium:

```sh
python -m http.server 8091 --bind 127.0.0.1
# http://127.0.0.1:8091/site/
```

Można też otworzyć `index.html` bezpośrednio z dysku. Serwer HTTP pozwala dodatkowo sprawdzić odpowiedzi zasobów. Przy publikacji konfiguracja hostingu musi dopuszczać pliki PNG, PDF, JSON i CSS. Nie kopiuj całego `outputs/`; wybrany zatwierdzony materiał jest już w `media/`.

Przykład osobnej subdomeny w istniejącym reverse proxy Nginx (HTTPS/certyfikaty zgodnie z konfiguracją serwera):

```nginx
# wewnątrz istniejącego server {} tej subdomeny
root /UZUPELNIJ/KATALOG/site;
index index.html;
location / { try_files $uri $uri/ =404; }
```

W podkatalogu istniejącego portfolio skopiuj zawartość `site/` do odpowiedniego katalogu już serwowanego przez hosting. Nie trzeba zmieniać konfiguracji innych projektów.

Pochodzenie: `data/sources.json` zawiera źródło archiwalnych obrazów i PDF oraz ich sumy SHA-256. Użytkownik potwierdził zgodę na publiczne pokazanie zdjęć w rozmowie 21.10.2026. Archiwalnych obrazów nie modyfikowano. Podgląd PDF wygenerowano narzędziem pdftoppm. Wyniki `*-sample.json` wygenerował aktualny silnik na danych syntetycznych; nie dotyczą osób na zdjęciach. Archiwalne wartości nie zostały przeliczone ani potwierdzone jako poprawne pomiary.

Opcjonalne odtworzenie wybranych zasobów: `python scripts/build_case_study.py` ze środowiska requirements-demo.txt; wymaga lokalnego, ignorowanego przez Git katalogu źródłowego outputs. Strona zawiera już gotowe zasoby i nie wymaga tego kroku do publikacji. Podgląd PDF: `pdftoppm -f 1 -singlefile -scale-to 1200 -png outputs/report_depth_upgrade_20260622_113401/report.pdf site/media/report-preview`.

Panel obliczeniowy pozostaje osobną opcją uruchomieniową pod `/lab` w serwerze Flask. Statyczna podstrona nie odwołuje się do niego i nie wykonuje żadnych żądań API.
