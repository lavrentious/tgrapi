<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/lavrentious/tgrapi">
    <img src="https://tifloguide.lavrent.dog/logo.png" alt="Logo" width="200" height="200" style="filter: drop-shadow(3px 3px 3px #aaa)">
  </a>

  <h3 align="center">tgrapi — Backend for <a href="https://tifloguide.lavrent.dog">TifloGuide</a></h3>

  <p align="center">
    Серверная часть веб-приложения <strong>TifloGuide</strong> 
    <br />
    <a href="https://api.tifloguide.lavrent.dog/docs"><strong>API документация »</strong></a>
    <br/ >
    <a href="https://api.tifloguide.lavrent.dog"><strong>Деплой »</strong></a>
  </p>
</div>

---

## О проекте

**TifloGuide** — это некоммерческий проект, цель которого — сделать городскую среду доступнее для людей с нарушением зрения.

Проект создан в сотрудничестве с **Бийским филиалом ЦРС ВОС**

Этот репозиторий содержит backend, написанный на **NestJS**, с функциональностью:

- REST API для фронтенда на React
- CRUD для сущностей (+ поиск, пагинация)
- загрузка фото с тифлокомментариями (хранение в **Cloudinary**)
- обратное геокодирование через **DaData API**
- JWT аутентификация и ability-based авторизация с помощью **CASL**

---

## Стек технологий

- ![NestJS][NestJS]
- ![TypeScript][TypeScript]
- ![Bun][Bun]
- ![MongoDB][MongoDB] *(subject to change)*
- ![CASL][CASL]

---

## Локальный запуск

Инструкция по локальному поднятию:

### Предварительные требования

1. **Окружение**:

- Node.js (>=18) + `pnpm`/`yarn` или `bun`
- MongoDB (локально или через Mongo Atlas)

2. **Внешние API**:

- Получить ключ Cloudinary
- Получить ключ DaData

### Инициализация и запуск

0. Клонировать репозиторий

   ```sh
   git clone https://github.com/lavrentious/tgrapi.git
   ```

1. Установить зависимости

   ```sh
   bun install
   ```

2. Создать и заполнить `development.env`/`production.env` файл на основе [example.env](./example.env)

   Указать:
   - Cloudinary ключи
   - DaData API ключ
   - Данные для MongoDB
   - JWT secrets

3. Запуск dev-сервера

   ```sh
   bun run start:dev
   ```

Сервер будет доступен на `http://localhost:3000`

---

## Использование

Полный список доступных эндпоинтов есть в Swagger (`/docs`)

Основные модули:

- `/records` — точки интереса на карте
   - `/records/:id/photos` — фото с тифлокомментариями
- `/users` — пользователи
- `/auth` — авторизация (регистрация, логин, jwt токены)
- `/password-resets` — сброс пароля

---

## Публикации

- Публикация на сайте организации **Камерата** - <a href="https://kamerata.org/tifloguide">ссылка</a>
   > Проект был представлен в 2021г на форуме туристических практик для инвалидов по зрению
- Публикация на сайте Бийского филиала ЦРС ВОС - <a href="http://new.crsnaumova.ru/index.php/it-platforma-tiflogid">ссылка</a>
- Отчет о реализации проектов в Нижнем Новгороде - <a href="https://asi.org.ru/2023/06/13/v-nizhnem-novgorode-dlya-lyudej-s-narusheniyami-zreniya-podgotovili-turisticheskie-programmy/">ссылка</a>

## Лицензия

Проект распространяется под лицензией MIT (см. `LICENSE`).

---

## Контакты

Автор — **lavrent** — <a href="https://lavrent.dog">lavrent.dog</a>

Репозиторий: [https://github.com/lavrentious/tgrapi](https://github.com/lavrentious/tgrapi)

Репозиторий фронтенда: [https://github.com/lavrentious/tgrfront](https://github.com/lavrentious/tgrfront)

[product-screenshot]: images/screenshot.png
[NestJS]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZSIgcm9sZT0iaW1nIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPk1vbmdvREI8L3RpdGxlPjxwYXRoIGQ9Ik0xNy4xOTMgOS41NTVjLTEuMjY0LTUuNTgtNC4yNTItNy40MTQtNC41NzMtOC4xMTUtLjI4LS4zOTQtLjUzLS45NTQtLjczNS0xLjQ0LS4wMzYuNDk1LS4wNTUuNjg1LS41MjMgMS4xODQtLjcyMy41NjYtNC40MzggMy42ODItNC43NCAxMC4wMi0uMjgyIDUuOTEyIDQuMjcgOS40MzUgNC44ODggOS44ODRsLjA3LjA1QTczLjQ5IDczLjQ5IDAgMDExMS45MSAyNGguNDgxYy4xMTQtMS4wMzIuMjg0LTIuMDU2LjUxLTMuMDcuNDE3LS4yOTYuNjA0LS40NjMuODUtLjY5M2ExMS4zNDIgMTEuMzQyIDAgMDAzLjYzOS04LjQ2NGMuMDEtLjgxNC0uMTAzLTEuNjYyLS4xOTctMi4yMTh6bS01LjMzNiA4LjE5NXMwLTguMjkxLjI3NS04LjI5Yy4yMTMgMCAuNDkgMTAuNjk1LjQ5IDEwLjY5NS0uMzgxLS4wNDUtLjc2NS0xLjc2LS43NjUtMi40MDV6Ii8+PC9zdmc+
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[NodeJS]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[PNPM]: https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220
[CASL]: https://img.shields.io/badge/CASL-%230a0a0a.svg?style=for-the-badge&logoColor=f69220&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACrUExURUxpcb2+v4aGh9PT1LS1uFtZW/Dw8GBfYJCQk/Lz81dYWoiIitrc31ZYW9HS00pKTdDR0t7h429wc3x+gKmqrNvg5GBhZOnr7YiJi2BhY3R2eNvc3LS2t1FTVuDg4d3d3lVXW21ub9jd4h0YGSEcHTQxMmhnaHp6fC0pKkE+P1VTVFBNT3Fxc8/Q0igjJNrc3+Pm6Ts3OcbGyCMgIUpHSaqpq0ZCRJ+foYOEht5QpOEAAAAjdFJOUwAiB079/+P+/fwrFI/fb0g43GzdTaWPvErAra9isbXPvdu/9PobLQAAAdtJREFUOMt9k9eCmzAQRemS1pjgEjtbUlEviI7//8vCUoztzeY+MoeZO0WOs8hz/ST+OihOjq7nPMp9e40QKqwx1gTw98t+cxfeJDtbVD0DqukaJUNJ4eEWSc+oYorwOpuFecjor6cl7keWCcCkasp8BkpCKN1+mcvvjFStrRjToZgIHFJFgH6ecviWqsoWpu8hAyUeAUkpIIxNKXwEqLHWVlUAteIjoAAARIMFoKAytiiKqr2EZALCMLwCKWIqGACEzBVopJScgcmDG0HRVmORnskJ6JRqONtOwCZqCQwGB0ELaTO2UXdNIwjbTrPyfgSc9m0A4UVLMnZRi64jAj7PK4mt6C4QagoUmYaZCyFyqU/LJBHNqWZSlBxPk8zLssR0buLdZY8bMMwIL7sYAJ7r7bIM72wIl7LMruKEYKG/X68iQTQTStwCPANgv15L1NZ5J/C6bY75WuG9DyMzMm9yBOpMXU43F5VGQY4JX4A6z/K7BI4XDy7qFcCZYqe7ozxGpszwjUt9+HYHeAnq6zWOJds/XP7mFbEVEPRl8+Fh/DR0iZfs8PTh5TjHnQHz/5cHA+v1j0QD4dH5p5LIaoxBELw5n8jfWQjtznc+VfqnKM6p8x+5cezef/kLIPhUGL5FhJAAAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII=
[Bun]: https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff&style=for-the-badge
