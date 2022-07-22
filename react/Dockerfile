FROM node:8
ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# Установка зависимостей
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

# Запуск проекта
CMD ["npm", "start"]