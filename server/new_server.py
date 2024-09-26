from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import base64

app = Flask(__name__)
CORS(app)

# Директория, содержащая файлы с матрицами
matrix_files_directory = 'static/models'

# Словарь для хранения соответствия matrix_id и matrix_name
matrix_ids = {}
matrix_id_counter = 1

# Инициализация matrix_ids при запуске приложения
for filename in os.listdir(matrix_files_directory):
    if filename.endswith(".txt"):
        matrix_name = filename[:-4]  # Убираем ".txt"
        matrix_ids[matrix_id_counter] = matrix_name
        matrix_id_counter += 1

print(matrix_ids)


def get_matrix_data(matrix_id):
    """
    Функция для чтения данных о матрице из файла .txt.
    """
    matrix_name = matrix_ids.get(matrix_id)
    if matrix_name is None:
        return None
    
    print(matrix_name)

    matrix_file_path = os.path.join(matrix_files_directory, f"{matrix_name}.txt")

    print(matrix_file_path)

    try:
        # Чтение данных из файла .txt
        matrix_df = pd.read_csv(matrix_file_path, sep='\t', index_col=0)

        nodes = [{'id': i + 1, 'name': node_name} for i, node_name in enumerate(matrix_df.columns)]
        edges = []
        for source_node_name, row in matrix_df.iterrows():
            source_node_id = matrix_df.columns.get_loc(source_node_name) + 1
            for target_node_name, value in row.items():
                target_node_id = matrix_df.columns.get_loc(target_node_name) + 1
                if pd.notna(value):
                    edges.append({
                        'from': source_node_id,
                        'to': target_node_id,
                        'value': float(value)
                    })

        return {
            'matrix_name': matrix_name,
            'nodes': nodes,
            'edges': edges,
            'description': "LOL"
        }

    except FileNotFoundError:
        return None


@app.route('/matrices', methods=['GET'])
def get_matrices():
    try:
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

        return jsonify({'matrices': matrices})

    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/matrix/<int:matrix_id>')
def get_matrix_info(matrix_id):
    try:
        matrix_data = get_matrix_data(matrix_id)
        print(matrix_data)
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


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)