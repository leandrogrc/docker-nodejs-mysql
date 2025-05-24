FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x wait-for-db.sh  # Adicione esta linha

EXPOSE 8080

CMD ["npm", "start"]