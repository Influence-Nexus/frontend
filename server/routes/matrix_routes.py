from flask import Blueprint, jsonify, request, session
from services.matrix_service import get_all_matrices, get_matrix_data, get_response_strength
from utils.score_counter import calculate_order_score
import numpy as np

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

