# 🚀 CODE

Проект включает в себя серверную и фронтенд-часть для вычисления очков на основе выбора вершин игроками и анализа откликов. В этом репозитории вы найдете все необходимые компоненты для работы с API и взаимодействия с данным сервисом.

## 📦 Структура проекта

### 1. **Frontend**: 
Frontend для взаимодействия с пользователем.

- `frontend/src/` — Исходный код для интерфейса.
- `frontend/public/` — Публичные ресурсы, такие как иконки и HTML-шаблоны.
- `frontend/package.json` — Конфигурация NPM с зависимостями.
- `frontend/dockerfile` — Конфигурация Docker для контейнеризации фронтенда.

### 2. **Server**: 
Серверная часть, которая обрабатывает запросы и взаимодействует с базой данных.

- `server/routes/` — Маршруты API.
- `server/services/` — Логика серверных сервисов, таких как обработка данных и расчет.
- `server/utils/` — Утилиты для работы с файлами и подсчета очков.
- `server/docs/swagger.yaml` — Документация API с использованием Swagger.
- `server/dockerfile` — Конфигурация Docker для контейнеризации серверной части.

### 3. **Корневой каталог**:
- `.gitignore` — Файлы, которые не добавляются в репозиторий.
- `docker-compose.yml` — Команды для запуска всех частей проекта в Docker.
- `README.md` — Текущая документация.

## ⚙️ Как запустить

### 1. Клонировать репозиторий:
```bash
git clone https://github.com/Influence-Nexus/frontend.git
```

### 2. Установить зависимости для фронтенда и сервера:

- Для **фронтенда**:
  ```bash
  cd frontend
  npm install
  ```

- Для **сервера**:
  ```bash
  cd server
  pip install -r req.txt
  ```

### 3. Запустить Docker контейнеры:
В корневом каталоге проекта выполните команду:
```bash
docker-compose up --build
```

Это создаст и запустит все необходимые контейнеры для проекта.

## 📚 Документация API

API доступно через [Swagger](http://localhost:5000/api/docs) для подробного описания всех эндпоинтов.

## 🔧 Тесты

Тесты для серверной части находятся в папке `server/tests`. Для их запуска используйте:
```bash
pytest server/tests
```
