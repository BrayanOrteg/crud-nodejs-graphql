# Taller GraphQL

Integrantes:

- Juan Camilo Salazar (A00381085)
- Brayan Ortega (A00380171)


## Descripción:

Esta es una aplicación backend escrita en TypeScript utilizando Node.js y con MongoDB como base de datos. La aplicación permite realizar operaciones CRUD en usuarios, comentarios y las reacciones a estos.  Se implementó un sistema de autenticación con JWT para proteger el acceso y las rutas de sistema.

La aplicación se encuentra desplegada en Vercel, puede probarla con Postman u otra herramienta en el siguiente link:

https://crud-nodejs-graphql.vercel.app/graphql

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

El programa se corre con  `yarn dev`, una vez ejecutado, ya podrá probar la aplicación haciendo uso de Postman u otra herramienta similar.

### Funcionalidades y su uso

A continuación se listan las funcionalidades del sistema y la forma de utilizarlas:


#### Login 

Dos tipos de usuario se pueden logear en la aplicación: "USER" y "SUPERADMIN", a continuación se ve el logeo de un usuario administrador ya registrado:

![image](https://github.com/user-attachments/assets/3f5437a0-f291-4416-b92c-3d9df40945d7)



Esto devuelve un token que deberá ser colocado en el header para realizar el resto de operaciones, se hace se la siguiente manera:

![image](https://github.com/user-attachments/assets/d037a61c-7a9f-4c56-bcef-f1f46a63903b)


Dentro del postman se debe ingresar a la carpeta de mayor nivel (CRUD nodeJs) e ir al apartado de variables, ahí se cambia el valor de current value

#### Gestión de Usuarios

Como "SUPERADMIN" se pueden crear usuarios con "name", "email", "password" y "role", si no se selecciona un rol de los mencionados se asignará por defecto como usuario normal, este es un ejemplo:

```
mutation CreateUser {
    createUser(name: "pedro fernandez", email: "pedrobc@email.com", password: "1234a5678", role: "USER") {
        id
        name
        email
        role
    }
}
```

También puede eliminarlos así:

![image](https://github.com/user-attachments/assets/ba4afb06-8043-4e48-a265-3db5fcb28c11)



Como "SUPERADMIN" o "USER" se pueden ver todos los usuarios registrados así

```
query Users {
    users {
        id
        name
        email
        role
    }
}
```

O ver solo un usuario así:

```
query User($id: ID!) {
  user(id: $id) {
    id
    name
    email
    role
  }
}
```

#### Gestión de Comentarios

Todos los usuarios pueden crear comentarios con un atributo "comment" asÍ:

![image](https://github.com/user-attachments/assets/508199bc-b5d0-4505-9277-b9936c81fd15)


El sistema toma el id del usuario que lo creó (a través del token) y lo asocia con el comentario, que además se crea con un arreglo de "replies", "reactions" y un "parentCommentId" vacios.


El usuario que creó un comentario puede editarlo:

![image](https://github.com/user-attachments/assets/8e746caf-e7dc-416f-9ad0-2ace566e6b14)



O eliminarlo:

![image](https://github.com/user-attachments/assets/1d1ada95-87ae-4323-95eb-46eeb5f246da)



Y cualquier usuario puede ver la lista de comentarios o uno en especificó así:


// Lista de todos los comentarios

![image](https://github.com/user-attachments/assets/63cef22c-050c-4ab5-b797-94eb709a3c82)

// Comentario espeficado con id

![image](https://github.com/user-attachments/assets/c68b00b5-19fc-4de1-a589-a8ba7186c252)



Un usuario también puede responder a otro comentario al agregar el atributo "parentCommentId" al momento de la creación:

![image](https://github.com/user-attachments/assets/a65f3cbb-7a38-49ef-8e36-7a02e422154d)


Esto añade la respuesta al arreglo de "replies" del comentario padre.


### Reacciones a Comentarios

Se puede reaccionar a un comentario para darle "LIKE", "DISLIKE", "LOVE" o "HATE" (solo estas son entradas validas) de la siguiente forma:

![image](https://github.com/user-attachments/assets/c9430e37-aa33-4108-aa9e-32168387ff22)


El id del usuario que hizo la reacción se asocia mediante el token y el id de la reacción es agregado a la lista de "reactions" del comentario seleccionado.


El usuario que creó la reacción puede eliminarla:

![image](https://github.com/user-attachments/assets/cecaf4d8-8427-4fa7-90ba-3026f5c45e65)



Y cualquier usuario puede ver todas o una reacción específica:

```
// Lista de todas las reacciones

query Reactions {
  reactions {
    id
    tag
    commentId
    userId
  }
}

```
// Reaccion especificado por id
![image](https://github.com/user-attachments/assets/d400024b-3012-46cc-bf1d-aa13ba839c5d)


## Archivos relevantes

- Puede ver un json con los comandos de Postman en: `./CRUD nodeJs.postman_collection`


## Comentarios y dificultades:

Este proyecto fue bastante interesante porque GraphQL nos sorprendió con lo sencillo que es de usar. Crear endpoints fue súper ágil, y las queries eran fáciles de escribir, lo cual nos ahorró bastante tiempo en comparación con otras opciones. Sin embargo, no todo fue tan simple. Validar roles y permisos se convirtió en el mayor dolor de cabeza. Nos demoramos un buen rato probando diferentes formas de hacerlo hasta que decidimos usar graphql-shield, que nos facilitó organizar las reglas de acceso y manejar los permisos de una manera más clara. Al final, aunque hubo sus retos, logramos que todo quedara funcionando como queríamos.


