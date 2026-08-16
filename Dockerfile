FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .

ARG VITE_API_URL=https://nakiapi.sofiraflow.com
ARG VITE_MAIN_URL=https://nakiat.sofiraflow.com
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MAIN_URL=$VITE_MAIN_URL

RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
