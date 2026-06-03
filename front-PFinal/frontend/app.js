// ============================================
// CONFIGURAÇÃO E VARIÁVEIS GLOBAIS
// ============================================

// URL base da API backend
const API_BASE_URL = 'http://localhost:3000';

// Elementos do modal de autenticação
const modalOverlay = document.getElementById('modal-overlay');        // Fundo do modal
const btnLogin = document.getElementById('btn-login');                // Botão para abrir login
const btnRegister = document.getElementById('btn-register');          // Botão para abrir registro
const modalClose = document.getElementById('modal-close');            // Botão de fechar modal
const modalTitle = document.getElementById('modal-title');            // Título do modal (Login/Cadastrar)
const fieldName = document.getElementById('field-name');              // Campo de nome (apenas em registro)
const modalSubmit = document.getElementById('modal-submit');          // Botão para enviar formulário
const modalSwitchText = document.getElementById('modal-switch-text'); // Texto para mudar entre login/registro
const modalMsg = document.getElementById('modal-msg');                // Mensagens de erro/sucesso

// Elementos de navegação do usuário logado
const userBar = document.getElementById('user-bar');                  // Barra com dados do usuário
const userNameSpan = document.getElementById('user-name');            // Nome do usuário logado
const btnLogout = document.getElementById('btn-logout');              // Botão de logout

// Botões do cabeçalho da página de login, usados na própria página de login (sem modal)
const btnLoginHeader = document.getElementById('btn-login-header');    // Alterna para aba de login
const btnRegisterHeader = document.getElementById('btn-register-header'); // Alterna para aba de cadastro

// ============================================
// FUNÇÕES DE GERENCIAMENTO DE MENSAGENS E USUÁRIO
// ============================================

/**
 * Exibe uma mensagem no modal
 * @param {string} message - Mensagem a ser exibida
 */
const showMessage = (message) => {
  if (modalMsg) {
    modalMsg.textContent = message;
  }
};

/**
 * Obtém os dados do usuário logado do localStorage
 * @returns {Object|null} Dados do usuário ou null se não houver usuário logado
 */
const getLoggedUser = () => JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

/**
 * Salva os dados do usuário logado no localStorage
 * @param {Object} user - Objeto com dados do usuário (nome, email, token)
 */
const setLoggedUser = (user) => {
  localStorage.setItem('usuarioLogado', JSON.stringify(user));
};

/**
 * Verifica se há usuário logado e atualiza a UI
 * Se houver usuário logado: mostra nome e botão de logout
 * Se não houver: mostra botões de login e registro
 */
const checkLogin = () => {
  const user = getLoggedUser();
  if (user) {
    // Esconde botões de login/registro
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnRegister) btnRegister.style.display = 'none';
    // Mostra a barra com dados do usuário logado
    if (userBar) userBar.style.display = 'flex';
    if (userNameSpan) userNameSpan.textContent = '👤 ' + user.nome;
  }
};

// ============================================
// FUNÇÕES DE INTERFACE DO MODAL
// ============================================

/**
 * Abre o modal de login ou registro
 * @param {string} type - Tipo de modal: 'login' ou 'register'
 */
const openModal = (type) => {
  // Valida se os elementos existem
  if (!modalOverlay || !modalTitle || !fieldName || !modalSubmit || !modalSwitchText) return;
  
  // Mostra o modal
  modalOverlay.style.display = 'flex';
  showMessage(''); // Limpa mensagens anteriores
  
  if (type === 'register') {
    // Configuração para modal de registro
    modalTitle.innerText = 'Cadastrar';
    fieldName.style.display = 'block';  // Mostra campo de nome
    modalSubmit.innerText = 'Cadastrar';
    modalSwitchText.innerHTML = `Já possui conta? <a onclick="openModal('login')">Entrar</a>`;
  } else {
    // Configuração para modal de login
    modalTitle.innerText = 'Entrar';
    fieldName.style.display = 'none';  // Esconde campo de nome
    modalSubmit.innerText = 'Entrar';
    modalSwitchText.innerHTML = `Não tem conta? <a onclick="openModal('register')">Cadastre-se</a>`;
  }
};

// ============================================
// FUNÇÕES DE REQUISIÇÃO À API
// ============================================

/**
 * Faz uma requisição segura à API com tratamento de erro
 * @param {string} url - URL do endpoint
 * @param {Object} options - Opções da requisição fetch
 * @returns {Promise<Object>} Dados da resposta
 * @throws {Error} Se houver erro na resposta
 */
const safeFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao conectar com o backend.');
    }
    return data;
  } catch (error) {
    const message = error.message || 'Erro desconhecido.';
    if (message.toLowerCase().includes('failed to fetch') || message.toLowerCase().includes('networkerror')) {
      throw new Error('Não foi possível conectar ao backend. Verifique se o servidor está rodando em http://localhost:3000.');
    }
    throw new Error(message);
  }
};

/**
 * Registra um novo usuário na API
 * @param {string} nome - Nome do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<Object>} Dados do usuário criado e token JWT
 */
const registerUser = async (nome, email, senha) => {
  return await safeFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha }),
  });
};

/**
 * Faz login do usuário na API
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<Object>} Dados do usuário e token JWT
 */
const loginUser = async (email, senha) => {
  return await safeFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
};

// ============================================
// EVENT LISTENERS PARA AUTENTICAÇÃO
// ============================================

// Abre modal de login ao clicar no botão
if (btnLogin) btnLogin.addEventListener('click', () => openModal('login'));

// Abre modal de registro ao clicar no botão
if (btnRegister) btnRegister.addEventListener('click', () => openModal('register'));

// Fecha o modal ao clicar no botão de fechar
if (modalClose) modalClose.addEventListener('click', () => {
  if (modalOverlay) modalOverlay.style.display = 'none';
});

// Fecha o modal ao clicar fora dele
window.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});

// Se a página atual é a página de login, alterna as abas via cabeçalho
if (btnLoginHeader) btnLoginHeader.addEventListener('click', () => switchTab('login'));
if (btnRegisterHeader) btnRegisterHeader.addEventListener('click', () => switchTab('register'));

// Realiza logout ao clicar no botão
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    // Remove dados do usuário do localStorage
    localStorage.removeItem('usuarioLogado');
    // Recarrega a página para atualizar a UI
    location.reload();
  });
}

/**
 * Processa o envio do formulário de autenticação (login ou registro)
 */
if (modalSubmit) {
  modalSubmit.addEventListener('click', async () => {
    // Obtém os inputs do formulário
    const emailInput = document.getElementById('input-email');
    const senhaInput = document.getElementById('input-password');
    const nomeInput = document.getElementById('input-name');

    // Extrai os valores e remove espaços em branco
    const email = emailInput ? emailInput.value.trim() : '';
    const senha = senhaInput ? senhaInput.value : '';

    // Verifica se é formulário de REGISTRO
    if (modalTitle && modalTitle.innerText === 'Cadastrar') {
      const nome = nomeInput ? nomeInput.value.trim() : '';
      
      // Valida se todos os campos foram preenchidos
      if (!nome || !email || !senha) {
        showMessage('Preencha todos os campos.');
        return;
      }
      
      try {
        // Chama a API para registrar o novo usuário
        const result = await registerUser(nome, email, senha);
        // Salva os dados do usuário no localStorage
        setLoggedUser({ nome: result.user.nome, email: result.user.email, token: result.token });
        // Fecha o modal
        if (modalOverlay) modalOverlay.style.display = 'none';
        // Atualiza a UI para mostrar que o usuário está logado
        checkLogin();
      } catch (error) {
        showMessage(error.message);
      }
    } else {
      // É formulário de LOGIN
      
      // Valida se email e senha foram preenchidos
      if (!email || !senha) {
        showMessage('Preencha todos os campos.');
        return;
      }
      
      try {
        // Chama a API para fazer login
        const result = await loginUser(email, senha);
        // Salva os dados do usuário no localStorage
        setLoggedUser({ nome: result.user.nome, email: result.user.email, token: result.token });
        // Fecha o modal
        if (modalOverlay) modalOverlay.style.display = 'none';
        // Atualiza a UI para mostrar que o usuário está logado
        checkLogin();
      } catch (error) {
        showMessage(error.message);
      }
    }
  });
}

// Verifica login ao carregar a página
checkLogin();

// ============================================
// FUNÇÕES DE LOGIN E REGISTRO NA PÁGINA
// ============================================

/**
 * Mostra mensagem de status em uma área da página.
 * @param {string} elementId - ID do elemento que exibirá a mensagem
 * @param {string} message - Texto da mensagem
 * @param {string} type - Tipo de mensagem ('erro' ou 'sucesso')
 */
const showPageMessage = (elementId, message, type) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.className = `msg ${type}`.trim();
};

/**
 * Alterna entre as abas de login e registro na página de login.
 * @param {string} tab - 'login' ou 'register'
 */
const switchTab = (tab) => {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  if (!formLogin || !formRegister || !tabLogin || !tabRegister) return;

  if (tab === 'register') {
    formLogin.style.display = 'none';
    formRegister.style.display = 'block';
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  } else {
    formLogin.style.display = 'block';
    formRegister.style.display = 'none';
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  }
};

/**
 * Realiza o login do usuário usando o endpoint de autenticação.
 */
const fazerLogin = async () => {
  showPageMessage('msg-login', '', '');
  const email = document.getElementById('login-email')?.value.trim() || '';
  const senha = document.getElementById('login-senha')?.value || '';
  if (!email || !senha) {
    showPageMessage('msg-login', 'Preencha e-mail e senha.', 'erro');
    return;
  }

  try {
    const result = await loginUser(email, senha);
    setLoggedUser({ nome: result.user.nome, email: result.user.email, token: result.token });
    checkLogin();
    showPageMessage('msg-login', 'Login realizado com sucesso!', 'sucesso');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    showPageMessage('msg-login', error.message || 'Erro ao fazer login.', 'erro');
  }
};

/**
 * Registra um novo usuário usando o endpoint de autenticação.
 */
const fazerCadastro = async () => {
  showPageMessage('msg-register', '', '');
  const nome = document.getElementById('reg-nome')?.value.trim() || '';
  const email = document.getElementById('reg-email')?.value.trim() || '';
  const senha = document.getElementById('reg-senha')?.value || '';
  if (!nome || !email || !senha) {
    showPageMessage('msg-register', 'Preencha todos os campos.', 'erro');
    return;
  }

  try {
    const result = await registerUser(nome, email, senha);
    setLoggedUser({ nome: result.user.nome, email: result.user.email, token: result.token });
    checkLogin();
    showPageMessage('msg-register', 'Conta criada com sucesso!', 'sucesso');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    showPageMessage('msg-register', error.message || 'Erro ao cadastrar usuário.', 'erro');
  }
};

// Expõe funções globais para o uso de onclick direto no HTML
window.switchTab = switchTab;
window.fazerLogin = fazerLogin;
window.fazerCadastro = fazerCadastro;

// ============================================
// FUNÇÕES DE CARRINHO DE COMPRAS
// ============================================

/**
 * Vincula os botões "Adicionar ao Carrinho" aos seus eventos
 * Adiciona livros ao carrinho armazenado no localStorage
 */
const bindCartButtons = () => {
  // Seleciona todos os botões de compra da página
  document.querySelectorAll('.btn-comprar').forEach((botao) => {
    botao.addEventListener('click', () => {
      // Encontra o card (container) do livro
      const card = botao.closest('.card');
      if (!card) return;

      // Extrai informações do livro do card
      const nome = card.querySelector('h3')?.innerText || '';
      const preco = card.querySelector('.preco')?.innerText || '';
      const img = card.querySelector('img');
      const imagem = img ? img.src : '';

      // Cria um objeto com os dados do livro
      const livro = { nome, preco, imagem, quantidade: 1 };
      
      // Obtém o carrinho do localStorage (ou cria um vazio)
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      
      // Verifica se o livro já existe no carrinho
      const existente = carrinho.find((item) => item.nome === nome);
      if (existente) {
        // Se já existe, incrementa a quantidade
        existente.quantidade += 1;
      } else {
        // Se não existe, adiciona o livro ao carrinho
        carrinho.push(livro);
      }

      // Salva o carrinho atualizado no localStorage
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      
      // Feedback visual: muda o texto do botão
      botao.textContent = '✓ Adicionado!';
      // Volta ao texto original após 1.5 segundos
      setTimeout(() => { botao.textContent = 'Adicionar ao Carrinho'; }, 1500);
    });
  });
};

// ============================================
// UTILITÁRIOS DO CARRINHO
// ============================================

/**
 * Retorna o carrinho atual do localStorage.
 * @returns {Array} Lista de itens do carrinho
 */
const getCart = () => JSON.parse(localStorage.getItem('carrinho')) || [];

/**
 * Salva a lista de itens do carrinho no localStorage.
 * @param {Array} carrinho - Lista de itens do carrinho
 */
const setCart = (carrinho) => localStorage.setItem('carrinho', JSON.stringify(carrinho));

/**
 * Formata número para formato de moeda BRL.
 * @param {number} value - Valor numérico a ser formatado
 * @returns {string} Valor formatado
 */
const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Converte uma string de preço em número.
 * @param {string} priceString - Texto do preço, ex: 'R$ 19,90'
 * @returns {number} Valor numérico
 */
const parsePrice = (priceString) => {
  if (!priceString) return 0;
  const numeric = priceString.replace(/[R$\s\.]/g, '').replace(',', '.');
  const value = parseFloat(numeric);
  return Number.isNaN(value) ? 0 : value;
};

/**
 * Atualiza o resumo do carrinho na página de carrinho.
 * Exibe subtotal, total e mensagem de carrinho vazio.
 * @param {Array} carrinho - Lista de itens do carrinho
 */
const atualizarResumo = (carrinho) => {
  const painelResumo = document.getElementById('painel-resumo');
  const valorSubtotal = document.getElementById('valor-subtotal');
  const valorTotal = document.getElementById('valor-total');
  const listaCarrinho = document.getElementById('lista-carrinho');
  if (!painelResumo || !valorSubtotal || !valorTotal || !listaCarrinho) return;

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = `
      <div class="carrinho-vazio">
        <div class="icon">🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione livros na página de catálogo para vê-los aqui.</p>
      </div>
    `;
    painelResumo.style.display = 'none';
    return;
  }

  painelResumo.style.display = 'block';
  const subtotal = carrinho.reduce((sum, item) => sum + parsePrice(item.preco) * item.quantidade, 0);
  valorSubtotal.textContent = formatCurrency(subtotal);
  valorTotal.textContent = formatCurrency(subtotal + 15);
};

/**
 * Cria o HTML de um item do carrinho.
 * @param {Object} item - Item do carrinho
 * @param {number} index - Índice do item no carrinho
 * @returns {HTMLDivElement} Elemento do item
 */
const renderCartItem = (item, index) => {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item-carrinho';
  itemDiv.innerHTML = `
    <img src="${item.imagem}" alt="${item.nome}" />
    <div class="item-info">
      <h3>${item.nome}</h3>
      <p class="item-preco">${formatCurrency(parsePrice(item.preco) * item.quantidade)}</p>
      <div class="qty-controls">
        <button type="button" onclick="alterarQuantidadeCarrinho(${index}, -1)">-</button>
        <span>${item.quantidade}</span>
        <button type="button" onclick="alterarQuantidadeCarrinho(${index}, 1)">+</button>
      </div>
    </div>
    <button class="btn-remover" type="button" onclick="removerItemCarrinho(${index})">Remover</button>
  `;
  return itemDiv;
};

/**
 * Renderiza todos os itens do carrinho na página.
 */
const renderCart = () => {
  const listaCarrinho = document.getElementById('lista-carrinho');
  if (!listaCarrinho) return;

  const carrinho = getCart();
  listaCarrinho.innerHTML = '';

  if (carrinho.length === 0) {
    atualizarResumo(carrinho);
    return;
  }

  carrinho.forEach((item, index) => {
    listaCarrinho.appendChild(renderCartItem(item, index));
  });

  atualizarResumo(carrinho);
};

/**
 * Mostra um toast simples na tela.
 * @param {string} mensagem - Texto do toast
 */
const showToast = (mensagem) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
};

/**
 * Altera a quantidade de um item no carrinho.
 * @param {number} index - Índice do item no carrinho
 * @param {number} delta - Incremento ou decremento da quantidade
 */
const alterarQuantidadeCarrinho = (index, delta) => {
  const carrinho = getCart();
  if (!carrinho[index]) return;

  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade < 1) {
    carrinho.splice(index, 1);
  }

  setCart(carrinho);
  renderCart();
};

/**
 * Remove um item do carrinho pelo índice.
 * @param {number} index - Índice do item a remover
 */
const removerItemCarrinho = (index) => {
  const carrinho = getCart();
  if (!carrinho[index]) return;

  carrinho.splice(index, 1);
  setCart(carrinho);
  renderCart();
};

/**
 * Limpa todo o carrinho.
 */
const limparCarrinho = () => {
  setCart([]);
  renderCart();
  showToast('Carrinho limpo com sucesso.');
};

/**
 * Finaliza a compra e esvazia o carrinho.
 */
const finalizarCompra = () => {
  const carrinho = getCart();
  if (carrinho.length === 0) {
    showToast('Adicione livros ao carrinho antes de finalizar.');
    return;
  }

  setCart([]);
  renderCart();
  showToast('Compra finalizada com sucesso!');
};

window.alterarQuantidadeCarrinho = alterarQuantidadeCarrinho;
window.removerItemCarrinho = removerItemCarrinho;
window.limparCarrinho = limparCarrinho;
window.finalizarCompra = finalizarCompra;

// Vincula os botões ao carregar a página
bindCartButtons();
renderCart();
