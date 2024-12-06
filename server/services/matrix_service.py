import pandas as pd
import os
from config.settings import STATIC_MODELS_DIR
from utils.file_utils import read_matrix_file

# Глобальные переменные
matrix_ids = {}
matrix_id_counter = 1

# Инициализация матриц
for filename in os.listdir(STATIC_MODELS_DIR):
    if filename.endswith(".txt"):
        matrix_name = filename[:-4]  # Убираем ".txt"
        matrix_ids[matrix_id_counter] = matrix_name
        matrix_id_counter += 1


def get_all_matrices():
    matrices = []
    for matrix_id, matrix_name in matrix_ids.items():
        matrix_data = get_matrix_data(matrix_id)
        if matrix_data:
            matrices.append({
                'matrix_id': matrix_id,
                'matrix_name': matrix_name,
                'node_count': len(matrix_data['nodes']),
                'edge_count': len(matrix_data['edges'])
            })
    return matrices


def get_matrix_data(matrix_id):
    matrix_name = matrix_ids.get(matrix_id)
    if not matrix_name:
        return None

    matrix_file_path = os.path.join(STATIC_MODELS_DIR, f"{matrix_name}.txt")
    return read_matrix_file(matrix_file_path, matrix_name)


def get_response_strength(matrix_name):
    """
    Возвращает словарь откликов для заданной матрицы.
    """

    report = open(f"./data/f90_calcs/{matrix_name}_report.txt", 'r')
    u = []
    for i in report.readlines():
        if len(i) <= 23:
            u.append(float(i[12:-1]))
    sq_u = [float(num) ** 2 for num in u]
    sum_u = sum(sq_u)
    sorted_list_u = []
    for f in sq_u:
        sorted_list_u.append(f / sum_u)
    indexes = [q for q in range(1, len(sorted_list_u) + 1)]
    result = {index: round(value, 4) for index, value in zip(indexes, sorted_list_u)}
    sorted_result_desc = dict(sorted(result.items(), key=lambda item: item[1], reverse=True))
    print(sorted_result_desc)
    
    return sorted_result_desc
