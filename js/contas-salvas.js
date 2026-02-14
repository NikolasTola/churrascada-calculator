document.addEventListener('DOMContentLoaded', function() {
    carregarContas();
    
    // Fecha modal de visualização
    document.getElementById('closeViewModal').addEventListener('click', function() {
        document.getElementById('viewModal').classList.add('hidden');
    });
    
    document.getElementById('viewModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
    
    // Botões do modal de exclusão
    document.getElementById('btnCancelDelete').addEventListener('click', function() {
        document.getElementById('deleteModal').classList.add('hidden');
    });
    
    document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});

function carregarContas() {
    const listaContas = document.getElementById('listaContas');
    let contasSalvas = localStorage.getItem('contas_salvas');
    contasSalvas = contasSalvas ? JSON.parse(contasSalvas) : {};
    
    const nomes = Object.keys(contasSalvas);
    
    if (nomes.length === 0) {
        listaContas.innerHTML = '<div class="empty-message">Nenhuma conta salva</div>';
        return;
    }
    
    listaContas.innerHTML = '';
    
    nomes.forEach(nome => {
        const conta = contasSalvas[nome];
        const item = document.createElement('div');
        item.className = 'conta-item';
        
        const dataFormatada = formatarData(conta.data_salvamento);
        const indiceFinal = conta.indices.nota_final;
        
        item.innerHTML = `
            <div class="conta-info">
                <div class="conta-nome">${nome}</div>
                <div class="conta-detalhes">
                    <span class="conta-data">${dataFormatada}</span>
                    <span class="conta-separador">•</span>
                    <span class="conta-indice">Nota: ${indiceFinal}</span>
                </div>
            </div>
            <button class="btn-delete-icon" data-nome="${nome}">🗑️</button>
        `;
        
        // Clique no item para visualizar
        item.querySelector('.conta-info').addEventListener('click', function() {
            exibirConta(nome, conta);
        });
        
        // Clique no botão de deletar
        item.querySelector('.btn-delete-icon').addEventListener('click', function(e) {
            e.stopPropagation();
            confirmarExclusao(nome);
        });
        
        listaContas.appendChild(item);
    });
}

function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
}

function exibirConta(nome, conta) {
    const modalBody = document.getElementById('viewModalBody');
    const modalTitle = document.getElementById('viewModal').querySelector('.modal-header h2');
    
    // Atualiza o título com o nome da conta
    modalTitle.textContent = nome;
    
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
                <span class="result-value">${conta.entradas.boi}g</span>
            </div>
            <div class="result-item">
                <span class="result-label">Porco:</span>
                <span class="result-value">${conta.entradas.porco}g</span>
            </div>
            <div class="result-item">
                <span class="result-label">Frango:</span>
                <span class="result-value">${conta.entradas.frango}g</span>
            </div>
            <div class="result-item">
                <span class="result-label">Linguiça:</span>
                <span class="result-value">${conta.entradas.linguica}g</span>
            </div>
            <div class="result-item">
                <span class="result-label">Pão de alho:</span>
                <span class="result-value">${conta.entradas.pao_de_alho}g</span>
            </div>
            <div class="result-item">
                <span class="result-label">Número de pessoas:</span>
                <span class="result-value">${conta.qtd_pessoas}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Tipo do evento:</span>
                <span class="result-value">${tipoEventoNome[conta.tipo_evento]}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo total:</span>
                <span class="result-value">R$ ${conta.custo_total.toFixed(2)}</span>
            </div>
        </div>
    
        <div class="result-section">
            <h3>Índice de Proporção</h3>
    `;
    
    for (const tipo of TIPOS_CARNES) {
        html += `
            <div class="result-item">
                <span class="result-label">${nomesCarne[tipo]}:</span>
                <span class="result-value">${conta.indices.proporcao[tipo]}</span>
            </div>
        `;
    }
    
    html += `
            <div class="result-item">
                <span class="result-label"><strong>Média:</strong></span>
                <span class="result-value"><strong>${conta.indices.proporcao.indice_final}</strong></span>
            </div>
        </div>
        
        <div class="result-section">
            <h3>Outros Índices</h3>
            <div class="result-item">
                <span class="result-label">Índice de Qualidade:</span>
                <span class="result-value">${conta.indices.qualidade}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Índice de Quantidade:</span>
                <span class="result-value">${conta.indices.quantidade}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Índice de Custo:</span>
                <span class="result-value">${conta.indices.custo}</span>
            </div>
        </div>
        
        <div class="result-final">
            <h3>Índice Final</h3>
            <div class="final-score">${conta.indices.nota_final}</div>
        </div>
        
        <button class="btn-exportar-conta" id="btnExportarConta">Exportar Dados</button>
        <div class="export-success-message hidden" id="exportSuccessMessage">Dados exportados com sucesso</div>
    `;
    
    modalBody.innerHTML = html;
    document.getElementById('viewModal').classList.remove('hidden');
    
    // Adiciona evento ao botão exportar
    document.getElementById('btnExportarConta').addEventListener('click', function() {
        exportarDados(nome);
    });
}

function confirmarExclusao(nome) {
    document.getElementById('deleteMessage').textContent = `Deseja mesmo deletar a conta "${nome}"?`;
    document.getElementById('deleteModal').classList.remove('hidden');
    
    // Remove listeners antigos e adiciona novo
    const btnConfirm = document.getElementById('btnConfirmDelete');
    const novoBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(novoBtn, btnConfirm);
    
    novoBtn.addEventListener('click', function() {
        excluirConta(nome);
    });
}

function excluirConta(nome) {
    let contasSalvas = localStorage.getItem('contas_salvas');
    contasSalvas = contasSalvas ? JSON.parse(contasSalvas) : {};
    
    delete contasSalvas[nome];
    
    localStorage.setItem('contas_salvas', JSON.stringify(contasSalvas));
    
    document.getElementById('deleteModal').classList.add('hidden');
    
    carregarContas();
}

async function exportarDados(nomeConta) {
    const btnExportar = document.getElementById('btnExportarConta');
    const successMessage = document.getElementById('exportSuccessMessage');
    const modalContent = document.getElementById('viewModal').querySelector('.modal-content');
    
    // Esconde o botão e mensagem temporariamente
    btnExportar.style.display = 'none';
    successMessage.classList.add('hidden');
    
    // Salva os estilos originais
    const originalMaxHeight = modalContent.style.maxHeight;
    const originalOverflow = modalContent.style.overflow;
    
    // Remove limitações de altura e scroll para capturar tudo
    modalContent.style.maxHeight = 'none';
    modalContent.style.overflow = 'visible';
    
    try {
        // Aguarda um momento para o DOM atualizar
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Captura o conteúdo completo do modal
        const canvas = await html2canvas(modalContent, {
            backgroundColor: '#ffffff',
            scale: 2, // Melhor qualidade
            logging: false,
            useCORS: true,
            windowHeight: modalContent.scrollHeight,
            height: modalContent.scrollHeight
        });
        
        // Restaura os estilos originais
        modalContent.style.maxHeight = originalMaxHeight;
        modalContent.style.overflow = originalOverflow;
        
        // Converte para blob e faz download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${nomeConta.replace(/[^a-z0-9]/gi, '_')}_churrascada.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
        
        // Mostra mensagem de sucesso
        successMessage.classList.remove('hidden');
        
    } catch (error) {
        console.error('Erro ao exportar:', error);
        
        // Restaura os estilos originais em caso de erro
        modalContent.style.maxHeight = originalMaxHeight;
        modalContent.style.overflow = originalOverflow;
        
        btnExportar.style.display = 'block';
        alert('Erro ao exportar os dados. Tente novamente.');
    }
}