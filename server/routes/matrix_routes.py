from flask import Blueprint, jsonify, request, session
from services.matrix_service import get_all_matrices, get_matrix_data, get_response_strength
from utils.score_counter import calculate_order_score
import numpy as np
import pathlib
from drafts.testik import BASE_DIR, process_input_files
import os
import json

CURRENT_BASE_DIR = pathlib.Path(__file__).parent.resolve()
matrix_bp = Blueprint('matrix_bp', __name__)

@matrix_bp.route('/matrices', methods=['GET'])
def get_matrices():
    try:
        matrices = get_all_matrices()
        return jsonify({'matrices': matrices})
    except Exception as e:
        return jsonify({'error': str(e)})

@matrix_bp.route('/matrix/<int:matrix_id>')
def get_matrix_info(matrix_id):
    try:
        matrix_data = get_matrix_data(matrix_id)
        if matrix_data:
            return jsonify({
                'matrix_info': {'matrix_name': matrix_data['matrix_name']},
                'nodes': matrix_data['nodes'],
                'edges': matrix_data['edges'],
            })
        else:
            return jsonify({'error': f"Matrix with ID '{matrix_id}' not found."})
    except Exception as e:
        return jsonify({'error': str(e)})



@matrix_bp.route('/calculate_score', methods=['POST'])
def calculate_score():
    """
    Эндпоинт для расчета очков игрока с учетом порядка выбранных вершин.
    """
    try:
        # Получение данных из запроса
        nodes = request.json.get('selectedNodes', {})  # Должны быть в формате словаря
        matrix_name = request.json.get('matrixName')

        if not matrix_name:
            return jsonify({'error': 'Matrix name is required'}), 400

        # Получение словаря с откликами
        response_strength = get_response_strength(matrix_name)

        if response_strength is None:
            return jsonify({'error': f"Matrix '{matrix_name}' not found"}), 404

        # Преобразуем словарь в список вершин
        node_values = list(nodes.values())  # Получаем значения из словаря

        # Инициализация данных в сессии, если они еще не существуют
        session.setdefault('turns', [])  # Список ходов
        session.setdefault('total_score', 0)  # Общий счет
        session.setdefault('used_nodes', [])  # Список использованных вершин

        # Проверка на повторение вершин
        if any(node in session['used_nodes'] for node in node_values):
            return jsonify({'error': 'Some nodes have already been used in previous turns'}), 400

        # Сохранение текущего хода
        order_score = calculate_order_score(node_values, response_strength)

        # Защита от некорректных значений
        if not isinstance(order_score, (int, float)) or np.isnan(order_score) or order_score < 0:
            order_score = 0  # Если расчёт некорректен, очки устанавливаются в 0

        session['turns'].append({
            'nodes': node_values,
            'score': order_score
        })

        # Обновляем общий счет
        session['total_score'] = max(0, session['total_score'] + order_score)  # Убеждаемся, что score не отрицательный

        # Обновляем список использованных вершин
        session['used_nodes'].extend(node_values)

        # Возвращаем итоговый результат
        return jsonify({
            'turn_score': order_score,
            'total_score': session['total_score'],
            'turns': session['turns']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@matrix_bp.route('/science_table', methods=['POST'])
def get_science_table():
    try:
        # Получаем matrix_name из запроса
        matrix_name = request.json.get('matrixName')
        if not matrix_name:
            return jsonify({"error": "Matrix name is required"}), 400
        # Определяем путь к файлу report.txt
        report_file_path = BASE_DIR / "Vadimka" / f"{matrix_name}_report.txt"
        # Проверяем, существует ли report.txt
        if not report_file_path.exists():
            print(f"[INFO] Файл {report_file_path} не найден. Запускаем процесс обработки Fortran.")
            
            # Если файл не существует, вызываем функцию для обработки файлов и запуска Fortran
            process_input_files(str(BASE_DIR / "../static/models"), str(BASE_DIR / "processed_files"), BASE_DIR / "edited_mils.f90")

        # Читаем report.txt после выполнения Fortran, если оно было выполнено
        if report_file_path.exists():
            with open(report_file_path, "r") as report:
                lines = report.readlines()
        
        # Обрабатываем данные
        u = [float(line[12:-1]) for line in lines if len(line) <= 23]
        x = [float(line[1:10]) for line in lines if len(line) <= 23]
        
        # Вычисляем квадраты и нормализацию
        sq_u = [num ** 2 for num in u]
        sum_sq_u = sum(sq_u)
        normalized_u = [round(value / sum_sq_u, 4) for value in sq_u] if sum_sq_u != 0 else []
        normalized_x = [num ** 2 for num in x]
        true_seq = {i + 1: value for i, value in enumerate(normalized_u)}
        # sorted_true_seq = dict(sorted(true_seq.items(), key=lambda x: x[1], reverse=True))
        sorted_true_seq = sorted(true_seq.items(), key=lambda x: x[1], reverse=True)
        print("\ntrue_seq:\t",true_seq,'\n')
        print("sorted_true_seq:\t",sorted_true_seq,'\n')
        # Формируем результат
        result = {
            "x": x,
            "u": u,
            "normalized_x": normalized_x,
            "normalized_u": normalized_u,
            "matrix_name": matrix_name,
            "sorted_true_seq": sorted_true_seq
        }
        return jsonify(result), 200

    except FileNotFoundError:
        return jsonify({"error": "report.txt not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500





# ===================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====================

def ensure_dir(directory):
    """Создает директорию, если она не существует."""
    os.makedirs(directory, exist_ok=True)
    return directory

def save_json(filepath, data):
    """Сохраняет data в виде JSON в указанный filepath."""
    with open(filepath, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2)

def load_json(filepath):
    """Читает JSON из указанного filepath."""
    with open(filepath, 'r', encoding='utf-8') as file:
        return json.load(file)

def get_default_settings_filepath(matrix_name):
    """Возвращает путь для сохранения настроек графа по умолчанию."""
    folder = os.path.join(CURRENT_BASE_DIR, "graph_settings")
    ensure_dir(folder)
    return os.path.join(folder, f"{matrix_name}_graph_settings.json")

def get_user_settings_filepath(user_id, matrix_name):
    """Возвращает путь для сохранения настроек графа для пользователя."""
    folder = os.path.join(CURRENT_BASE_DIR, "users", user_id, "user_settings")
    ensure_dir(folder)
    return os.path.join(folder, f"{matrix_name}_settings.json")

def get_user_creds_filepath(username):
    """Возвращает путь для хранения учетных данных пользователя."""
    folder = os.path.join(CURRENT_BASE_DIR, "users", username, "user_creds")
    ensure_dir(folder)
    return os.path.join(folder, f"{username}.json")


# ===================== ЭНДПОИНТЫ ДЛЯ НАСТРОЕК ГРАФА =====================

# 1. Настройки графа по умолчанию
@matrix_bp.route('/save-graph-settings/<matrix_name>', methods=['POST'])
def save_graph_settings(matrix_name):
    """Сохраняет настройки графа по умолчанию в JSON-файл."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        filepath = get_default_settings_filepath(matrix_name)
        save_json(filepath, data)
        print(f"[INFO] Default settings saved at {filepath}.")
        return jsonify({"message": "Настройки графа успешно сохранены."}), 200
    except Exception as e:
        print(f"[ERROR] Ошибка при сохранении файла: {e}")
        return jsonify({"error": "Ошибка при сохранении файла."}), 500

@matrix_bp.route('/load-graph-settings/<matrix_name>', methods=['GET'])
def load_graph_settings(matrix_name):
    """Загружает настройки графа по умолчанию из JSON-файла."""
    try:
        filepath = get_default_settings_filepath(matrix_name)
        if not os.path.exists(filepath):
            return jsonify({'error': f"Файл настроек для '{matrix_name}' не найден."}), 404
        data = load_json(filepath)
        print(f"[INFO] Default settings loaded from {filepath}.")
        return jsonify(data), 200
    except Exception as e:
        print(f"[ERROR] Ошибка загрузки файла: {e}")
        return jsonify({"error": "Ошибка загрузки файла."}), 500


# 2. Пользовательские настройки графа (координат)
@matrix_bp.route('/<user_id>/save-graph-settings/<matrix_name>', methods=['POST'])
def save_user_graph_settings(user_id, matrix_name):
    """
    Сохраняет настройки графа для пользователя.
    Сохраняет данные в: 
      users/<user_id>/user_settings/<matrix_name>_settings.json
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        filepath = get_user_settings_filepath(user_id, matrix_name)
        save_json(filepath, data)
        print(f"[INFO] Settings for user '{user_id}' saved at {filepath}.")
        return jsonify({"message": "Настройки графа успешно сохранены."}), 200
    except Exception as e:
        print(f"[ERROR] Ошибка при сохранении файла for user '{user_id}': {e}")
        return jsonify({"error": "Ошибка при сохранении файла."}), 500

@matrix_bp.route('/<user_id>/load-graph-settings/<matrix_name>', methods=['GET'])
def load_user_graph_settings(user_id, matrix_name):
    """
    Загружает настройки графа для пользователя из файла:
      users/<user_id>/user_settings/<matrix_name>_settings.json
    """
    try:
        filepath = get_user_settings_filepath(user_id, matrix_name)
        if not os.path.exists(filepath):
            return jsonify({'error': f"Файл настроек для '{matrix_name}' пользователя '{user_id}' не найден."}), 404
        data = load_json(filepath)
        print(f"[INFO] Settings for user '{user_id}' loaded from {filepath}.")
        return jsonify(data), 200
    except Exception as e:
        print(f"[ERROR] Ошибка загрузки файла for user '{user_id}': {e}")
        return jsonify({"error": "Ошибка загрузки файла."}), 500


# ===================== ЭНДПОИНТЫ ДЛЯ АВТОРИЗАЦИИ =====================

@matrix_bp.route('/sign-up', methods=['POST'])
def sign_up():
    """
    Роутер для регистрации пользователя.
    Ожидает JSON с полями: username, email, password.
    Данные сохраняются в: ./users/<username>/user_creds/<username>.json
    """
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        if not username or not email or not password:
            return jsonify({"error": "username, email и password обязательны"}), 400

        creds_filepath = get_user_creds_filepath(username)
        if os.path.exists(creds_filepath):
            return jsonify({"error": "Пользователь с таким именем уже существует"}), 400

        user_data = {
            "username": username,
            "email": email,
            "password": password  # Пароль хранится в открытом виде (не рекомендуется для продакшена)
        }
        save_json(creds_filepath, user_data)
        print(f"[INFO] User '{username}' registered with credentials stored at {creds_filepath}.")
        return jsonify({"message": "Пользователь успешно зарегистрирован"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@matrix_bp.route('/sign-in', methods=['POST'])
def sign_in():
    """
    Роутер для входа пользователя.
    Ожидает JSON с полями: username и password.
    При успешной аутентификации имя пользователя сохраняется в сессии.
    """
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return jsonify({"error": "username и password обязательны"}), 400

        creds_filepath = get_user_creds_filepath(username)
        if not os.path.exists(creds_filepath):
            return jsonify({"error": "Пользователь не найден"}), 404

        user_data = load_json(creds_filepath)
        if user_data.get("password") != password:
            return jsonify({"error": "Неверный пароль"}), 401

        session.permanent = True  # Устанавливаем постоянную сессию
        session["user"] = username
        print(f"[INFO] User '{username}' logged in successfully.")
        return jsonify({"message": "Вход выполнен успешно"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500