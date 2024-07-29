# EntregaFinal-Backend-Carballo

&nbsp;

## Correr el proyecto:

###

- git clone https://github.com/Matias8776/EntregaFinal-Backend-Carballo.git
- cd EntregaFinal-Backend-Carballo
- npm i
- npm start

## Test(con el servidor ON):

###

- mocha test/supertest.test.js

## Documentación(necesita iniciar sesión para probar las rutas protegidas):

###

- http://localhost:8080/apidocs

## Archivo .env:

###

- Persistencia: MONGO / FILE
- LOGGER: DEV / PROD

## Cambiar role de usuario:

###

- http://localhost:8080/api/users/premium/:uid

## Test Logger:

###

- http://localhost:8080/loggertest

## Mocking Products:

###

- http://localhost:8080/mockingproducts


## Vista de productos:

###

- http://localhost:8080/products

- Parámetros(opcionales):
  ?tile=producto,
  ?limit=5,
  ?page=2,
  ?category=electronica,
  ?sort=1 o -1,
  ?disponibility=1 o -1

## Vista de carrito por ID:

###

- http://localhost:8080/carts/:cid

## Chat:

###

- http://localhost:8080/chat

## Productos en tiempo real:

###

- http://localhost:8080/realtimeproducts

## Mostrar productos:

###

- GET localhost:8080/api/products

## Buscar producto por ID:

###

- GET localhost:8080/api/products/:pid

## Mostrar productos con limite:

###

- GET localhost:8080/api/products?limit=

## Agregar producto:

###

- POST localhost:8080/api/products

```javascript
{
    "title": "",
    "description": "",
    "price": 500,
    "code": "",
    "stock": 10,
    "status": true,
    "category": ""
}
```

## Actualizar producto por ID:

###

- PUT localhost:8080/api/products/:pid

```javascript
{
    "title": "producto actualizado"
}
```

## Eliminar producto por ID:

###

- DELETE localhost:8080/api/products/:pid

## Crear carrito:

###

- POST localhost:8080/api/carts

## Agregar producto a carrito:

###

- POST localhost:8080/api/carts/:cid/products/:pid

## Buscar carrito por ID:

###

- GET localhost:8080/api/carts/:cid

## Actualizar carrito:

###

- PUT localhost:8080/api/carts/:cid

```javascript
[
  {
    _id: '64fca344bc7da40deee9e304',
    quantity: 2
  },
  {
    _id: '64fca344bc7da40deee9e305',
    quantity: 4
  }
]
```

## Actualizar cantidad de un producto en carrito:

###

- PUT localhost:8080/api/carts/:cid/products/:pid

```javascript
{
  "quantity": 3
}
```

## Eliminar producto del carrito por ID:

###

- DELETE localhost:8080/api/carts/:cid/products/:pid

## Vaciar Carrito:

###

- DELETE localhost:8080/api/carts/:cid
