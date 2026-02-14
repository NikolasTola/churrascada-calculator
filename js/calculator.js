function indiceProporcao(dictPesosIdeal, dictPesosAtual) {
    const dictFinal = {};
    let indiceFinal = 0;

    for (const tipoCarne of TIPOS_CARNES) {
        let indiceAtual = 0;

        const pesoAtual = dictPesosAtual[tipoCarne];
        const pesoIdeal = dictPesosIdeal[tipoCarne];

        if (pesoIdeal > 0) {
            const maxPeso = Math.max(pesoAtual, pesoIdeal);
            indiceAtual = maxPeso > 0 ? Math.min(pesoAtual, pesoIdeal) / maxPeso : 0;
        } else {
            indiceAtual = 0;
        }

        dictFinal[tipoCarne] = Math.round(indiceAtual * 1000) / 1000;
        indiceFinal += indiceAtual;
    }

    dictFinal["indice_final"] = Math.round((indiceFinal / TIPOS_CARNES.length) * 1000) / 1000;

    return dictFinal;
}

function indiceQualidade(dictPesosAtual) {
    let pesoTotalCarnes = 0;
    let indiceIndividual = 0;

    for (const [key, value] of Object.entries(dictPesosAtual)) {
        pesoTotalCarnes += value;
        indiceIndividual += dictPesosAtual[key] * PESOS_QUALIDADE[key];
    }

    if (pesoTotalCarnes === 0) {
        return 0;
    }

    indiceIndividual = indiceIndividual / pesoTotalCarnes;

    return Math.round((indiceIndividual - 1) * 1000) / 1000;
}

function indiceCusto(custoTotal, qtdPessoas) {
    if (qtdPessoas <= 0) {
        throw new Error("A quantidade de pessoas não pode ser menor ou igual a 0");
    }

    if (custoTotal <= 0) {
        throw new Error("O custo total não pode ser menor ou igual a 0");
    }

    const custoAtualPorPessoa = custoTotal / qtdPessoas;
    const indiceCusto = Math.min(1, CUSTO_IDEAL_POR_PESSOA / custoAtualPorPessoa);

    return Math.round(indiceCusto * 1000) / 1000;
}

function indiceQuantidade(pesoTotalAtual, pesoTotalIdeal) {
    if (pesoTotalAtual < 0) {
        throw new Error("O peso total atual não pode ser menor que 0");
    }

    if (pesoTotalIdeal <= 0) {
        throw new Error("O peso total ideal não pode ser menor ou igual a 0");
    }

    if (pesoTotalAtual === 0) {
        return 0;
    }

    const erroRelativo = Math.abs(pesoTotalAtual - pesoTotalIdeal) / pesoTotalIdeal;
    const indice = Math.exp(-RIGOR_INDICE_QUANTIDADE * erroRelativo);

    return Math.round(indice * 1000) / 1000;
}

function indiceFinal(indiceProporcao, indiceQualidade, indiceQuantidade, indiceCusto) {
    return Math.round(
        100 * (
            PESOS_INDICES["proporcao"] * indiceProporcao +
            PESOS_INDICES["quantidade"] * indiceQuantidade +
            PESOS_INDICES["custo"] * indiceCusto +
            PESOS_INDICES["qualidade"] * indiceQualidade
        ) * 1000
    ) / 1000;
}