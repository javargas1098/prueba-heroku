from flask import Flask

def create_app(config_name):
    app = Flask(__name__)  
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://sbbzmftwcpqmbs:63d510222da8ee4b0f412e7b34cd5b203ef12907f963453b33dec8f9f2169a0d@ec2-18-215-44-132.compute-1.amazonaws.com/d5h5dmuoe660fa'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY']='frase-secreta'
    app.config['PROPAGATE_EXCEPTIONS'] = True
    return app