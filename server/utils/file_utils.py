import pandas as pd

def read_matrix_file(file_path, matrix_name):
    try:
        matrix_df = pd.read_csv(file_path, sep='\t', index_col=0)

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
