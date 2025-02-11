# Dockerfile for Node.js Back-end
FROM node:18

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Expõe a porta em que o app irá rodar
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]
