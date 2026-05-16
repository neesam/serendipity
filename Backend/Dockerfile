FROM node:18

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm install -g tsx

# Install Python dependencies
COPY requirements.txt ./
RUN pip3 install -r requirements.txt --break-system-packages

COPY . .

EXPOSE 5002

CMD ["tsx", "server/server.ts"]