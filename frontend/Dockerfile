FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx shadcn@latest init -t next

RUN npx shadcn@latest add sidebar

# COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]