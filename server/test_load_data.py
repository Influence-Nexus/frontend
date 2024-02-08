import pandas as pd
import mysql.connector
import os

# Replace these values with your own
host = '147.45.68.90'
user = 'main_admin'
password = 'Accessors231'
database = 'influence_models'

# Подключение к базе данных
conn = mysql.connector.connect(host=host, user=user, password=password, database=database)
cursor = conn.cursor()

# Создание таблицы Matrices в базе данных
create_matrices_table_query = """
CREATE TABLE IF NOT EXISTS Matrices (
    matrix_id INT AUTO_INCREMENT PRIMARY KEY,
    matrix_name VARCHAR(50) NOT NULL,
    description TEXT
);
"""
cursor.execute(create_matrices_table_query)

# Создание таблицы Nodes в базе данных
create_nodes_table_query = """
CREATE TABLE IF NOT EXISTS Nodes (
    node_id INT AUTO_INCREMENT PRIMARY KEY,
    matrix_id INT,
    node_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (matrix_id) REFERENCES Matrices(matrix_id)
);
"""
cursor.execute(create_nodes_table_query)

# Создание таблицы Edges в базе данных
create_edges_table_query = """
CREATE TABLE IF NOT EXISTS Edges (
    edge_id INT AUTO_INCREMENT PRIMARY KEY,
    matrix_id INT,
    source_node_id INT,
    target_node_id INT,
    value FLOAT,
    FOREIGN KEY (matrix_id) REFERENCES Matrices(matrix_id),
    FOREIGN KEY (source_node_id) REFERENCES Nodes(node_id),
    FOREIGN KEY (target_node_id) REFERENCES Nodes(node_id)
);
"""
cursor.execute(create_edges_table_query)

# Директория, содержащая файлы с матрицами
matrix_files_directory = 'models'

# Получение списка файлов в директории
matrix_files = [f for f in os.listdir(matrix_files_directory) if f.endswith('.txt')]

# Занесение данных в базу данных для каждого файла
for matrix_file in matrix_files:
    print(matrix_file)
    matrix_file_path = os.path.join(matrix_files_directory, matrix_file)

    # Чтение данных из файла .txt
    matrix_df = pd.read_csv(matrix_file_path, sep='\t', index_col=0)
    matrix_name = os.path.splitext(matrix_file)[0]
    description = f'Description for {matrix_file}'

    # Вставка основной информации о матрице
    insert_matrices_query = """
    INSERT INTO Matrices (matrix_name, description) VALUES (%s, %s);
    """
    cursor.execute(insert_matrices_query, (matrix_name, description))

    # Получение ID вставленной матрицы
    last_matrix_id = cursor.lastrowid

    # Вставка данных в таблицу Nodes
    for node_name in matrix_df.columns:
        insert_nodes_query = """
        INSERT INTO Nodes (matrix_id, node_name) VALUES (%s, %s);
        """
        cursor.execute(insert_nodes_query, (last_matrix_id, node_name))

    # Вставка данных в таблицу Edges
    for source_node_name, row in matrix_df.iterrows():
        for target_node_name, value in row.items():
            # Execute the SELECT query for source node
            cursor.execute(f"SELECT node_id FROM Nodes WHERE matrix_id={last_matrix_id} AND node_name='{source_node_name}'")
            
            # Fetch the result for source node
            result_source = cursor.fetchone()

            # Execute the SELECT query for target node
            cursor.execute(f"SELECT node_id FROM Nodes WHERE matrix_id={last_matrix_id} AND node_name='{target_node_name}'")
            
            # Fetch the result for target node
            result_target = cursor.fetchone()

            # Check if the results are not None
            if result_source is not None and result_target is not None:
                source_node_id = result_source[0]
                target_node_id = result_target[0]
                
                # Insert data into Edges table
                insert_edges_query = """
                INSERT INTO Edges (matrix_id, source_node_id, target_node_id, value) VALUES (%s, %s, %s, %s);
                """
                cursor.execute(insert_edges_query, (last_matrix_id, source_node_id, target_node_id, float(value) if pd.notna(value) else 0))
            else:
                print(f"Nodes not found for matrix_id={last_matrix_id}, source_node_name='{source_node_name}', target_node_name='{target_node_name}'.")

# Применение изменений
conn.commit()

# Закрытие соединения
cursor.close()
conn.close()
