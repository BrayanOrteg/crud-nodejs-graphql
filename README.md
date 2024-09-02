# taller-nodejs

Integrantes:

- Juan Camilo Salazar (A00381085)
- Brayan Ortega (A00380171)


## Descripción:

Esta es una aplicación backend escrita en TypeScript utilizando Node.js y con MongoDB como base de datos. La aplicación permite realizar operaciones CRUD en usuarios, comentarios y las reacciones a estos.  Se implementó un sistema de autenticación con JWT para proteger el acceso y las rutas de sistema.

La aplicación se encuentra deplegada en Vercel, puede probarla en el siguiente link:



## Set-up:

Después de clonar el repositorio (y habiendo instalado nodeJS) se debe:

- Ejecutar `npm install` sobre la carpeta raíz.
- Crear el archivo `.env` sobre la carpeta raíz, este tiene la siguiente estructura:
```
PORT = *número de puerto*
MONGO_URL = *url de conexión a MongoDB*
JWT_SECRET = *clave secreta de JWT*
```
En la entrega en intu se adjunta el .env utilizado.

- Ejecutar `yarn build`


## Ejecución 

