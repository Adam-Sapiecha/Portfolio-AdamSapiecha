# Portfolio Adam Sapiecha

Statyczna strona portfolio/CV Adama Sapiechy. Projekt prezentuje profil IT, doświadczenie, projekty, zainteresowania oraz dane kontaktowe w dwóch wersjach językowych: PL i EN.

## Technologie

- HTML5
- CSS3
- JavaScript
- Tailwind CSS przez CDN
- Google Fonts
- Material Symbols

## Najważniejsze funkcje

- ciemny interfejs z zielonymi akcentami,
- przełączanie języka PL/EN zapisywane w `localStorage`,
- responsywna nawigacja z menu mobilnym,
- sekcja hero z CTA do projektów, kontaktu, CV, GitHuba i LinkedIna,
- karty projektów rozwijane po kliknięciu,
- statyczny formularz kontaktowy przygotowujący wiadomość mailową,
- metadane SEO, Open Graph, Twitter Card i dane strukturalne,
- poprawione focus states oraz obsługa `prefers-reduced-motion`.

## Struktura projektu

```text
.
├── index.html
├── about.html
├── projects.html
├── contact.html
├── favicon.svg
├── style.css
├── script.js
├── assets/
│   ├── Adam Sapiecha (1).jpg
│   ├── Adam_Sapiecha_CV.pdf
│   ├── Autostop1.jpeg
│   ├── Autostop2.jpg
│   ├── Góry.jpeg
│   ├── gory2.jpeg
│   └── Jacht.jpeg
└── README.md
```

## Uruchomienie lokalne

Strona nie wymaga procesu build ani backendu. Możesz otworzyć `index.html` bezpośrednio w przeglądarce albo uruchomić prosty serwer statyczny, na przykład:

```bash
python -m http.server 8000
```

Następnie wejdź na `http://localhost:8000`.

## Publikacja na GitHub Pages

1. Wejdź w ustawienia repozytorium na GitHubie.
2. Otwórz sekcję `Pages`.
3. Wybierz źródło: branch `main` oraz folder `/root`.
4. Zapisz ustawienia i poczekaj na publikację.

Docelowy adres dla tego repozytorium:

```text
https://adam-sapiecha.github.io/Portfolio-AdamSapiecha/
```

## Link do działającej strony

TODO: Po włączeniu GitHub Pages uzupełnić link, jeśli finalny adres różni się od przewidywanego adresu powyżej.

## Uwagi

Formularz kontaktowy nie wysyła danych do backendu. Po walidacji przygotowuje wiadomość w kliencie poczty użytkownika przez `mailto:`. Do prawdziwej wysyłki formularza należy dodać zweryfikowany endpoint lub usługę obsługującą formularze statyczne.
