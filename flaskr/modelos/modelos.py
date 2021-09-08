from flask_sqlalchemy import SQLAlchemy
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import fields
import enum


db = SQLAlchemy()

albumes_canciones = db.Table('album_cancion',
                             db.Column('album_id', db.Integer, db.ForeignKey(
                                 'album.id'), primary_key=True),
                             db.Column('cancion_id', db.Integer, db.ForeignKey('cancion.id'), primary_key=True))

albumes_usuarios = db.Table('album_usuario',
                            db.Column('album_id', db.Integer, db.ForeignKey(
                                'album.id'), primary_key=True),
                            db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key=True))

canciones_usuarios = db.Table('cancion_usuario',
                              db.Column('usuario_id', db.Integer, db.ForeignKey(
                                  'usuario.id'), primary_key=True),
                              db.Column('cancion_id', db.Integer, db.ForeignKey('cancion.id'), primary_key=True))


class Cancion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(128))
    minutos = db.Column(db.Integer)
    segundos = db.Column(db.Integer)
    interprete = db.Column(db.String(128))
    genero = db.Column(db.String(512))
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    comentarios = db.relationship(
        'Comentario', cascade='all, delete, delete-orphan')
    albumes = db.relationship(
        'Album', secondary='album_cancion', back_populates="canciones")
    compartirCancion = db.relationship(
        'Usuario', secondary='cancion_usuario', back_populates="usuariosCanciones")
    cancionFavorita = db.relationship(
        'CancionFavoritaUsuario', cascade='all, delete, delete-orphan')


class CancionFavoritaUsuario(db.Model):
    usuario_id = db.Column(db.Integer, db.ForeignKey(
        'usuario.id'), primary_key=True)
    cancion_id = db.Column(db.Integer, db.ForeignKey(
        'cancion.id'), primary_key=True)


class RatingComentario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    comentario = db.Column(db.Integer, db.ForeignKey(
        "comentario.id"), nullable=False)
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))


class Comentario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(128))
    ratings = db.relationship(
        'RatingComentario', cascade='all, delete, delete-orphan')
    albumes = db.Column(db.Integer, db.ForeignKey("album.id"), nullable=True)
    canciones = db.Column(db.Integer, db.ForeignKey(
        "cancion.id"), nullable=True)
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))


class Medio(enum.Enum):
    DISCO = 1
    CASETE = 2
    CD = 3


class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(128))
    anio = db.Column(db.Integer)
    descripcion = db.Column(db.String(512))
    genero = db.Column(db.String(512))
    medio = db.Column(db.Enum(Medio))
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    canciones = db.relationship(
        'Cancion', secondary='album_cancion', back_populates="albumes")
    comentarios = db.relationship(
        'Comentario', cascade='all, delete, delete-orphan')
    compartirAlbum = db.relationship(
        'Usuario', secondary='album_usuario', back_populates="usuariosAlbumes")


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50))
    contrasena = db.Column(db.String(50))
    albumes = db.relationship('Album', cascade='all, delete, delete-orphan')
    canciones = db.relationship(
        'Cancion', cascade='all, delete, delete-orphan')
    ratings = db.relationship(
        'RatingComentario', cascade='all, delete, delete-orphan')
    comentarios = db.relationship(
        'Comentario', cascade='all, delete, delete-orphan')
    usuariosAlbumes = db.relationship(
        'Album', secondary='album_usuario', back_populates="compartirAlbum")
    usuariosCanciones = db.relationship(
        'Cancion', secondary='cancion_usuario', back_populates="compartirCancion")
    usuariosFavoritos = db.relationship(
        'CancionFavoritaUsuario', cascade='all, delete, delete-orphan')


class EnumADiccionario(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return {"llave": value.name, "valor": value.value}


class CancionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Cancion
        include_relationships = True
        load_instance = True


class ComentarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Comentario
        include_relationships = True
        load_instance = True
        fields = ("id", "ratings", "descripcion", "usuario")
    ratings = auto_field()


class RatingComentarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = RatingComentario
        include_relationships = True
        load_instance = True
        fields = ("id", "rating", "canciones", "usuario")


class AlbumSchema(SQLAlchemyAutoSchema):
    medio = EnumADiccionario(attribute=("medio"))

    class Meta:
        model = Album
        include_relationships = True
        load_instance = True


class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario
        include_relationships = True
        load_instance = True


class CancionFavoritaSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CancionFavoritaUsuario
        include_relationships = True
        load_instance = True
        fields = ("usuario_id", "cancion_id")
