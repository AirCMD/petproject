# МАЛЮВАЧКА // DRAW.EXE

Сайт у стилі **відеогри** (cyberpunk HUD + indie game UI) для цифрового інструменту малювання.

## Стиль

- Neon HUD-навігація
- Glitch-заголовок
- XP-бари та rarity-теги (Legendary / Epic / Rare)
- CRT-сканлайни
- Зоряне поле на фоні
- Термінал-пошук
- Консоль-полотно для малювання
- Темна / світла тема

## Секції

| ID | Назва в грі | Зміст |
|----|-------------|-------|
| hero | START | Title screen + інтерактивний canvas |
| features | SKILLS | Можливості з rank-тегами |
| about | LORE | Про команду + achievements |
| docs | MANUAL | Документація |
| shop | INVENTORY | Безкоштовні пакети з rarity |
| gallery | GALLERY | Роботи спільноти |
| download | END SCREEN | Завантаження для OS |

## Запуск

Відкрий `index.html` у браузері або:

```bash
python -m http.server 8080
```

## GitHub Pages

1. Завантаж усі файли в репозиторій
2. Settings → Pages → Deploy from `main` / root
3. Готово

## Структура

```
malyuvachka-site/
├── index.html
├── css/styles.css
├── js/main.js
└── README.md
```
