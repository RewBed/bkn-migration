# bkn-migration

## Установка: 
npm install --global bkn-migration

## Настройка
В корне проекта нужно разместить файл настроек: ```mg-config.yaml``` 

Пример:
```yaml
db:
  host: localhost
  user: UserName
  password: secret
  port: 3306

path:
  folder: data
```

## Запуск

```migration dbName rgr``` 

rgr - имя базы данных (обязательный параметр)