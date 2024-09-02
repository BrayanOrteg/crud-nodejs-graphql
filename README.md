# taller-nodejs

Integrantes:

- Juan Camilo Salazar (A00381085)
- Brayan Ortega (A00380171)


## Descripción:

Esta es una aplicación backend escrita en TypeScript utilizando Node.js y con MongoDB como base de datos. La aplicación permite realizar operaciones CRUD en usuarios, comentarios y las reacciones a estos.  Se implementó un sistema de autenticación con JWT para proteger el acceso y las rutas de sistema.

La aplicación se encuentra desplegada en Vercel, puede probarla con Postman u otra herramienta en el siguiente link:

https://crud-nodejs-214f-3paoudg4m-salazqs-projects.vercel.app 

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

El programa se corre con  `yarn dev`, una vez ejecutado, verá el mensaje de "La app se está ejecutando" en la dirección del puerto seleccionado y ya podrá probar la aplicación haciendo uso de Postman u otra herramienta similar.

### Funcionalidades y su uso

A continuación se listan las funcionalidades del sistema y la forma de utilizarlas:


#### Login 

Dos tipos de usuario se pueden logear en la aplicación: "USER" y "SUPERADMIN", a continuación se ve el logeo de un usuario administrador ya registrado:



Esto devuelve un token que deberá ser colocado en el header para realizar el resto de operaciones, se hace se la siguiente manera:


#### Gestión de Usuarios

Como "SUPERADMIN" se pueden crear usuarios con "name", "email", "password" y "role", si no se selecciona un rol de los mencionados se asignará por defecto como usuario normal, este es un ejemplo:



También puede eliminarlos así:



Como "SUPERADMIN" o "USER" se pueden ver todos los usuarios registrados así


O ver solo un usuario así:



#### Gestión de Comentarios

Todos los usuarios pueden crear comentarios con un atributo "comment" asÍ:


El sistema toma el id del usuario que lo creó (a través del token) y lo asocia con el comentario, que además se crea con un arreglo de "replies", "reactions" y un "parentCommentId" vacios.


El usuario que creó un comentario puede editarlo:


O eliminarlo:


Y cualquier usuario puede ver la lista de comentarios o uno en especificó así:


Un usuario también puede responder a otro comentario al agregar el atributo "parentCommentId" al momento de la creación:


Esto añade la respuesta al arreglo de "replies" del comentario padre.


### Reacciones a Comentarios

Se puede reaccionar a un comentario para darle "LIKE", "DISLIKE", "LOVE" o "HATE" (solo estas son entradas validas) de la siguiente forma:


El id del usuario que hizo la reacción se asocia mediante el token y el id de la reacción es agregado a la lista de "reactions" del comentario seleccionado.


El usuario que creó la reacción puede eliminarla:



Y cualquier usuario puede ver todas o una reacción específica:


### Autenticación y Autorización

Todas las rutas, menos la de login, requieren de la autenticación mediante el token que se genera en el login, como ejemplo tenemos:

`router.post('/', validateSchema(userSchema),auth, AdminAuth, userController.create);`

Donde "auth" se encarga de desencriptar el token y verificar que no ha expirado y "AdminAuth" verifica que el rol de usuario es "SUPERADMIN", pues solo este puede crear un usuario. En caso de que cualquier rol pueda acceder a la ruta, utilizamos "UserAuth".



## Archivos relevantes

- Puede ver un json con los comandos de Postman en: **poner ruta**
- Puede ver los esquemas y validaciones de entrada en: `src/schemas`
- Puede ver los modelos y validaciones de datos en: `src/models`
- Puede ver la autenticación y autorización en: `src/middlewares`
- Otras validaciones de búsqueda en la base de datos se realizaron en las controladoras: `src/controller`



## Comentarios y dificultades:

Este fue un proyecto donde comenzamos con una muy buena base gracias a lo visto en clase, por lo que el desarrollo fue en mayor parte fluido y pudimos completar todas las funcionalidades, además de que existe mucha documentación en linea que nos fue muy útil. Sin embargo, enfrentamos varias dificultades, sobre todo con la estructuración del modelo de datos, pues Mongo da cierta libertad a la hora de estructurar los documentos, por lo que invertimos bastante tiempo en pensar cómo almacenar y relacionar los datos, e hicimos varias pruebas para dar con el modelo que más se ajustaba a nuestras necesidades. Otro problema surgió a la hora de deplegar la aplicción, pues, al no trabajar con un Framwork, Vercel tiene dificultades para reconocer la estructura del proyecto y realizar la ejecución, por lo que tuvimos que realizar múltiples cambios en el código para lograr el depliegue.



