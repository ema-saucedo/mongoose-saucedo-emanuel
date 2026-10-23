# Práctica de MongoDB y Mongoose

# Saucedo Angel Emanuel

## Justificación: Embebido vs Referenciado

* Propiedad embebida (contact en Director): Son pocos datos, pertenecen solo al director, no crecen y siempre se piden juntos.

* Relación 1:1 (Profile con Director): Se usó referencia con unique: true para separar la biografía y premios y no hacer más lentas consultas simples.

* Relación 1:N (Director con Movie): Se usó referencia porque un director puede tener muchas películas y hacerlas embebidas agrandaría mucho el documento.

* Relación N:M (Movie con Actor): Se usó un array de IDs (actors: [ObjectId]) porque varios actores actúan en varias películas, evitando duplicar datos.

## Investigación

* ¿Cómo se utiliza el populate desde colecciones que no tienen referencias?

Con Virtual Populate de Mongoose. Se define un campo virtual indicando el modelo (ref), la clave local (localField: "_id") y la foránea (foreignField: "director"). Mongoose los une en la consulta sin guardarlos en la colección. "dentro del codigo se puede entender mejor"

* ¿Cómo se realizan las eliminaciones lógicas y en cascada?
Lógica: Con el campo isActive: true. Al eliminar se pasa a false con findOneAndUpdate en vez de borrar el registro.

En cascada: Al desactivar un director, el controlador ejecuta updateMany en Profile y Movie poniendo su isActive en false.

* ¿Cómo crear un endpoint para agregar un nuevo vínculo en una relación muchos a muchos?
En la ruta POST /api/movies/:id/actors:
* Con express-validator se valida que los IDs existan y no estén repetidos.
* En el controlador se usa $addToSet de MongoDB ({ $addToSet: { actors: actorId } }), que agrega el ID al array sin duplicarlo.