
#stage 1 build frontend
FROM node:18-alpine AS builder

#inside container set workdir as /app
WORKDIR /app 

#copy package.json and package-lock.json to workdir
COPY package*.json ./

#install dependencies
RUN npm ci 

#copy all code from .(frontend root) to .(workdir root)
COPY . .

#build frontend static file, static file will be in /app/build
RUN npm run build


#stage 2 serve frontend with nginx
FROM nginx:alpine AS production

#copy build static files from builder stage to nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

#expose nginx port 80
EXPOSE 80

#start nginx web server to serve static file to global
CMD [ "nginx", "-g", "daemon off;" ]
