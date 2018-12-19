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
    "avatar": "Image codificada en base64"
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

### Colección /users



### Colección /restaurants



