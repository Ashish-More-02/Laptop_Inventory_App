# get a clean linux image first and create a working directory.
FROM node:20-alpine
WORKDIR /app

# copy package and package-lock into app directory and install
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install

# copy source code into app directory
COPY . /app/

# tell docker which port our nodejs app uses.
EXPOSE 3000

# command that runs our app everytime  , node index.js
CMD ["node","index.js"]