def test_get_matrices(client):
    response = client.get('/matrices')
    assert response.status_code == 200
    assert 'matrices' in response.get_json()

def test_get_matrix_info_valid(client):
    response = client.get('/matrix/1')  # Замените 1 на существующий ID матрицы
    assert response.status_code == 200
    data = response.get_json()
    assert 'matrix_info' in data
    assert 'nodes' in data
    assert 'edges' in data

def test_get_matrix_info_invalid(client):
    response = client.get('/matrix/9999')  # Несуществующий ID
    assert response.status_code == 200
    data = response.get_json()
    assert 'error' in data
