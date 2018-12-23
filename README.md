<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Servicios web applicación FoodScore

Servicios web para los proyectos de la asignatura de entorno cliente. 

### Instalación de los servicios

Importar la base de datos (directorio SQL). Configurar el archivo **ormconfig.json** con el servidor (host), usuario, password, y nombre de la base de datos. Ejemplo:

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "user",
  "password": "pass",
  "database": "project1",
  "entities": ["src/entities/**.entity{.ts,.js}"],
  "synchronize": true,
  "logging": false
}
```

A continuación, instalamos los paquetes necesarios con NPM:

```bash
$ npm install
```

### Probando los servicios

Ejecutamos los servicios web con el siguiente script:

```bash
# development
$ npm run start
```

En el directorio Postman (raíz del proyecto) hay una colección de Postman para importar y probar.

También (aún no está completo) se pueden consultar la descripción de los servicios y probarlos en la dirección **http://localhost:3000/api**.

## Servicios web - Colecciones

Todos los servicios devuelven un resultado en formato JSON. Cuando no se pueda realizar una operación, devolverán un código de error HTTP junto a un objeto JSON con la descripción del mismo.

Todas las colecciones, excepto **/auth** *(/auth/validate sí lo requiere)*, requieren un token de autenticación para poder utilizar los servicios web, devolviendo un código 401 (Not Authorized) en caso de no incluirlo. Este debe enviarse en la cabecera Authorization con el prefijo Bearer:

```
Authorization: Bearer auth_token
```

### Colección /auth

* **POST /auth/login**

El servicio comprueba si un usuario y contraseña son correctos, devolviendo un token de autenticación (JWT) si todo va bien. Opcionalmente se puede enviar la posición del usuario para que la actualice.

Ejemplo de **petición** (_lat_ y _lng_ son opcionales):

```json
{
    "email": "prueba@email.es",
    "password": "1234",
    "lat": 37.823553,
    "lng": -1.265457
}
```
Si el login es correcto, la **respuesta** será algo como esto:

```json
{
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODU5MDA1MzgsImlkIjoiMSIsIm5hbWUiOiJQcnVlYmEiLCJlbWFpbCI6InBydWViYUBjb3JyZW8uZXMifQ.vf7hwA3gceCDvOCa9RoWxR9cJ5mARnbAs6Nv9VBlPdc"
}
```

En caso de error en el login (usuario y contraseña no válidos), se devolverá el código de error 401:

```json
{
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Email or password incorrect"
}
```

* **POST /auth/google**

(Aún no implementado). Comprobará el login a partir del token de Google Plus

* **POST /auth/facebook**

(Aún no implementado). Comprobará el login a partir del token de Facebook

* **POST /auth/register**

Este servicio recibe los datos de un usuario y lo registra en la base de datos.

Ejemplo de **petición** (_lat_ y _lng_ son opcionales):

```json
{
    "name": "Prueba",
    "email": "prueba@correo.es",
    "password": "1234",
    "lat": 0.372453452,
    "lng": -0.6553454,
    "avatar": "Imagen codificada en base64"
}
```

* **GET /auth/validate**

Este servicio simplemente comprueba que el token de autenticación que se envía en la cabecera Authorization es correcto (y se ha enviado), devolviendo una respuesta como esta si está todo correcto:

```json
{
    "ok": true
}
```

O un código 401 (Not Authorized) si no es válido.


### Colección /restaurants

Todos los servicios de esta colección requieren del token de autenticación.

* **GET /restaurants**

Devuelve todos los restaurantes, ordenados por distancia respecto al usuario actual. El objeto devuelto tendrá un array con dichos restaurantes. Además de los datos del restaurante almacenado, devolverá la puntuación media del mismo (*stars*), la distancia del usuario al restaurante en km (*distance*), y si el restaurante pertenece al usuario (*mine*).

Los días que abre el restaurante y el tipo de cocina se almacenan en la base de datos como cadena de caracteres, con los elementos separados por coma, pero el servicio los devuelve como array.

```json
{
    "restaurants": [
        {
            "id": 19,
            "name": "Restaurant",
            "description": "Description",
            "daysOpen": [
                "3",
                "4",
                "5",
                "6",
                "0"
            ],
            "phone": "234543654",
            "image": "img/restaurants/1540120779126.jpg",
            "address": "Calle Cuba, San Vicente del Raspeig",
            "cuisine": [
                "Nothing"
            ],
            "stars": "4.00",
            "lat": "38.3920720",
            "lng": "-0.5145030",
            "mine": false,
            "distance": 91.05379486083984
        },
        ...
    ]
}
```

* **GET /restaurants/mine**

Igual que el servicio **/restaurants** pero sólo devuelve los restaurantes cuyo creador es el usuario actual.

* **GET /restaurants/:id**

Devuelve la información del restaurante cuya id recibe por parámetro en la url. En caso de no existir, devolverá un código de error 404.

Además de la información que devuelve cuando solicitamos varios restaurantes (servicios anteriores), también devolverá información sobre el usuario creador del mismo.

Ejemplo de llamada a **/restaurants/19**.

```json
{
    "restaurant": {
        "id": 19,
        "name": "Restaurant",
        "description": "Description",
        "daysOpen": [
            "3",
            "4",
            "5",
            "6",
            "0"
        ],
        "phone": "234543654",
        "image": "img/restaurants/1540120779126.jpg",
        "address": "Calle Cuba, San Vicente del Raspeig",
        "cuisine": [
            "Nothing"
        ],
        "stars": "4.00",
        "lat": "38.3920720",
        "lng": "-0.5145030",
        "creator": {
            "id": 25,
            "name": "Peter Griffin",
            "email": "p@p.es",
            "avatar": "img/users/1540121477498.jpg",
            "lat": "38.3471226",
            "lng": "-0.4974451"
        },
        "mine": false,
        "commented": false,
        "distance": 91.05379486083984
    }
}
```

* **POST /restaurants**

Crea un nuevo restaurante en la base de datos. Ejemplo de información que debe de recibir el servicio:

```json
{
  "name": "Restaurant",
  "description": "Description",
  "daysOpen": ["1","4","5","6"],
  "cuisine": ["Italian"],
  "phone": "934234512",
  "address": "Some street",
  "lat": 39.2345235,
  "lng": -1.4235,
  "image": "Imagen en base64"
}
```

El servicio devolverá, si todo ha ido bien y se ha insertado el restaurante, el objeto recién insertado en la base de datos, con su id y la url de la imagen guardada en el servidor:

```json
{
    "restaurant": {
        "creator": 27,
        "name": "Restaurant",
        "description": "Description",
        "daysOpen": [
            "1",
            "4",
            "5",
            "6"
        ],
        "cuisine": [
            "Italian"
        ],
        "phone": "934234512",
        "address": "Some street",
        "lat": "39.2345235",
        "lng": "-1.4235000",
        "image": "img/restaurants/1545563381872.jpg",
        "id": 34,
        "stars": "0.00"
    }
}
```

Normalmente, cuando los datos enviados sean insuficientes o no estén en el formato correcto, el servidor devolverá un error 400 (Bad request).

* **DELETE /restaurants/:id**

Este servicio borra un restaurante de la base de datos y devuelve la id del restaurante eliminado, o un error 404 si el restaurante a borrar no existe. Si intentamos borrar un restaurante que no sea nuestro, debería devolver un código 401 (not authorized).

Ejemplo de respuesta a la llamada **/restaurants/34**

```json
{
    "id": 34
}
```

* **GET /restaurants/:id/comments**

Devuelve un objeto que contiene un array con todos los comentarios que han realizado los usuarios sobre un restaurante.

```json
{
    "comments": [
        {
            "id": 21,
            "stars": 4,
            "text": "Good food",
            "date": "2018-10-21T11:22:33.467Z",
            "user": {
                "id": 25,
                "name": "Peter Griffin",
                "email": "p@p.es",
                "avatar": "img/users/1540121477498.jpg",
                "lat": "38.3471226",
                "lng": "-0.4974451"
            }
        },
        ...
    ]
}
```

* **POST /restaurants/:id/comments**

Inserta un nuevo comentario en un restaurante. Sólo se permite un comentario por usuario y restaurante, por lo que si se intenta volver a comentar, devolverá un código de error 400 (Bad request):

```json
{
    "statusCode": 400,
    "message": "Only one comment allowed per user and restaurant"
}
```

También devolverá un 404 si el restaurante no existe, o un 400 si falta información o el formato no es correcto.

Ejemplo de comentario:

```json
{
  "stars": 4,
  "text": "Good restaurant"
}
```

La respuesta será la información del comentario insertado en la base de datos:

```json
{
    "comment": {
        "id": 38,
        "stars": 4,
        "text": "Good restaurant",
        "date": "2018-12-23T11:35:07.204Z",
        "user": {
            "id": 27,
            "name": "Tom",
            "email": "tom2@email.com",
            "avatar": "img\\users\\1541009537495.jpg",
            "lat": "37.8235530",
            "lng": "-1.2654570"
        }
    }
}
```

### Colección /users

Todos los servicios de esta colección requieren del token de autenticación.

* **GET /users/me**

Devuelve la información del perfil del usuario autenticado. El booleano **me** indica si la información es del usuario autenticado o de otro.

```json
{
    "user": {
        "id": 27,
        "name": "Tom",
        "email": "tom2@email.com",
        "avatar": "img\\users\\1541009537495.jpg",
        "lat": "37.8235530",
        "lng": "-1.2654570",
        "me": true
    }
}
```

* **GET /users/:id**

Igual que **/users/me** pero devuelve la información del usuario cuya id recibe en la url. Devuelve un error 404 si el usuario no existe.

Ejemplo de llamada a **/users/22**:

```json
{
    "user": {
        "id": 22,
        "name": "John Wayne",
        "email": "email2@email.com",
        "avatar": "img/users/1539948671405.jpg",
        "lat": "41.3254320",
        "lng": "-1.2345500",
        "me": false
    }
}
```

* **PUT /users/me**

Modifica la información del nombre y correo del usuario autenticado.

Ejemplo de petición:

```json
{
  "name": "John",
  "email": "email@email.com"
}
```

Responde simplemente con una confirmación si todo ha ido bien (O error 400 si los datos de entrada son insuficientes o erróneos):

```json
{
    "ok": true
}
```

* **PUT /users/me/avatar**

Modifica el avatar del usuario autenticado. Ejemplo de petición:

```json
{
    "avatar": "Imagen en base 64"
}
```

Responde con la url de la nueva imagen almacenada en el servidor:

```json
{
    "avatar": "img/users/1545565439800.jpg"
}
```

* **PUT /users/me/password**

Actualiza la contraseña del usuario autenticado:

```json
{
  "password": "1234"
}
```

Responde simplemente con una confirmación si todo ha ido bien:

```json
{
    "ok": true
}
```
