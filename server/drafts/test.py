import pathlib
import shutil
import pandas as pd
import json
import sys
import subprocess

# Определяем базовую директорию относительно текущего скрипта
BASE_DIR = pathlib.Path(__file__).parent.resolve()

def convert_excel_to_txt(input_file, output_file):
    """
    Преобразует Excel-файл в текстовый файл, совместимый с Fortran.
    """
    try:
        df = pd.read_excel(input_file, index_col=0)
        # Индексация строк и столбцов начинается с 1
        df.index = range(1, len(df.index) + 1)
        df.columns = range(1, len(df.columns) + 1)

        # Запись в файл, начиная с правильных данных
        with open(output_file, "w") as f:
            # Количество колонок как число столбцов
            f.write(f"{len(df.columns)}\t1.0\t0.2\n")
            f.write("0\t0\t0\n")  # Здесь нужно тоже точно понимать смысл этой строки
            for row_index, row in df.iterrows():
                for col_index in df.columns:
                    value = row[col_index]
                    if value != 0:
                        f.write(f"{row_index}\t{col_index}\t0\t{value}\n")

        print(f"[INFO] Преобразован файл: {input_file} -> {output_file}")
    except Exception as e:
        print(f"[ERROR] Не удалось обработать файл {input_file}: {e}")



def convert_txt_to_fortran(input_file, output_file):
    """
    Преобразует текстовый файл в формат, совместимый с Fortran.
    """
    try:
        # Чтение входного текстового файла
        with open(input_file, "r") as f:
            lines = f.readlines()

        # Извлекаем заголовки (колонки), пропуская первую строку
        headers = lines[0].strip().split("\t")[1:]  # Пропускаем первую колонку (имя строки)
        matrix = []

        # Обработка данных начиная со второй строки
        for i, line in enumerate(lines[1:]):
            values = line.strip().split("\t")[1:]  # Пропускаем первую колонку (имя строки)
            for j, value in enumerate(values):
                weight = float(value)
                if weight != 0:
                    matrix.append((i + 1, j + 1, 0, weight))  # Индексация с 1

        # Запись данных в выходной файл
        with open(output_file, "w") as f:
            # Записываем размерность матрицы (количество столбцов = len(headers))
            f.write(f"{len(headers)+1}\t1.0\t0.2\n")  # Размерность матрицы
            f.write("0\t0\t0\n")  # Записываем фиксированное влияние на вершины

            # Запись всех ненулевых значений
            for row in matrix:
                f.write("\t".join(map(str, row)) + "\n")

        print(f"[INFO] Преобразован файл: {input_file} -> {output_file}")
    except Exception as e:
        print(f"[ERROR] Ошибка при обработке файла {input_file}: {e}")



def process_fortran_output(file_name):
    """
    Обрабатывает выходные данные Fortran-программы и сохраняет результаты.
    """
    try:
        # Убедитесь, что путь к файлу report.txt правильный
        report_file_path = BASE_DIR / "Vadimka" / "report.txt"
        
        if report_file_path.exists():
            with open(report_file_path, "r") as report:
                u = [float(line[12:-1]) for line in report if len(line) <= 23]
            sq_u = [num ** 2 for num in u]
            sum_u = sum(sq_u)
            normalized_u = [round(value / sum_u, 4) for value in sq_u]

            result = {i + 1: value for i, value in enumerate(normalized_u)}
            sorted_result = dict(sorted(result.items(), key=lambda x: x[1], reverse=True))

            # Сохранение JSON с результатами в папку Vadimka
            result_file_path = BASE_DIR / "Vadimka" / f"{file_name}_result.json"
            with open(result_file_path, "w") as json_file:
                json.dump(sorted_result, json_file, indent=4)

            # Чтение Maximal_Eigen_Value.txt и создание нового файла с использованием имени матрицы
            max_eigen_value_path = BASE_DIR / "Maximal_Eigen_Value.txt"
            if pathlib.Path(max_eigen_value_path).exists():
                max_eigen_value = open(max_eigen_value_path, "r").read().strip()
            else:
                print(f"[WARNING] Файл {max_eigen_value_path} не найден. Пропускаем его обработку.")
                max_eigen_value = "Не найдено"

            # Копирование Maximal_Eigen_Value.txt в Vadimka с новым именем
            max_eigen_value_file = BASE_DIR / "processed_files" / f"{file_name}_MEV.txt"
            with open(max_eigen_value_file, "w") as f:
                f.write(f"Maximal Eigen Value: {max_eigen_value}\n")

            # Копирование отчета в Vadimka с новым именем
            report_file_copy_path = BASE_DIR / "Vadimka" / f"{file_name}_report.txt"
            shutil.copy(str(BASE_DIR / "report.txt"), str(report_file_copy_path))

            print(f"[INFO] Обработан файл: {file_name}. Результат: {result_file_path}, {max_eigen_value_file}, {report_file_copy_path}")
        else:
            print(f"[WARNING] Файл report.txt не найден для {file_name}")

    except Exception as e:
        print(f"[ERROR] Ошибка при обработке выходных данных Fortran для файла {file_name}: {e}")




def process_input_files(input_folder, output_folder, fortran_file):
    """
    Обрабатывает все входные файлы, преобразует их в совместимый формат и запускает Fortran.
    """
    input_path = pathlib.Path(input_folder)
    output_path = pathlib.Path(output_folder)

    # Создаем выходную папку, если её нет
    if not output_path.exists():
        output_path.mkdir(parents=True)

    input_files = [file for file in input_path.glob("*") if file.is_file()]
    print(f"[DEBUG] Найдено файлов для обработки: {len(input_files)}")
    if not input_files:
        print("[WARNING] Нет файлов для обработки.")
        return

    for file in input_files:
        try:
            print(f"[DEBUG] Обрабатываем файл: {file}")

            # Преобразование в формат TXT
            if file.suffix == ".xlsx":
                temp_txt_file = output_path / f"{file.stem}_converted.txt"
                print(f"[DEBUG] Преобразуем Excel -> TXT: {temp_txt_file}")
                convert_excel_to_txt(file, temp_txt_file)
                input_file = temp_txt_file
            elif file.suffix == ".txt":
                temp_txt_file = output_path / f"{file.stem}_converted.txt"
                print(f"[DEBUG] Преобразуем TXT -> Fortran: {temp_txt_file}")
                convert_txt_to_fortran(file, temp_txt_file)
                input_file = temp_txt_file
            else:
                print(f"[WARNING] Неподдерживаемый формат файла: {file.name}")
                continue

            # Копируем файлы в папку Fortran
            shutil.copy(input_file, BASE_DIR / "matrica.txt")

            # Компиляция Fortran-программы
            result = subprocess.run(
                ["gfortran", str(fortran_file), "-o", str(BASE_DIR / "edited_mils.out"), "-O3"],
                capture_output=True,
                text=True
            )
            print(f"[DEBUG] Результат компиляции: {result.returncode}")
            if result.returncode != 0:
                print(f"[ERROR] Ошибка компиляции: {result.stderr}")
                continue

            # Выполнение Fortran-программы
            result = subprocess.run(
                [str(BASE_DIR / "edited_mils.out")],
                capture_output=True,
                text=True,
                cwd=BASE_DIR  # Указание рабочей директории
            )
            shutil.copy(BASE_DIR / "report.txt", BASE_DIR / "Vadimka/report.txt")
            print(f"[DEBUG] Результат выполнения: {result.returncode}")
            print(f"[DEBUG] Стандартный вывод: {result.stdout}")
            print(f"[DEBUG] Стандартная ошибка: {result.stderr}")

            if result.returncode != 0:
                print(f"[ERROR] Ошибка выполнения Fortran: {result.stderr}")
                continue

            process_fortran_output(file.stem)

        except Exception as e:
            print(f"[ERROR] Ошибка при обработке файла {file.name}: {e}")

        finally:
            for temp_file in ["matrica.txt", "edited_mils.out", "report.txt", "Maximal_Eigen_Value.txt"]:
                temp_path = BASE_DIR / temp_file
                if temp_path.exists():
                    temp_path.unlink()


if __name__ == "__main__":
    # Папки для входных и выходных файлов
    INPUT_FOLDER = BASE_DIR / "../static/models"
    FORTRAN_FILE = BASE_DIR / "edited_mils.f90"
    OUTPUT_FOLDER = BASE_DIR / "processed_files"  # Указываем папку для выходных данных

    if len(sys.argv) > 1:
        matrix_file_name = sys.argv[1]
        print(f"[INFO] Обрабатываем только файл: {matrix_file_name}")
        process_input_files(INPUT_FOLDER, OUTPUT_FOLDER, FORTRAN_FILE)
    else:
        print("[INFO] Обрабатываем все файлы в папке")
        process_input_files(INPUT_FOLDER, OUTPUT_FOLDER, FORTRAN_FILE)
