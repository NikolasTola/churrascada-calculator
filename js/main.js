document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('churrascadaForm');
    const errorMessage = document.getElementById('errorMessage');
    
    const floatInputs = ['boi', 'porco', 'frango', 'linguica', 'paoAlho', 'custoTotal'];
    const intInputs = ['numeroPessoas'];
    
    floatInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            validateNumericInput(this, true);
        });
    });
    
    intInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            validateNumericInput(this, false);
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Remove mensagem de erro e classes de erro anteriores
        errorMessage.classList.add('hidden');
        
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
        
        let hasError = false;
        
        // Valida inputs float
        floatInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (!isValidNumber(input.value, true)) {
                input.classList.add('error');
                hasError = true;
            }
        });
        
        // Valida inputs int
        intInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (!isValidNumber(input.value, false)) {
                input.classList.add('error');
                hasError = true;
            }
        });
        
        // Valida select
        const tipoEvento = document.getElementById('tipoEvento');
        if (!tipoEvento.value || tipoEvento.value === '') {
            tipoEvento.classList.add('error');
            hasError = true;
        }
        
        // Se houver erro, mostra mensagem
        if (hasError) {
            errorMessage.classList.remove('hidden');
            
            // Remove erro após 3 segundos
            setTimeout(() => {
                errorMessage.classList.add('hidden');
                const inputs = form.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.classList.remove('error');
                });
            }, 3000);
            
            return;
        }
        
        // Coleta os dados do formulário
        const dados = {
            boi: parseFloat(document.getElementById('boi').value.replace(',', '.')),
            porco: parseFloat(document.getElementById('porco').value.replace(',', '.')),
            frango: parseFloat(document.getElementById('frango').value.replace(',', '.')),
            linguica: parseFloat(document.getElementById('linguica').value.replace(',', '.')),
            pao_de_alho: parseFloat(document.getElementById('paoAlho').value.replace(',', '.')),
            numeroPessoas: parseInt(document.getElementById('numeroPessoas').value),
            tipoEvento: document.getElementById('tipoEvento').value,
            custoTotal: parseFloat(document.getElementById('custoTotal').value.replace(',', '.'))
        };
        
        // Calcula os resultados
        calcularResultados(dados);
    });

    // Função para fechar o modal
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('resultModal').classList.add('hidden');
    });

    // Fecha o modal clicando fora dele
    document.getElementById('resultModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });

    function calcularResultados(dados) {
        // Calcula peso total atual
        const pesoTotalAtual = (dados.boi + dados.porco + dados.frango + dados.linguica + dados.pao_de_alho);
        
        // Calcula peso total ideal
        const consumoIdeal = CONSUMO_IDEAL_POR_PESSOA[dados.tipoEvento];
        const pesoTotalIdeal = (consumoIdeal * dados.numeroPessoas);// Converte gramas para kg
        
        // Calcula pesos ideais individuais
        const pesosIdeais = {};
        for (const tipo of TIPOS_CARNES) {
            pesosIdeais[tipo] = pesoTotalIdeal * PROPORCAO_IDEAL_CARNES[tipo];
        }
        
        // Coleta pesos atuais
        const pesosAtuais = {
            boi: dados.boi,
            frango: dados.frango,
            porco: dados.porco,
            linguica: dados.linguica,
            pao_de_alho: dados.pao_de_alho
        };
        
        // Calcula índices
        const resultProporcao = indiceProporcao(pesosIdeais, pesosAtuais);
        const resultQualidade = indiceQualidade(pesosAtuais);
        const resultQuantidade = indiceQuantidade(pesoTotalAtual, pesoTotalIdeal);
        const resultCusto = indiceCusto(dados.custoTotal, dados.numeroPessoas);
        const resultFinal = indiceFinal(
            resultProporcao.indice_final,
            resultQualidade,
            resultQuantidade,
            resultCusto
        );

        
    
        // Prepara dados para salvar
        dadosAtuaisParaSalvar = {
            entradas: {
                boi: dados.boi,
                porco: dados.porco,
                frango: dados.frango,
                linguica: dados.linguica,
                pao_de_alho: dados.pao_de_alho
            },
            peso_total: pesoTotalAtual,
            qtd_pessoas: dados.numeroPessoas,
            tipo_evento: dados.tipoEvento,
            custo_total: dados.custoTotal,
            indices: {
                proporcao: resultProporcao,
                qualidade: resultQualidade,
                custo: resultCusto,
                quantidade: resultQuantidade,
                nota_final: resultFinal
            }
        };
        
        // Exibe o modal com os resultados
        exibirResultados(resultProporcao, resultQualidade, resultQuantidade, resultCusto, resultFinal, dados);

    }

    function exibirResultados(proporcao, qualidade, quantidade, custo, final, dados) {
        const modalBody = document.getElementById('modalBody');
        
        const nomesCarne = {
            boi: 'Boi',
            frango: 'Frango',
            porco: 'Porco',
            linguica: 'Linguiça',
            pao_de_alho: 'Pão de alho'
        };
        
        const tipoEventoNome = {
            'churrascada': 'Churrascada',
            'almoco': 'Almoço'
        };
        
        let html = `
            <div class="result-section">
                <h3>Dados Informados</h3>
                <div class="result-item">
                    <span class="result-label">Boi:</span>
                    <span class="result-value">${dados.boi}g</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Porco:</span>
                    <span class="result-value">${dados.porco}g</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Frango:</span>
                    <span class="result-value">${dados.frango}g</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Linguiça:</span>
                    <span class="result-value">${dados.linguica}g</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Pão de alho:</span>
                    <span class="result-value">${dados.pao_de_alho}g</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Número de pessoas:</span>
                    <span class="result-value">${dados.numeroPessoas}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tipo do evento:</span>
                    <span class="result-value">${tipoEventoNome[dados.tipoEvento]}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Custo total:</span>
                    <span class="result-value">R$ ${dados.custoTotal.toFixed(2)}</span>
                </div>
            </div>
        
            <div class="result-section">
                <h3>Índice de Proporção</h3>
        `;
        
        for (const tipo of TIPOS_CARNES) {
            html += `
                <div class="result-item">
                    <span class="result-label">${nomesCarne[tipo]}:</span>
                    <span class="result-value">${proporcao[tipo]}</span>
                </div>
            `;
        }
        
        html += `
                <div class="result-item">
                    <span class="result-label"><strong>Média:</strong></span>
                    <span class="result-value"><strong>${proporcao.indice_final}</strong></span>
                </div>
            </div>
            
            <div class="result-section">
                <h3>Outros Índices</h3>
                <div class="result-item">
                    <span class="result-label">Índice de Qualidade:</span>
                    <span class="result-value">${qualidade}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Índice de Quantidade:</span>
                    <span class="result-value">${quantidade}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Índice de Custo:</span>
                    <span class="result-value">${custo}</span>
                </div>
            </div>
            
            <div class="result-final">
                <h3>Índice Final</h3>
                <div class="final-score">${final}</div>
            </div>

            <button class="btn-salvar-conta" id="btnSalvarConta">Salvar Conta</button>
        `;
        
        modalBody.innerHTML = html;
        document.getElementById('resultModal').classList.remove('hidden');

        document.getElementById('btnSalvarConta').addEventListener('click', function() {
            abrirModalSalvar();
        });
    }

    // Variável global para armazenar os dados atuais
    let dadosAtuaisParaSalvar = null;

    function abrirModalSalvar() {
        document.getElementById('nomeConta').value = '';
        document.getElementById('nomeConta').classList.remove('error');
        document.getElementById('saveErrorMessage').classList.add('hidden');
        document.getElementById('saveModal').classList.remove('hidden');
    }

    // Botão cancelar do modal de salvar
    document.getElementById('btnCancelSave').addEventListener('click', function() {
        document.getElementById('saveModal').classList.add('hidden');
    });

    // Fechar modal clicando fora
    document.getElementById('saveModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });

    // Botão confirmar salvar
    document.getElementById('btnConfirmSave').addEventListener('click', function() {
        const nomeConta = document.getElementById('nomeConta').value.trim();
        const inputNome = document.getElementById('nomeConta');
        const errorMessage = document.getElementById('saveErrorMessage');
        
        // Remove erros anteriores
        inputNome.classList.remove('error');
        errorMessage.classList.add('hidden');
        
        // Valida se está vazio
        if (!nomeConta) {
            inputNome.classList.add('error');
            errorMessage.textContent = 'Preencha o input corretamente';
            errorMessage.classList.remove('hidden');
            return;
        }
        
        // Verifica se já existe uma conta com esse nome
        let contasSalvas = localStorage.getItem('contas_salvas');
        contasSalvas = contasSalvas ? JSON.parse(contasSalvas) : {};
        
        if (contasSalvas[nomeConta]) {
            inputNome.classList.add('error');
            errorMessage.textContent = 'Já existe uma conta com esse nome';
            errorMessage.classList.remove('hidden');

            setTimeout(() => {
                inputNome.classList.remove('error');
                errorMessage.classList.add('hidden');
            }, 3000);

            return;
        }
        
        salvarConta(nomeConta);
    });

    // Remove erro ao digitar
    document.getElementById('nomeConta').addEventListener('input', function() {
        this.classList.remove('error');
        document.getElementById('saveErrorMessage').classList.add('hidden');
    });

    function salvarConta(nomeConta) {
        if (!dadosAtuaisParaSalvar) return;
        
        // Recupera contas salvas do localStorage
        let contasSalvas = localStorage.getItem('contas_salvas');
        contasSalvas = contasSalvas ? JSON.parse(contasSalvas) : {};
        
        const agora = new Date();
        agora.setHours(agora.getHours());
        const dataHora = agora.toISOString();
        
        // Adiciona a nova conta com data
        contasSalvas[nomeConta] = {
            ...dadosAtuaisParaSalvar,
            data_salvamento: dataHora
        };
        
        // Salva no localStorage
        localStorage.setItem('contas_salvas', JSON.stringify(contasSalvas));
        
        // Fecha o modal de salvar
        document.getElementById('saveModal').classList.add('hidden');
        
        // Fecha o modal de resultados
        document.getElementById('resultModal').classList.add('hidden');
        
        // Reseta o formulário
        document.getElementById('churrascadaForm').reset();
        
        // Mostra toast de sucesso
        mostrarToastSucesso();
    }

    function mostrarToastSucesso() {
        const toast = document.getElementById('successToast');
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 400);
        }, 3000);
    }
});