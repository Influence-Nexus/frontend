from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import pandas as pd
import base64


app = Flask(__name__)
CORS(app)

# Replace these values with your own
host = '185.36.147.31'
user = 'oko'
password = 'Accessors231'
database = 'CoDe'

def execute_query(query, params=None):
    conn = mysql.connector.connect(host=host, user=user, password=password, database=database)
    cursor = conn.cursor(dictionary=True)
    
    if params:
        cursor.execute(query, params)
    else:
        cursor.execute(query)
    
    result = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return result

@app.route('/matrices', methods=['GET'])
def get_matrices():
    try:
        # Fetch list of matrices with additional information
        result = execute_query("""
            SELECT 
                M.matrix_id,
                M.matrix_name,
                M.description,
                M.image,
                COUNT(DISTINCT N.node_id) AS node_count,
                COUNT(DISTINCT E.edge_id) AS edge_count
            FROM Matrices M
            LEFT JOIN Nodes N ON M.matrix_id = N.matrix_id
            LEFT JOIN Edges E ON M.matrix_id = E.matrix_id
            WHERE E.value <> 0  -- Include only edges with non-zero value
            GROUP BY M.matrix_id, M.matrix_name, M.description
        """)


        matrices = [{'matrix_id': row['matrix_id'],
                     'matrix_name': row['matrix_name'],
                     'description': row['description'],
                     'image': base64.b64encode(row['image']).decode('utf-8') if row['image'] else "NULL",
                     'node_count': row['node_count'],
                     'edge_count': row['edge_count']} for row in result]

        return jsonify({'matrices': matrices})

    except Exception as e:
        return jsonify({'error': str(e)})
    

@app.route('/calculate_score', methods=['POST'])
def calculate_score():
    # Получаем данные о вершинах из запроса
    vertices = request.json.get('selectedNodes')
    matrixName = request.json.get('matrixName')
    print(vertices)

    csv_filename = f"static/cognition/{matrixName}.csv"

    df = pd.read_csv(csv_filename).sort_values(by="Controllability-ensuring index", ascending=False).to_numpy()
    print(df)

    score = 0

    for key, value in vertices.items():
        print(key, value)
        if value == int(df[int(key)][0]):
            score += float(df[int(key)][-1].replace(',', '.')) * 100
        else:
            score -= (100 - float(df[int(key)][-1].replace(',', '.')) * 100) * 0.2



    return jsonify({'score': score})


# Helper function to execute queries and fetch dat

# Endpoint to get node and edge information for a specific matrix# Endpoint to get node and edge information for a specific matrix
@app.route('/matrix/<int:matrix_id>')
def get_matrix_info(matrix_id):

    # Query to fetch node and edge information along with matrix details for a matrix by matrix ID
    query = """
SELECT
    Matrices.matrix_name,
    Matrices.description,
    Nodes.node_id AS source_id,
    Nodes.node_name AS source_name,
    Nodes.node_ru_name AS source_ru_name,
    Nodes.description AS source_description,
    Nodes.image AS source_image,

    Nodes.target AS source_target,
    Edges.target_node_id AS target_id,
    TargetNodes.node_name AS target_name,
    TargetNodes.node_ru_name AS target_ru_name,
    TargetNodes.description AS target_description,
    TargetNodes.image AS target_image,
    TargetNodes.target AS target_target,
    Edges.value AS value
FROM
    Matrices
JOIN Nodes ON Matrices.matrix_id = Nodes.matrix_id
JOIN Edges ON Matrices.matrix_id = Edges.matrix_id AND Nodes.node_id = Edges.source_node_id
JOIN Nodes AS TargetNodes ON Edges.target_node_id = TargetNodes.node_id
WHERE
    Matrices.matrix_id = %s
    """

    result = execute_query(query, (matrix_id,))
    
    # Organize data into nodes and edges
    nodes = set()
    edges = []

    matrix_info = None

    for row in result:
        if matrix_info is None:
            matrix_info = {
                'matrix_id': matrix_id,
                'matrix_name': row['matrix_name'],
                'description': row['description']
            }

        source_node = (row['source_id'], row['source_name'])
        target_node = (row['target_id'], row['target_name'])
        nodes.add(source_node)
        nodes.add(target_node)
        edges.append({
            'from': {'id': row['source_id'], 'name': row['source_name'], 'target': row['source_target'], 'ru_name': row['source_ru_name'], 'description': row['source_description'], 'image': base64.b64encode(row['source_image']).decode('utf-8') if row['source_image'] else "NULL"},
            'to': {'id': row['target_id'], 'name': row['target_name'], 'target': row['target_target'], 'ru_name': row['target_ru_name'], 'description': row['target_description'], 'image': base64.b64encode(row['target_image']).decode('utf-8') if row['target_image'] else "NULL"},
            'value': row['value']
        })

    # csv_filename = f"static/cognition/{matrix_info['matrix_name']}.csv"

    # df = pd.read_csv(csv_filename)

    # Convert CSV data to JSON
    csv_data = {}

    # Return data as JSON
    return jsonify({'matrix_info': matrix_info, 'edges': edges, 'csv_data': csv_data})

if __name__ == '__main__':
    app.run(host= "0.0.0.0", debug=True)