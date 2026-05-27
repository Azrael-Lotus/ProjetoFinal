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
    throw new Error(error.message || 'Erro desconhecido.');
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

// Vincula os botões ao carregar a página
bindCartButtons();
