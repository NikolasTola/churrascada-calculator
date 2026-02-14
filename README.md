# KPI de Avaliação de Kits de Churrasco

## Visão Geral

Este KPI foi desenvolvido para avaliar de forma quantitativa a qualidade global de um evento com base em quatro dimensões fundamentais:

- Proporção do mix de carnes
- Qualidade dos itens selecionados
- Quantidade total disponível
- Controle de custo

O objetivo é transformar múltiplas variáveis operacionais em um único score final padronizado de **0 a 100**, permitindo:

- Comparação entre eventos
- Avaliação de desempenho
- Identificação de pontos de melhoria
- Suporte à tomada de decisão

### O que o sistema avalia:

- Adequação da quantidade total ao consumo ideal
- Equilíbrio do mix de carnes
- Eficiência financeira em relação ao custo ideal
- Nível qualitativo da composição

### O que o sistema não avalia:
- Bebidas
- Acompanhamentos
- Desperdício real
- Perfil específico de público
- Variação regional de consumo
- Custos indiretos

OBS.: O sistema opera integralmente em **gramas** para cálculos de quantidade.

### Premissas

- Todas as quantidades são informadas em gramas
- Os valores informados são considerados corretos
- As proporções ideais somam exatamente 1
- Os pesos dos índices somam exatamente 1

## Inputs

O cálculo do KPI depende dos seguintes dados de entrada:

- Peso (em gramas) disponível de cada item do mix:
    - Boi
    - Frango
    - Porco
    - Linguiça
    - Pão de alho

- Quantidade de pessoas: Número total de participantes do evento.
- Tipo do evento: Define o parâmetro de referência para consumo ideal por pessoa.
    - Churrascada
    - Almoço
- Custo total: Valor total gasto com as carnes + pão de alho.

### Regras de Validação de Inputs

- Número de pessoas > 0
- Todos os pesos >= 0
- Custo total >= 0
- Soma das proporções ideais = 1
- Soma dos pesos dos índices = 1
- Tipos informados pertencem a TIPOS_CARNES
- Rigor > 0

Falhas nessas regras geram exceção explícita.

## Constantes 

Esta seção descreve as constantes estruturais utilizadas no modelo de avaliação do evento.  

### 1. CONSUMO_IDEAL_POR_PESSOA

```python
CONSUMO_IDEAL_POR_PESSOA = {
    "churrascada": 500,
    "almoco": 350
}
```
Define o consumo total ideal de carnes por pessoa, em gramas, de acordo com o tipo de evento.

### Utilização:
- Cálculo do peso total ideal dependendo do tipo de evento.
- Índice de Quantidade

### Objetivo:
Estabelecer a meta global de quantidade a ser comparada com o peso total informado.

### 2. PROPORCAO_IDEAL_CARNES

```python
PROPORCAO_IDEAL_CARNES = {
    "boi": 0.418,
    "frango": 0.121,
    "porco": 0.194,
    "linguica": 0.184,
    "pao_de_alho": 0.082
}
```
Define a distribuição percentual ideal entre os tipos de carne.

### Requisitos
- A soma das proporções deve ser igual a 1.

### Utilização:
- Cálculo do peso ideal por tipo de carne.
- Base para cálculo do índice de proporção.
- Índice de Proporção

### Objetivo:
Estabelecer a meta global de quantidade a ser comparada com o peso total informado.

### 3. TIPOS_CARNES

```python
TIPOS_CARNES = ["boi", "frango", "porco", "linguica", "pao_de_alho"]

```
Lista dos tipos de carne aceitos pelo sistema

### Utilização:
- Validação de inputs
- Iterações padronizadas
- Garantia de consistência estrutural entre dicionários

### Objetivo:
Evitar inputs inválidos.

### 4. CUSTO_IDEAL_POR_PESSOA

```python
CUSTO_IDEAL_POR_PESSOA = 29.16
```
Define o custo ideal por pessoa.

### Utilização:
- Cálculo do custo atual por pessoa
- Base para o índice de custo
- Índice de Custo

### Objetivo:
Ser a base para calcular o índice de custo.

### 5. PESOS_QUALIDADE

```python
PESOS_QUALIDADE = {
    "boi": 2,
    "frango": 1.1,
    "porco": 1.5,
    "linguica": 1.3,
    "pao_de_alho": 1.3
}
```
Define o peso qualitativo relativo de cada tipo de carne.

### Utilização:
- Cálculo do índice de qualidade.
- Índice de Qualidade

### Objetivo:
Definir o impacto de cada tipo de carne no índice de qualidade.

### 6. PESOS_INDICES

```python
PESOS_índiceS = {
    "proporcao": 0.3,
    "quantidade": 0.25,
    "custo": 0.25,
    "qualidade": 0.2
}
```
Define o peso de cada índice parcial na composição do índice final.

### Requisitos
- A soma dos pesos deve ser igual a 1.
- Índice Final

### Utilização:
- Cálculo do índice final ponderado.

### Objetivo:
Determinar a relevância de cada índice no índice final

### 7. RIGOR_INDICE_QUANTIDADE

```pyrhon
RIGOR_INDICE_QUANTIDADE = 2
```

### Utilização:
- Cálculo do índice de quantidade.
- Índice de Quantidade

### Objetivo:
Definir quão penalizado o indice de quantidade será caso passe da quantidade ideal.

## Índices
O sistema calcula quatro índices parciais:

- Índice de Proporção
- Índice de Quantidade
- Índice de Custo
- Índice de Qualidade

Esses índices são posteriormente agregados em uma nota final ponderada que foi chamado de indice final.

---

### 1. Índice de Proporção:
Peso no índice final: 0.3

### Objetivo
Avaliar se a distribuição entre os tipos de carne está alinhada com a proporção ideal definida.

### Fórmulas:

Índice individual para cada tipo de carne:

--

Explicação: Mede o quão próximo o peso atual está do peso ideal para cada tipo. 

### Incógnitas


--

### Índice Geral de Proporção:

--

### Incógnitas

--

### Justificativa

- Penaliza excesso e falta igualmente
- Normaliza naturalmente entre 0 e 1
- Evita distorções por escala

### Comportamento

- Valor máximo: 1 (quando atual = ideal)
- Penaliza tanto excesso quanto falta
- Sempre varia entre 0 e 1

---

### 2. Índice de Quantidade

### Objetivo

Avaliar o desvio do peso total informado em relação ao peso total ideal.

### Definição do Erro Relativo

--

### Incógnitas

--

Explicação: Calcula o desvio percentual entre o peso real e o ideal.

### Fórmula do Índice de Quantidade

--

### Incógnitas

--

Explicação: Aplica um decaimento exponencial ao erro relativo. O índice tende a zero sem nunca atingi-lo.

### Justificativa

- Penalização contínua e suave
- Nunca atinge zero
- Penalização progressivamente mais severa
- Permite calibragem via parâmetro 𝑘


### Comportamento

- Valor máximo: 1 (quando atual = ideal)
- Penaliza excesso e falta
- Decaimento exponencial
- Tende a 0
- Quanto maior o \( RIGOR_INDICE_QUANTIDADE \), mais rigoroso o modelo

---

### 3. Índice de Custo

### Objetivo

Avaliar se o custo por pessoa está dentro do valor ideal.

### Cálculo do Custo Atual por Pessoa

--

### Fórmula do Índice de Custo

--

### Incógnitas

--

Explicação: Penaliza apenas quando o custo real ultrapassa o ideal e não faz nada caso o custo esteja abaixo.

### Justificativa

- Penaliza apenas estouro de orçamento
- Não penaliza economia
- Mantém coerência com objetivo financeiro

### Comportamento

- Penaliza apenas quando o custo ultrapassa o ideal
- Não penaliza economia
- Intervalo: 0 e 1

---

### 4. Índice de Qualidade

### Objetivo
Avaliar a qualidade relativa dos tipos de carnes com pesos qualitativos atribuídos a cada tipo de carne.


### Soma Ponderada Atual

--

### Incógnitas

--

Explicação: Calcula a qualidade total ponderada da composição do evento.

### Soma Ponderada Ideal Máxima

--

### Incógnitas

--

Explicação: Define o valor máximo teórico de qualidade possível.

### Fórmula do Índice de Qualidade

--

### Incógnitas

--

Explicação: Normaliza a qualidade atual para um valor entre 0 e 1.

### Justificativa

- Mede eficiência qualitativa relativa
- Independente da quantidade total
- Normalizado entre 0 e 1

### Comportamento

- Quanto maior a concentração em carnes de maior peso qualitativo, maior o índice
- Intervalo: 0 e 1

---

### 5. Índice Final

### Objetivo
Combinar os quatro índices parciais em uma nota única ponderada.

### Fórmula do Índice Final

--

### Incógnitas

--

Explicação: Combina todos os índices parciais em uma nota única ponderada.

OBS.: O índice final é multiplicado por 100 para fornecer uma nota final.

### Comportamento

- Todos os índices são normalizados entre 0 e 1.
- O sistema opera integralmente em gramas.
- A consistência matemática garante comparabilidade entre eventos distintos.

## Classificação do Índice Final

| Intervalo da Nota Final | Classificação |
|-------------------------|--------------|
| 90 ≤ Índice final ≤ 100  | Muito bom    |
| 75 ≤ Índice final < 90   | Bom          |
| 65 ≤ Índice final < 75   | Médio        |
| 50 ≤ Índice final < 65   | Ruim         |
| Índice final < 50        | Muito ruim   |

OBS.: Essa regra também vale para o índice parcial de proporção de cada tipo de carne.
