FROM nginx:alpine

# 1. Nginx ki default config hatao aur apni dalo
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. Apni saari files (index, about, courses folder) copy karo
COPY . /usr/share/nginx/html

EXPOSE 80
