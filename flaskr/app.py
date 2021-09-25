from flaskr import create_app
from flask_restful import Api
from .modelos import db
from .vistas import VistaCanciones, VistaComentariosAlbum, VistaCancion, VistaSignIn, VistaAlbum, VistaAlbumsUsuario, VistaCancionesAlbum, VistaLogIn, VistaAlbumesCanciones, VistasCancionesUsuario, VistasAlbumesUsuario, VistaCancionesUsuario, VistaAlbumesUsuario, VistaAlbumUsuariosDisponibles, VistaCancionUsuariosDisponibles, VistaComentariosCancion, VistaRatingComentarios, VistaPromedioUsuario,VistaCancionesFavoritas,VistaCancionFavorita
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin

app = create_app('default')
app_context = app.app_context()
app_context.push()

db.init_app(app)
db.create_all()
cors = CORS(app)

api = Api(app)

api.add_resource(VistaCanciones, '/usuario/<int:id_usuario>/canciones')
api.add_resource(VistaCancionesUsuario,
                 '/usuario/<int:id_usuario>/canciones/<int:id_cancion>')
api.add_resource(VistaAlbumesUsuario,
                 '/usuario/<int:id_usuario>/albumes/<int:id_album>')
api.add_resource(VistaCancion, '/cancion/<int:id_cancion>')
api.add_resource(VistaAlbumesCanciones, '/cancion/<int:id_cancion>/albumes')
api.add_resource(VistaSignIn, '/signin')
api.add_resource(VistaLogIn, '/logIn')
api.add_resource(VistaAlbumsUsuario, '/usuario/<int:id_usuario>/albumes')
api.add_resource(VistaAlbum, '/album/<int:id_album>')
api.add_resource(VistaAlbumUsuariosDisponibles,
                 '/album/<int:id_album>/usuariosDisponibles')
api.add_resource(VistaCancionUsuariosDisponibles,
                 '/cancion/<int:id_cancion>/usuariosDisponibles')
api.add_resource(VistaCancionesAlbum, '/usuario/<int:id_usuarioLog>/album/<int:id_album>/canciones')
api.add_resource(VistasCancionesUsuario,
                 '/cancionUsuario/<int:id_usuarioLog>/<int:id_cancion>/<int:id_usuario>')
api.add_resource(VistasAlbumesUsuario,
                 '/albumUsuario/<int:id_usuarioLog>/<int:id_album>/<int:id_usuario>')
api.add_resource(VistaComentariosAlbum,
                 '/comentariosAlbum/<int:id_album>/<int:id_usuario>')
api.add_resource(VistaComentariosCancion,
                 '/comentariosCancion/<int:id_cancion>/<int:id_usuario>')
api.add_resource(VistaRatingComentarios,
                 '/ratings/<int:id_comentario>/<int:id_usuario>')
api.add_resource(VistaPromedioUsuario,
                 '/promedio/<int:id_usuario>')
api.add_resource(VistaCancionFavorita,
                 '/cancionfavorita/<int:id_usuario>')
api.add_resource(VistaCancionesFavoritas,
                 '/cancionesfavoritas/<int:id_cancion>/<int:id_usuario>')



jwt = JWTManager(app)
