from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Replace these values with your own
host = '147.45.68.90'
user = 'main_admin'
password = 'Accessors231'
database = 'influence_models'

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
    #     conn = mysql.connector.connect(host=host, user=user, password=password, database=database)
    #     cursor = conn.cursor(dictionary=True)

    #     # Fetch list of matrices
        result = execute_query("SELECT matrix_name FROM Matrices")
        matrices = [row['matrix_name'] for row in result]

        return jsonify({'matrices': matrices})

    except Exception as e:
        return jsonify({'error': str(e)})

    # finally:
    #     cursor.close()
    #     conn.close()

# Helper function to execute queries and fetch dat

# Endpoint to get node and edge information for a specific matrix# Endpoint to get node and edge information for a specific matrix
@app.route('/matrix/<matrix_name>')
def get_matrix_info(matrix_name):
    # Query to fetch node and edge information for a matrix
    query = """
    SELECT
        Nodes.node_id AS source_id,
        Nodes.node_name AS source_name,
        Edges.target_node_id AS target_id,
        Nodes.node_name AS target_name,
        Edges.value AS value
    FROM
        Matrices
    JOIN Nodes ON Matrices.matrix_id = Nodes.matrix_id
    JOIN Edges ON Matrices.matrix_id = Edges.matrix_id AND Nodes.node_id = Edges.source_node_id
    WHERE
        Matrices.matrix_name = %s
    """

    result = execute_query(query, (matrix_name,))
    
    # Organize data into nodes and edges
    nodes = set()
    edges = []

    for row in result:
        source_node = (row['source_id'], row['source_name'])
        target_node = (row['target_id'], row['target_name'])
        nodes.add(source_node)
        nodes.add(target_node)
        edges.append({
            'from': {'id': row['source_id'], 'name': row['source_name']},
            'to': {'id': row['target_id'], 'name': row['target_name']},
            'value': row['value']
        })
    print({'edges': edges})
    # Return data as JSON
    return jsonify({'matrix_name': matrix_name,'edges': edges})

if __name__ == '__main__':
    app.run(host= "0.0.0.0", debug=True)