# Strona projektu w portfolio

Rzeczowy opis kodu i działania: repozytorium, moduły, fragment funkcji,
oryginalne ujęcie pleców oraz wynik walidacji tego zapisu. Jasny, prosty układ,
bez JavaScriptu i z odnośnikiem do działającej aplikacji na Pi.

RGB, nakładka i depth mają wspólny kadr sylwetki w CSS: x=520..1000,
y=55..720 oryginału 1280×720. Kadrowanie dotyczy prezentacji; kliknięcie
otwiera pełny plik, a oryginalne piksele i współrzędne pomiarowe pozostają bez zmian.

Fotografie pochodzą z `outputs/rejected_20260622_135701`. Zgodę na publikację
potwierdzono w rozmowie. Ujęcie odrzucono z powodu synchronizacji; strona nie
przedstawia go jako zaakceptowanego pomiaru. PDF kontrolny pochodzi z osobnego
testu aplikacji na syntetycznych danych. Powiązania i SHA-256: `data/sources.json`.

`python scripts/build_case_study.py` odtwarza wybrane artefakty; wymaga lokalnych
oryginałów. Opublikowany katalog jest samowystarczalny: HTML, CSS i zwykłe pliki.
Wdrożenie: podkatalog `posture-lab/` w repozytorium portfolio, a także `/process/`
w obrazie aplikacji. Ścieżki zasobów są względne.
