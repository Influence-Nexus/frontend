from flask import Flask, request, jsonify
import os
import uuid
from Transformator import excel_to_txt, instantly_cal

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
TXT_FOLDER = 'data/txt_data'
RESULT_FOLDER = 'data/f90_calcs'
FORTRAN_FILE = 'edited_mils.f90'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TXT_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

@app.route('/run', methods=['POST'])
def run():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Сохранение загруженного файла
    xlsx_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}.xlsx")
    file.save(xlsx_path)
    
    # Преобразование xlsx в txt
    excel_to_txt(UPLOAD_FOLDER, TXT_FOLDER)
    
    # Запуск Fortran программы
    instantly_cal(TXT_FOLDER, RESULT_FOLDER, FORTRAN_FILE)
    
    # Чтение результата
    result_file = os.path.join(RESULT_FOLDER, os.listdir(RESULT_FOLDER)[0])
    with open(result_file, 'r') as f:
        result = f.read()
    
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)

