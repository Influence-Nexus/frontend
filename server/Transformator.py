import glob
import json
import os
import pathlib
import re
import shutil
import pandas as pd


def excel_to_txt():
    path_to_data = pathlib.Path("./data")
    for file in glob.glob(f"{path_to_data}/*.xlsx"):
        file_name = file.replace('data/', '')
        df = pd.read_excel(file, index_col=0)
        print(df.head(2))
        df.index = range(1, len(df.index) + 1)
        df.columns = range(1, len(df.columns) + 1)
        file_name = file_name.replace(".xlsx", '.txt')
        result = []
        for row_index, row in df.iterrows():
            for col_index in df.columns:
                value = row[col_index]
                if value != 0:
                    result.append((row_index, col_index, 0, value))
        if pathlib.Path(f'./data/txt_data/{file_name}').exists():
            os.remove(f'./data/txt_data/{file_name}')
        with open(f'./data/txt_data/{file_name}', 'a') as f:
            # f.write(f"{len(df.columns)}\t1.0\t0.2")
            f.write(f"{len(df.columns)}")
            vetices = []
            num_of_vertices_with_inf = [0, 0, 0]
            while True:

                vertex_selection = input("Выберите вершину, если необходимо воздействие, если нет, то жмите 0: ")
                # vertex_selection = '0'
                if int(vertex_selection) <= len(df.columns) and vertex_selection != "0":
                    if int(vertex_selection) in vetices:
                        print("Это значение уже есть! ")
                    else:
                        vetices.append(int(vertex_selection))
                        vertex_impact = input("Какое влияние на вершину оказываем: 1)N(0)\t2)N(+)\t3) N(-) ")
                        if vertex_impact == "1":
                            num_of_vertices_with_inf = [x + y for x, y in zip(num_of_vertices_with_inf, [1, 1, 1])]
                        elif vertex_impact == "2":
                            num_of_vertices_with_inf = [x + y for x, y in zip(num_of_vertices_with_inf, [0, 1, 1])]
                        elif vertex_impact == "3":
                            num_of_vertices_with_inf = [x + y for x, y in zip(num_of_vertices_with_inf, [0, 0, 1])]
                        else:
                            print("Вы ввели не то! ")
                elif vertex_selection == "0":
                    num_of_vertices_with_inf = re.sub(r'[\][\]]', '', str(num_of_vertices_with_inf))
                    num_of_vertices_with_inf = num_of_vertices_with_inf.replace(", ", "\t")
                    vetices = re.sub(r'[\][\]]', '', str(vetices))
                    vetices = vetices.replace(", ", " ")
                    f.write("\n" + num_of_vertices_with_inf + "\n")
                    f.write(vetices + "\n")
                    print('\n')
                    break
                else:
                    print(f"Вы ввели не то! Введите число больше 0 и меньше {len(df.columns)}")
            for i, entry in enumerate(result):
                if i < len(result) - 1:
                    f.write(f"{entry[0]}\t{entry[1]}\t{entry[2]}\t{entry[3]}\n")
                else:
                    f.write(f"{entry[0]}\t{entry[1]}\t{entry[2]}\t{entry[3]}")

    print("Таблицы преобразованы в нужные текстовики\nВсе преобразованные файлы сохранены под своими именами в папке"
          " ./data/txt_data/")


def instantly_cal():
    mev_list = []
    for file in glob.glob("./data/txt_data/*.txt"):
        rem_file = ["./mils.out", "./Maximal_Eigen_Value", "./report.txt", "./data/f90_calcs/*.txt"]
        for rm_f in rem_file:
            if pathlib.Path(rm_f).exists():
                os.remove(rm_f)
        file_name = file.replace('./data/txt_data/', '').replace(".txt", "")
        print(file_name)
        shutil.copy(src=file, dst="matrica.txt")
        os.system("gfortran './edited_mils.f90' -o ./edited_mils.out -O3")
        os.system("./edited_mils.out")
        report = open("./report.txt", 'r')
        # x = []
        u = []
        for i in report.readlines():
            if len(i) <= 23:
                # x.append(float(i[1:10]))
                u.append(float(i[12:-1]))
        sq_u = [float(num) ** 2 for num in u]
        sum_u = sum(sq_u)
        sorted_list_u = []
        for f in sq_u:
            sorted_list_u.append(f / sum_u)
        indexes = [q for q in range(1, len(sorted_list_u) + 1)]
        result = {index: round(value, 4) for index, value in zip(indexes, sorted_list_u)}
        sorted_result_desc = dict(sorted(result.items(), key=lambda item: item[1], reverse=True))
        vadim_file = open("./Vadimka.json", 'w')
        json.dump(sorted_result_desc, vadim_file, indent=4)
        # for k, v in sorted_result_desc.items():
        #     vadim_file.write(f"{k}: {v}\n")
        vadim_file.close()
        shutil.copy("./Vadimka.json", f"./data/Vadimka/{file_name}_calc.json")
        shutil.copy("./report.txt", f"./data/f90_calcs/{file_name}_report.txt")
        max_eig_val = open(f"./Maximal_Eigen_Value.txt", 'r').read()

        mev_list.append(f"{file_name}' = {max_eig_val}")

        rep = open(f"./data/f90_calcs/{file_name}_report.txt", 'a')
        rep.write(f"Max_Eigen_Value for '{file_name}' = {max_eig_val}")
        rep.close()
    mev_list_file = open("./mev_list.txt", 'w')
    mev_list = sorted(mev_list)
    for i in mev_list:
        mev_list_file.write(i)


if __name__ == "__main__":
    excel_to_txt_converter_question = input("Преобразуем таблицы в текстовики? ")
    if (excel_to_txt_converter_question == "да" or excel_to_txt_converter_question == "da" or
            excel_to_txt_converter_question == "lf" or excel_to_txt_converter_question == "yes"):
        excel_to_txt()
        matrix_calc_question = input("Считаем матрицы? ")
    elif (excel_to_txt_converter_question == "no" or excel_to_txt_converter_question == "нет" or
          excel_to_txt_converter_question == "net" or excel_to_txt_converter_question == "ytn"):
        matrix_calc_question = input("Считаем матрицы? ")
        if (matrix_calc_question == "да" or matrix_calc_question == "da" or matrix_calc_question == "lf" or
                matrix_calc_question == "yes"):
            instantly_cal()
        elif (matrix_calc_question == "no" or matrix_calc_question == "нет" or matrix_calc_question == "net" or
              matrix_calc_question == "ytn"):
            print("Ладно! ")
        else:
            print("Вы ввели что-то не то! ")
    else:
        print("Ладно! ")
