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

- [1. Servicios web applicación FoodScore](#1-servicios-web-applicación-foodscore)
  - [1.1. Instalación de los servicios](#11-instalación-de-los-servicios)
    - [1.1.1. Probando los servicios](#111-probando-los-servicios)
  - [1.2. Servicios web - Colecciones](#12-servicios-web---colecciones)
    - [1.2.1. Colección /auth](#121-colección-auth)
    - [1.2.2. Colección /restaurants](#122-colección-restaurants)
    - [1.2.3. Colección /users](#123-colección-users)

# 1. Servicios web applicación FoodScore

Servicios web para los proyectos de la asignatura de entorno cliente. 

## 1.1. Instalación de los servicios

Importar la base de datos (directorio SQL). Configurar el archivo **mirko-ormconfig.json** con el servidor (host), usuario, password, y nombre de la base de datos. Ejemplo:

```typescript
export default {
  entities: ['dist/entities'], // compiled JS files
  entitiesTs: ['src/entities'],
  dbName: 'foodscore',
  type: 'mariadb', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  user: 'root',
  password: '',
  port: 3306,
  host: 'localhost',
  debug: true,
} as ConnectionOptions;
```

A continuación, instalamos los paquetes necesarios con NPM:

```bash
$ npm install
```

### 1.1.1. Probando los servicios

Ejecutamos los servicios web con el siguiente script:

```bash
npm start
```

En el directorio Postman (raíz del proyecto) hay una colección de Postman para importar y probar.

## 1.2. Servicios web - Colecciones

Todos los servicios devuelven un resultado en formato JSON. Cuando no se pueda realizar una operación, devolverán un código de error HTTP junto a un objeto JSON con la descripción del mismo.

Todas las colecciones, excepto **/auth** *(/auth/validate sí lo requiere)*, requieren un token de autenticación para poder utilizar los servicios web, devolviendo un código 401 (Not Authorized) en caso de no incluirlo. Este debe enviarse en la cabecera Authorization con el prefijo Bearer:

```
Authorization: Bearer auth_token
```

### 1.2.1. Colección /auth

* **POST /auth/login**

El servicio comprueba si un usuario y contraseña son correctos, devolviendo un token de autenticación (JWT) si todo va bien. Opcionalmente se puede enviar la posición del usuario para que la actualice.

Ejemplo de datos en la **petición** (_lat_ y _lng_ son opcionales):

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
    "status": 401,
    "error": "Email or password incorrect"
}
```

<!-- * **POST /auth/google**

Este servicio recibe el campo **id_token** que devuelve la identificación mediante Google en el cliente. Lo valida y comprueba el correo en la base de datos. Si el correo existe funciona como un login normal, y si no existe registra al usuario (a partir de los datos obtenidos de Google) en la base de datos. Devuelve un token de autenticación válido para el servidor (como el login).

Ejemplo de envío (lat y lng son opcionales):

```json
{
    "token": "id_token de Google",
    "lat": 37.823553,
    "lng": -1.265457
}
```

Ejemplo de respuesta:

```json
{
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODU5MDA1MzgsImlkIjoiMSIsIm5hbWUiOiJQcnVlYmEiLCJlbWFpbCI6InBydWViYUBjb3JyZW8uZXMifQ.vf7hwA3gceCDvOCa9RoWxR9cJ5mARnbAs6Nv9VBlPdc"
}
```

https://developers.google.com/identity/sign-in/web/backend-auth

* **POST /auth/facebook**

Este servicio recibe el campo **accessToken** que devuelve la identificación mediante Facebook en el cliente. Lo valida y comprueba el correo en la base de datos. Si el correo existe funciona como un login normal, y si no existe registra al usuario (a partir de los datos obtenidos de Facebook) en la base de datos. Devuelve un token de autenticación válido para el servidor (como el login).

Ejemplo de envío (lat y lng son opcionales):

```json
{
    "token": "accessToken de Facebook",
    "lat": 37.823553,
    "lng": -1.265457
}
```

Ejemplo de respuesta:

```json
{
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODU5MDA1MzgsImlkIjoiMSIsIm5hbWUiOiJQcnVlYmEiLCJlbWFpbCI6InBydWViYUBjb3JyZW8uZXMifQ.vf7hwA3gceCDvOCa9RoWxR9cJ5mARnbAs6Nv9VBlPdc"
}

https://lorenstewart.me/2017/03/12/using-node-js-to-interact-with-facebooks-graph-api/ -->

* **POST /auth/register**

Este servicio recibe los datos de un usuario y lo registra en la base de datos.

Ejemplo de **petición**:

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

Este servicio simplemente comprueba que el token de autenticación que se envía en la cabecera Authorization es correcto (y se ha enviado), devolviendo una respuesta vacía (con el código 204) si está todo correcto.

O un código de error 401 (Not Authorized) si no es válido.

### 1.2.2. Colección /restaurants

Todos los servicios de esta colección requieren del token de autenticación.

* **GET /restaurants**

Devuelve todos los restaurantes, ordenados por distancia respecto al usuario actual. El objeto devuelto tendrá un array con dichos restaurantes. Además de los datos del restaurante almacenado, devolverá la puntuación media del mismo (*stars*), la distancia del usuario al restaurante en km (*distance*), y si el restaurante pertenece al usuario (*mine*).

Los días que abre el restaurante se almacena en la base de datos como cadena de caracteres (separados por coma), pero el servicio los devuelve como array.

```json
{
    "restaurants": [
        {
            "id": 211,
            "name": "Restaurant",
            "description": "Description",
            "daysOpen": [
                "1",
                "4",
                "5",
                "6"
            ],
            "phone": "934234512",
            "image": "http://localhost:3000/img/restaurants/1666771960364.jpg",
            "cuisine": "Italian",
            "address": "Some street",
            "lat": 39.2345235,
            "lng": -1.4235,
            "stars": 0,
            "creator": 157,
            "distance": 211.95602416992188,
            "mine": false
        },
        ...
    ]
}
```

* **GET /restaurants/mine**

Igual que el servicio **/restaurants** pero sólo devuelve los restaurantes cuyo creador es el usuario actual.

* **GET /restaurants/user/:id**

Igual que el servicio **/restaurants** pero sólo devuelve los restaurantes del usuario cuya id recibe por parametro.

* **GET /restaurants/:id**

Devuelve la información del restaurante cuya id recibe por parámetro en la url. En caso de no existir, devolverá un código de error 404.

Además de la información que devuelve cuando solicitamos varios restaurantes (servicios anteriores), también devolverá información sobre el usuario creador del mismo y si el usuario actual ha comentado y puntuado ya el restaurante (_commented_).

Ejemplo de llamada a **/restaurants/19**.

```json
{
    "restaurant": {
        "id": 211,
        "name": "Restaurant",
        "description": "Description",
        "daysOpen": [
            "1",
            "4",
            "5",
            "6"
        ],
        "phone": "934234512",
        "image": "http://SERVIDOR/img/restaurants/1666771960364.jpg",
        "cuisine": "Italian",
        "address": "Some street",
        "lat": 39.2345235,
        "lng": -1.4235,
        "stars": 0,
        "creator": {
            "id": 157,
            "name": "Tomtom",
            "email": "tom11@email.com",
            "password": "A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=",
            "avatar": "http://SERVIDOR/img/users/1666648110350.jpg",
            "lat": 37.423553,
            "lng": -0.654657,
            "firebaseToken": null
        },
        "distance": 211.95602416992188,
        "commented": false,
        "mine": false
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
        "id": 212,
        "name": "Restaurant",
        "description": "Description",
        "daysOpen": [
            "1",
            "4",
            "5",
            "6"
        ],
        "phone": "934234512",
        "image": "http://SERVIDOR/img/restaurants/1666773950957.jpg",
        "cuisine": "Italian",
        "address": "Some street",
        "lat": 39.2345235,
        "lng": -1.4235,
        "creator": {
            "id": 158,
            "name": "Tom",
            "email": "tom6@email.com",
            "password": "A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=",
            "avatar": "http://SERVIDOR/img/users/1666771951144.jpg",
            "lat": 37.423553,
            "lng": -0.654657,
            "firebaseToken": null
        },
        "stars": 0,
        "mine": true
    }
}
```

Normalmente, cuando los datos enviados sean insuficientes o no estén en el formato correcto, el servidor devolverá un error 400 (Bad request).

* **PUT /restaurants/:id**

Similar al servicio anterior (añadir restaurante), pero además se envía en la url la id del restaurante que se va a modificar. Se debe enviar toda la información otra vez, dejando los campos que no han cambiado con su valor original.

Devuelve, si todo sale bien, el restaurante con la información modificada.

* **DELETE /restaurants/:id**

Este servicio borra un restaurante de la base de datos y devuelve una respuesta vacía (código 204) si todo ha ido bien, o un error 404 si el restaurante a borrar no existe. Si intentamos borrar un restaurante que no sea nuestro, debería devolver un código 401 (not authorized).

* **GET /restaurants/:id/comments**

Devuelve un objeto que contiene un array con todos los comentarios que han realizado los usuarios sobre un restaurante.

```json
{
    "comments": [
        {
            "id": 21,
            "stars": 4,
            "text": "Good food",
            "date": "2020-06-02 11:13:04.703753",
            "user": {
                "id": 25,
                "name": "Peter Griffin",
                "email": "p@p.es",
                "avatar": "http://SERVIDOR/img/users/1540121477498.jpg",
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
        "date": "2022-12-23T11:35:07.204Z",
        "user": {
            "id": 25,
            "name": "Peter Griffin",
            "email": "p@p.es",
            "avatar": "http://SERVIDOR/img/users/1540121477498.jpg",
            "lat": "38.3471226",
            "lng": "-0.4974451"
        }
    }
}
```

### 1.2.3. Colección /users

Todos los servicios de esta colección requieren del token de autenticación.

* **GET /users/me**

Devuelve la información del perfil del usuario autenticado. El booleano **me** indica si la información es del usuario autenticado o de otro.

```json
{
    "user": {
        "id": 158,
        "name": "Tom",
        "email": "tom6@email.com",
        "avatar": "http://localhost:3000/img/users/1666771951144.jpg",
        "lat": 37.423553,
        "lng": -0.654657,
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
        "avatar": "http://localhost:3000/img/users/1539948671405.jpg",
        "lat": 41.325432,
        "lng": -1.23455,
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

La respuesta estará vacía (código 204) si todo ha ido bien, o error 400 si los datos de entrada son insuficientes o erróneos:

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
    "avatar": "http://localhost:3000/img/users/1545565439800.jpg"
}
```

* **PUT /users/me/password**

Actualiza la contraseña del usuario autenticado:

```json
{
  "password": "1234"
}
```

La respuesta estará vacía (código 204) si todo ha ido bien
