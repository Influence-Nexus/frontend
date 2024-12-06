from flask import Flask,session
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from routes.matrix_routes import matrix_bp
import os
from flask import send_from_directory

app = Flask(__name__)
CORS(app)

# Подключение Blueprint для роутов
app.register_blueprint(matrix_bp)
app.secret_key = 'super_secret_key'  # Задайте ваш секретный ключ

# Swagger
SWAGGER_URL = '/api/docs'  # URL для документации
API_URL = '/docs/swagger.yaml'  # Абсолютный маршрут до YAML файла

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Matrix API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route('/docs/swagger.yaml')
def swagger_yaml():
    docs_directory = os.path.join(os.path.dirname(__file__), 'docs')
    return send_from_directory(docs_directory, 'swagger.yaml')


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
