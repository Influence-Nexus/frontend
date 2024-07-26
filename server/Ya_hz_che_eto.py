import json


def calculate_score_tablica(report):   
    x = []
    u = []
    for i in report.readlines():
        if len(i) <= 23:
            x.append(float(i[1:10]))
            u.append(float(i[12:-1]))
    normilized_x = [float(num) ** 2 for num in x]
    sq_u = [float(num) ** 2 for num in u]
    u_summed = sum(sq_u)
    normilized_u = []
    for i in sq_u:
        normilized_u.append(i / u_summed)
    return x, u, normilized_x, normilized_u


def calculate_score_vadimka(report):
    u = []
    for i in report.readlines():
        if len(i) <= 23:
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
    vadim_file.close()
    return sorted_result_desc

if __name__ == '__main__':
    matrix = input('Введите имя матрицы: ')
    rep = open(f"./data/f90_calcs/{matrix}_report.txt", 'r')
    calculate_score_vadimka(rep)
    calculate_score_tablica(rep)
    