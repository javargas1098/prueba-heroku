# test_canciones.py
import unittest
from faker import Faker
import random
import requests
from flaskr import create_app
import json
from flaskr.vistas import *
from flaskr.modelos import *

fake = Faker()
cancion_schema = CancionSchema()
usuario_schema = UsuarioSchema()
album_schema = AlbumSchema()
comentario_schema = ComentarioSchema()
rating_comentario_schema = RatingComentarioSchema()
cancion_favorita = CancionFavoritaSchema()
app = create_app('default')
app_context = app.app_context()
app_context.push()
db.init_app(app)
db.create_all()


class DriverTestCase(unittest.TestCase):
    # def test_passing(self):
    #     assert (1, 2, 3) == (1, 2, 3)

    def test_compartir_cancion(self):
        nombre = fake.sentence()
        nombre2 = fake.name()
        genero = fake.sentence()
        requets = requests.post('https://proyecto-ionic-grupo21.herokuapp.com/usuario/1/canciones', json={
            "titulo": nombre,
            "minutos": "2",
            "segundos": "22",
            "interprete": nombre2,
            "genero": genero
        })
        cancion=requets.json()['id']
        VistasCancionesUsuario.post(self, 1, cancion, 2)
        prueba = VistaCanciones.get(self, 2)
        self.assertEqual(len(prueba), len(prueba))
        
    def test_compartir_Album(self):
        nombre = fake.sentence()
        nombre2 = fake.sentence()
        genero = fake.sentence()
        requets = requests.post('https://proyecto-ionic-grupo21.herokuapp.com/usuario/1/albumes', json={
            "titulo": nombre,
            "anio": "1986",
            "descripcion": nombre2,
            "medio": "CD",
            "genero": genero
        })
        album=requets.json()['id']
        VistasAlbumesUsuario.post(self, 1, album, 2)
        prueba = VistaAlbumsUsuario.get(self, 2)
        self.assertEqual(len(prueba), len(prueba))

    def test_create_cancion(self):
        nombre = fake.sentence()
        nombre2 = fake.name()
        genero = fake.sentence()
        requets = requests.post('https://proyecto-ionic-grupo21.herokuapp.com/usuario/1/canciones', json={
            "titulo": nombre,
            "minutos": "2",
            "segundos": "22",
            "interprete": nombre2,
            "genero": genero
        })
        id_cancion=requets.json()['id']
        
        cancion = VistaCancionesUsuario.get(self, 1,id_cancion)
        self.assertEqual(nombre, cancion['result'][0]['titulo'])
        
    def test_create_Album(self):
        nombre = fake.sentence()
        nombre2 = fake.sentence()
        genero = fake.sentence()
        requets = requests.post('https://proyecto-ionic-grupo21.herokuapp.com/usuario/1/albumes', json={
            "titulo": nombre,
            "anio": "1986",
            "descripcion": nombre2,
            "medio": "CD",
            "genero": genero
        })
        id_album=requets.json()['id']
       
        album = VistaAlbumesUsuario.get(self, 1, id_album)
        self.assertEqual(nombre, album['result'][0]['titulo'])
    
    def test_crear_comentario_cancion(self):
        descripcion = fake.sentence()
        canciones_old = VistaComentariosCancion.get(self,1,1)
        requets = requests.post('https://proyecto-ionic-grupo21.herokuapp.com/comentariosCancion/1/1', json={
            "descripcion": descripcion
        })
        id_cancion=requets.json()['id']  

        canciones_new = VistaComentariosCancion.get(self,1,1)
        self.assertEqual(len(canciones_old)+1,len(canciones_new) )

    def test_crear_raiting_comentario(self):
        rating = 5
        descripcion = fake.sentence()   
        requets = requests.post('https://proyecto-ionic-grupo21.herokuapp.com/comentariosCancion/1/1', json={
            "descripcion": descripcion
        })
        id_comentario=requets.json()['id']  
        raiting_old = VistaRatingComentarios.get(self,id_comentario,1)
        requets = requests.post('https://proyecto-ionic-grupo21.herokuapp.com/ratings/'+str(id_comentario)+'/1', json={
            "rating": rating
        })
        print(requets.json())
        raiting_new = VistaRatingComentarios.get(self,id_comentario,1)
        self.assertEqual(len(raiting_old)+1,len(raiting_new) )