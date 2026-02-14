import math

from configs import (
    CUSTO_IDEAL_POR_PESSOA,
    PESOS_INDICES,
    PESOS_QUALIDADE,
    RIGOR_INDICE_QUANTIDADE,
    TIPOS_CARNES,
)


def indice_proporcao(dict_pesos_ideal: dict, dict_pesos_atual: dict) -> dict:
    """
    Calcula o índice de proporção das carnes comparando os pesos atuais
    com os pesos ideais definidos para cada tipo.

    Para cada tipo de carne, o índice individual é calculado como:

        indice = min(peso_atual, peso_ideal) / max(peso_atual, peso_ideal)

    Regras:
    - O índice varia de 0 a 1.
    - Retorna 1 quando o peso atual é igual ao ideal.
    - Retorna 0 quando o peso atual é 0 e o ideal é maior que 0.
    - Penaliza proporcionalmente tanto excesso quanto falta.
    - Se peso_ideal for 0, o índice será 0.

    O índice_final é a média aritmética simples dos índices individuais.

    Parâmetros:
        dict_pesos_ideal (dict): Dicionário com os pesos ideais por tipo de carne.
        dict_pesos_atual (dict): Dicionário com os pesos atuais por tipo de carne.

    Retorno:
        dict: Dicionário contendo:
            - O índice individual de cada tipo de carne.
            - A chave "indice_final" com a média dos índices individuais.
    """
    if not all(chave in dict_pesos_ideal for chave in TIPOS_CARNES):
        raise ValueError(
            "O dicionario dict_pesos_ideal não tem todas as chaves necessárias"
        )

    if not all(chave in dict_pesos_atual for chave in TIPOS_CARNES):
        raise ValueError(
            "O dicionario dict_pesos_atual não tem todas as chaves necessárias"
        )

    if any(item not in TIPOS_CARNES for item in dict_pesos_ideal):
        print("Existem itens inválidos no dicionário: dict_pesos_ideal")

    if any(item not in TIPOS_CARNES for item in dict_pesos_atual):
        print("Existem itens inválidos no dicionário: dict_pesos_atual")

    dict_final = {}
    indice_final = 0

    for tipo_carne, peso in dict_pesos_ideal.items():
        indice_atual = 0

        peso_atual = dict_pesos_atual[tipo_carne]
        peso_ideal = peso

        if peso_ideal > 0:
            indice_atual = (
                min(peso_atual, peso_ideal) / max(peso_atual, peso_ideal)
                if max(peso_atual, peso_ideal) > 0
                else 0
            )
        else:
            indice_atual = 0

        dict_final[tipo_carne] = round(indice_atual, 3)

        indice_final += indice_atual

    dict_final["indice_final"] = round(indice_final / len(TIPOS_CARNES), 3)

    return dict_final


def indice_qualidade(dict_pesos_atual: dict) -> float:
    """
    Calcula o índice de qualidade do mix de carnes com base em pesos
    qualitativos atribuídos a cada tipo.

    O índice é calculado como uma média ponderada onde:
        - Cada tipo de carne possui um peso de qualidade predefinido.
        - A quantidade atual de cada carne influencia proporcionalmente o resultado.

    Fórmula:
        indice = (Σ(peso_atual x peso_qualidade)) / Σ(peso_atual)

    O valor retornado é normalizado subtraindo 1 do resultado,
    produzindo um índice que varia aproximadamente entre 0 e 1:

        - 0 → mix composto apenas por carnes de menor qualidade.
        - 1 → mix composto apenas por carnes de maior qualidade.
        - Valores intermediários representam composições mistas.

    Parâmetros:
        dict_pesos_atual (dict): Dicionário contendo os pesos atuais
        de cada tipo de carne.

    Retorno:
        float: Índice de qualidade arredondado para duas casas decimais.
    """
    if not all(chave in dict_pesos_atual for chave in TIPOS_CARNES):
        raise ValueError(
            "O dicionario dict_peso_atual não tem todas as chaves necessárias"
        )

    if any(item not in TIPOS_CARNES for item in dict_pesos_atual):
        print("Existem itens inválidos no dicionário: dict_pesos_atual")

    peso_total_carnes = 0
    indice_individual = 0

    for key, value in dict_pesos_atual.items():
        peso_total_carnes += value

        indice_individual += dict_pesos_atual[key] * PESOS_QUALIDADE[key]

    if peso_total_carnes == 0:
        return 0

    indice_individual = indice_individual / peso_total_carnes

    return round(indice_individual - 1, 3)


def indice_custo(custo_total: float, qtd_pessoas: int) -> float:
    """
    Calcula o índice de custo com base no custo total do evento e na quantidade de pessoas.

    O índice é determinado pela razão entre o custo ideal por pessoa (29.16)
    e o custo atual por pessoa. Caso o custo atual seja igual ou inferior ao
    custo ideal, o índice será 1. Caso seja superior, o índice será
    proporcionalmente reduzido.

    Fórmula:
        indice = min(1, CUSTO_IDEAL / (custo_total / qtd_pessoas))

    Parâmetros:
        custo_total (float): Valor total gasto no evento.
        qtd_pessoas (int): Quantidade total de participantes.

    Retorno:
        float: Índice de custo arredondado para duas casas decimais,
               variando entre 0 e 1.
    """
    if qtd_pessoas <= 0:
        raise ValueError("A quantidade de pessoas não pode ser menor ou igual a 0")

    if custo_total <= 0:
        raise ValueError("O custo total não pode ser menor ou igual a 0")

    custo_atual_por_pessoa = custo_total / qtd_pessoas

    indice_custo = min(1, CUSTO_IDEAL_POR_PESSOA / custo_atual_por_pessoa)

    return round(indice_custo, 3)


def indice_quantidade(peso_total_atual: float, peso_total_ideal: float) -> float:
    """
    Calcula o índice de quantidade com base na relação entre o peso total atual
    e o peso total ideal planejado.

    O índice representa o nível de atingimento da quantidade ideal.
    Caso o peso atual seja igual ou superior ao ideal, o índice será 1.
    Caso seja inferior, o índice será proporcional à razão entre os valores.

    Fórmula:
        indice = min(1, peso_total_atual / peso_total_ideal)

    Parâmetros:
        peso_total_atual (float): Peso total disponível no evento.
        peso_total_ideal (float): Peso total planejado como ideal.

    Retorno:
        float: Índice de quantidade arredondado para duas casas decimais,
               variando entre 0 e 1.
    """

    if peso_total_atual < 0:
        raise ValueError("O peso total atual não pode ser menor ou igual a 0")

    if peso_total_ideal <= 0:
        raise ValueError("O peso total ideal não pode ser menor ou igual a 0")

    if peso_total_atual == 0:
        return 0

    erro_relativo = abs(peso_total_atual - peso_total_ideal) / peso_total_ideal
    
    indice = math.exp(-RIGOR_INDICE_QUANTIDADE * erro_relativo)

    return round(indice, 3)


def indice_final(
    indice_proporcao: float,
    indice_qualidade: float,
    indice_quantidade: float,
    indice_custo: float,
) -> float:
    """
    Calcula o índice final do evento a partir da média ponderada
    dos índices de proporção, qualidade, quantidade e custo.

    O cálculo utiliza os seguintes pesos:
        - Proporção: 30%
        - Quantidade: 25%
        - Custo: 25%
        - Qualidade: 20%

    O resultado é multiplicado por 100, representando um score percentual,
    e arredondado para número inteiro.

    Fórmula:
        indice_final = 100 * (
            0.3 * indice_proporcao +
            0.25 * indice_quantidade +
            0.25 * indice_custo +
            0.2 * indice_qualidade
        )

    Parâmetros:
        indice_proporcao (float): Índice de equilíbrio do mix de carnes.
        indice_qualidade (float): Índice de qualidade média ponderada.
        indice_quantidade (float): Índice de atingimento da quantidade ideal.
        indice_custo (float): Índice de adequação ao custo ideal.

    Retorno:
        float: Score final do evento em escala de 0 a 100.
    """
    return round(
        100
        * (
            PESOS_INDICES["proporcao"] * indice_proporcao
            + PESOS_INDICES["quantidade"] * indice_quantidade
            + PESOS_INDICES["custo"] * indice_custo
            + PESOS_INDICES["qualidade"] * indice_qualidade
        ),
        3,
    )
