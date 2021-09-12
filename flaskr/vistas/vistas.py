from flask import request
import json
from ..modelos import db, Cancion, CancionSchema, Usuario, UsuarioSchema, Album, AlbumSchema, Comentario, ComentarioSchema, RatingComentario, RatingComentarioSchema, CancionFavoritaUsuario, CancionFavoritaSchema
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from flask.json import jsonify

cancion_schema = CancionSchema()
usuario_schema = UsuarioSchema()
album_schema = AlbumSchema()
comentario_schema = ComentarioSchema()
rating_comentario_schema = RatingComentarioSchema()
cancion_favorita = CancionFavoritaSchema()


class VistaCanciones(Resource):

    def post(self, id_usuario):
        nueva_cancion = Cancion(titulo=request.json["titulo"], minutos=request.json["minutos"],
                                segundos=request.json["segundos"], interprete=request.json["interprete"], genero=request.json["genero"])
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.canciones.append(nueva_cancion)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return 'El usuario ya tiene una canción con dicho nombre', 409

        return cancion_schema.dump(nueva_cancion)

    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        print(usuario.usuariosCanciones)
        print(usuario.canciones)
        cancionesCompartidas = [cancion_schema.dump(
            ca) for ca in usuario.usuariosCanciones]
        cancionesUsuario = [cancion_schema.dump(
            ca) for ca in usuario.canciones]
        for x in cancionesCompartidas:
            cancionesUsuario.append(x)
        return cancionesUsuario


class VistaComentariosAlbum(Resource):

    def post(self, id_album, id_usuario):
        album = Album.query.get_or_404(id_album)
        usuario = Usuario.query.get_or_404(id_usuario)
        nuevo_comentario = Comentario(descripcion=request.json["descripcion"])
        album.comentarios.append(nuevo_comentario)
        usuario.comentarios.append(nuevo_comentario)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return 'El usuario ya tiene un comentario asociado al album', 409

        return comentario_schema.dump(nuevo_comentario)

    def get(self, id_album, id_usuario):
        album = Album.query.get_or_404(id_album)
        usuario = Usuario.query.get_or_404(id_usuario)
        return [comentario_schema.dump(al) for al in album.comentarios]


class VistaCancionesFavoritas(Resource):

    def post(self, id_cancion, id_usuario):
        cancion = Cancion.query.get_or_404(id_cancion)
        usuario = Usuario.query.get_or_404(id_usuario)
        nuevo_usu_fav = CancionFavoritaUsuario(
            usuario_id=id_usuario, cancion_id=id_cancion)
        cancion.cancionFavorita.append(nuevo_usu_fav)
        usuario.usuariosFavoritos.append(nuevo_usu_fav)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return 'El usuario ya tiene como favorita esa cancion', 409

        return cancion_favorita.dump(nuevo_usu_fav)

    def delete(self, id_cancion, id_usuario):
        query_string = "delete from cancion_favorita_usuario as cfu where cfu.cancion_id =" + \
            str(id_cancion) + " and cfu.usuario_id =" + str(id_usuario)

        try:
            result = db.engine.execute(query_string)
            return 'El registro fue eliminado con exito', 200
        except IntegrityError:
            db.session.rollback()
            return 'No fue posible eliminar el registro', 409


class VistaCancionFavorita(Resource):

    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        query_string = "select c2.* from cancion c2 order by case when c2.id in (select  c.id from cancion c , cancion_favorita_usuario cfu , usuario u2 where c.id=cfu.cancion_id and u2.id=cfu.usuario_id and u2.id =" + str(
            id_usuario) + ") then 1 else 2 end asc"
        result = db.engine.execute(query_string)
        # {'result': dict(row) for row in result}
        listCanciones = [dict(row) for row in result]
        result = []
        for x in listCanciones:
            cancion = Cancion.query.get_or_404(x['id'])
            result.append([cancion_schema.dump(cancion)])
        return result


class VistaPromedioUsuario(Resource):

    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        query_string = "select CAST (sum(rating) AS float) /count(rating) as promedio, usuario from rating_comentario rc where rc.usuario =" + \
            str(id_usuario) + "group by rc.usuario"
        result = db.engine.execute(query_string)
        return {'result': dict(row) for row in result}


class VistaComentariosCancion(Resource):

    def post(self, id_cancion, id_usuario):
        cancion = Cancion.query.get_or_404(id_cancion)
        usuario = Usuario.query.get_or_404(id_usuario)
        nuevo_comentario = Comentario(descripcion=request.json["descripcion"])
        cancion.comentarios.append(nuevo_comentario)
        usuario.comentarios.append(nuevo_comentario)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return 'El usuario ya tiene un comentario asociado al album', 409

        return comentario_schema.dump(nuevo_comentario)

    def get(self, id_cancion, id_usuario):
        cancion = Cancion.query.get_or_404(id_cancion)
        usuario = Usuario.query.get_or_404(id_usuario)
        return [comentario_schema.dump(al) for al in cancion.comentarios]


class VistaRatingComentarios(Resource):

    def post(self, id_comentario, id_usuario):
        comentario = Comentario.query.get_or_404(id_comentario)
        usuario = Usuario.query.get_or_404(id_usuario)
        nuevo_rating = RatingComentario(rating=request.json["rating"])
        comentario.ratings.append(nuevo_rating)
        usuario.ratings.append(nuevo_rating)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return 'El usuario ya tiene un comentario asociado al album', 409

        return rating_comentario_schema.dump(nuevo_rating)

    def get(self, id_comentario, id_usuario):
        comentario = Comentario.query.get_or_404(id_comentario)
        usuario = Usuario.query.get_or_404(id_usuario)
        return [rating_comentario_schema.dump(al) for al in comentario.ratings]


class VistaCancionesUsuario(Resource):

    def get(self, id_usuario, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        usuario = Usuario.query.get_or_404(id_usuario)
        query_string = "select  * from cancion c where c.usuario =" + \
            str(id_usuario) + " and c.id =" + str(id_cancion)
        result = db.engine.execute(query_string)
        return {'result': [dict(row) for row in result]}


class VistaAlbumesUsuario(Resource):

    def get(self, id_usuario, id_album):
        usuario = Usuario.query.get_or_404(id_usuario)
        album = Album.query.get_or_404(id_album)
        query_string = "select  * from album a where a.usuario =" + \
            str(id_usuario) + " and a.id =" + str(id_album)
        result = db.engine.execute(query_string)
        return {'result': [dict(row) for row in result]}


class VistaAlbumsUsuario(Resource):

    # @jwt_required()
    def post(self, id_usuario):
        nuevo_album = Album(titulo=request.json["titulo"], anio=request.json["anio"],
                            descripcion=request.json["descripcion"], medio=request.json["medio"], genero=request.json["genero"])
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.albumes.append(nuevo_album)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return 'El usuario ya tiene un album con dicho nombre', 409

        return album_schema.dump(nuevo_album)

    # @jwt_required()
    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        albumesCompartidos = [cancion_schema.dump(
            ca) for ca in usuario.usuariosAlbumes]
        albumesUsuario = [cancion_schema.dump(ca) for ca in usuario.albumes]
        for x in albumesCompartidos:
            albumesUsuario.append(x)
        return albumesUsuario


class VistaCancion(Resource):

    def get(self, id_cancion):
        return cancion_schema.dump(Cancion.query.get_or_404(id_cancion))

    def put(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        cancion.titulo = request.json.get("titulo", cancion.titulo)
        cancion.minutos = request.json.get("minutos", cancion.minutos)
        cancion.segundos = request.json.get("segundos", cancion.segundos)
        cancion.interprete = request.json.get("interprete", cancion.interprete)
        cancion.genero = request.json.get("genero", cancion.interprete)
        db.session.commit()
        return cancion_schema.dump(cancion)

    def delete(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        db.session.delete(cancion)
        db.session.commit()
        return '', 204


class VistaAlbumesCanciones(Resource):
    def get(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        return [album_schema.dump(al) for al in cancion.albumes]


class VistaSignIn(Resource):

    def post(self):
        nuevo_usuario = Usuario(
            nombre=request.json["nombre"], contrasena=request.json["contrasena"])
        db.session.add(nuevo_usuario)
        db.session.commit()
        token_de_acceso = create_access_token(identity=nuevo_usuario.id)
        return {"mensaje": "usuario creado exitosamente", "token": token_de_acceso}

    def put(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.contrasena = request.json.get("contrasena", usuario.contrasena)
        db.session.commit()
        return usuario_schema.dump(usuario)

    def delete(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        db.session.delete(usuario)
        db.session.commit()
        return '', 204


class VistaLogIn(Resource):

    def post(self):
        usuario = Usuario.query.filter(
            Usuario.nombre == request.json["nombre"], Usuario.contrasena == request.json["contrasena"]).first()
        db.session.commit()
        if usuario is None:
            return "El usuario no existe", 404
        else:
            token_de_acceso = create_access_token(identity=usuario.id)
            return {"mensaje": "Inicio de sesión exitoso", "token": token_de_acceso}


class VistaCancionesAlbum(Resource):

    def post(self, id_album):
        album = Album.query.get_or_404(id_album)

        if "id_cancion" in request.json.keys():

            nueva_cancion = Cancion.query.get(request.json["id_cancion"])

            if nueva_cancion is not None:
                album.canciones.append(nueva_cancion)
                listUsers = AlbumesCompartidosUsuario.get(self, id_album)
                listCanciones = VistaCancionesAlbum.get(self, id_album)
                # for user in listUsers:
                #     for cancion in listCanciones:
                #         print(cancion['id'])
                #         print(user['usuario_id'])
                #         VistasCancionesUsuario.post(
                #             self, 1, cancion['id'], user['usuario_id'])
                db.session.commit()
            else:
                return 'Canción errónea', 404
        else:
            nueva_cancion = Cancion(titulo=request.json["titulo"], minutos=request.json["minutos"],
                                    segundos=request.json["segundos"], interprete=request.json["interprete"], genero=request.json["genero"])
            album.canciones.append(nueva_cancion)
        db.session.commit()
        return cancion_schema.dump(nueva_cancion)

    def get(self, id_album):
        album = Album.query.get_or_404(id_album)
        return [cancion_schema.dump(ca) for ca in album.canciones]


class VistasCancionesUsuario(Resource):

    def post(self, id_usuarioLog, id_cancion, id_usuario):
        usuarioLog = Usuario.query.get_or_404(id_usuarioLog)
        cancion = Cancion.query.get_or_404(id_cancion)
        usuario = Usuario.query.get_or_404(id_usuario)
        lon = len(VistaCancionesUsuario.get(
            self, id_usuarioLog, id_cancion).get('result'))
        if (lon == 0):
            return 'La Canción no pertenece al usuario logueado', 404
        else:
            cancion.compartirCancion.append(usuario)
        db.session.commit()
        return cancion_schema.dump(cancion)


class VistasAlbumesUsuario(Resource):

    def post(self, id_usuarioLog,  id_album, id_usuario):
        usuarioLog = Usuario.query.get_or_404(id_usuarioLog)
        album = Album.query.get_or_404(id_album)
        usuario = Usuario.query.get_or_404(id_usuario)
        lon = len(VistaAlbumesUsuario.get(
            self, id_usuarioLog, id_album).get('result'))
        if(lon == 0):
            return 'El Album no pertenece al usuario logueado', 404
        else:
            album.compartirAlbum.append(usuario)
            canciones = VistaCancionesAlbum.get(self, id_album)
            for i in range(len(canciones)):
                VistasCancionesUsuario.post(
                    self, id_usuarioLog, canciones[i]['id'], id_usuario)
        db.session.commit()
        return cancion_schema.dump(album)


class AlbumesCompartidosUsuario:
    def get(self, id_album):
        album = Album.query.get_or_404(id_album)
        query_string = "select  * from album_usuario au where au.album_id =" + \
            str(id_album)
        result = db.engine.execute(query_string)
        return [dict(row) for row in result]


class VistaCancionUsuariosDisponibles(Resource):
    def get(self, id_cancion):
        query_string = "select * from usuario a where a.id not in (select usuario_id from cancion_usuario b where b.cancion_id = " + \
            str(id_cancion) + ")"
        print(query_string)
        result = db.engine.execute(query_string)
        return [dict(row) for row in result]


class VistaAlbumUsuariosDisponibles(Resource):
    def get(self, id_album):
        query_string = "select * from usuario a where a.id not in (select usuario_id from album_usuario b where b.album_id = " + \
            str(id_album) + ")"
        print(query_string)
        result = db.engine.execute(query_string)
        return [dict(row) for row in result]


class VistaAlbum(Resource):

    def get(self, id_album):
        return album_schema.dump(Album.query.get_or_404(id_album))

    def put(self, id_album):
        album = Album.query.get_or_404(id_album)
        album.titulo = request.json.get("titulo", album.titulo)
        album.anio = request.json.get("anio", album.anio)
        album.descripcion = request.json.get("descripcion", album.descripcion)
        album.medio = request.json.get("medio", album.medio)
        album.genero = request.json.get("genero", album.medio)
        db.session.commit()
        return album_schema.dump(album)

    def delete(self, id_album):
        album = Album.query.get_or_404(id_album)
        db.session.delete(album)
        db.session.commit()
        return '', 204
