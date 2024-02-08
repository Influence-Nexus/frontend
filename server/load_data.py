import pandas as pd
import mysql.connector
import os

# Замените значения на ваши данные
host = '147.45.68.90'
user = 'check_admin'
password = 'Accessors231'
database = 'influence_nexus'

## Подключение к базе данных
conn = mysql.connector.connect(host=host, user=user, password=password, database=database)
cursor = conn.cursor()

# Создание таблицы matrix_info в базе данных
create_matrix_info_table_query = """
CREATE TABLE IF NOT EXISTS matrix_info (
    matrix_id INT AUTO_INCREMENT PRIMARY KEY,
    matrix_name VARCHAR(255) NOT NULL
);
"""
cursor.execute(create_matrix_info_table_query)

# Создание таблицы matrix_factors в базе данных
create_matrix_factors_table_query = """
CREATE TABLE IF NOT EXISTS matrix_factors (
    factor_id INT AUTO_INCREMENT PRIMARY KEY,
    matrix_id INT,
    factor_name VARCHAR(255) NOT NULL,
    factor_value FLOAT,
    FOREIGN KEY (matrix_id) REFERENCES matrix_info(matrix_id)
);
"""
cursor.execute(create_matrix_factors_table_query)

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

    # Вставка основной информации о матрице
    insert_matrix_info_query = f"""
    INSERT INTO matrix_info (matrix_name) VALUES ('{matrix_name}');
    """
    cursor.execute(insert_matrix_info_query)

    # Получение ID вставленной матрицы
    last_matrix_id = cursor.lastrowid


    for factor_name, factor_values in matrix_df.items():
        for last_matrix_id, factor_value in zip([last_matrix_id] * len(factor_values), factor_values):
        # Проверка на 'nan' и замена на 0
            factor_value = float(factor_value) if pd.notna(factor_value) else 0
            insert_matrix_factors_query = """
            INSERT INTO matrix_factors (matrix_id, factor_name, factor_value)
            VALUES (%s, %s, %s);
            """
            cursor.execute(insert_matrix_factors_query, (last_matrix_id, factor_name, factor_value))



# Применение изменений
conn.commit()

# Закрытие соединения
cursor.close()
conn.close()