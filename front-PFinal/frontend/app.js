const API_BASE_URL = 'http://localhost:3000';

const modalOverlay = document.getElementById('modal-overlay');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const fieldName = document.getElementById('field-name');
const modalSubmit = document.getElementById('modal-submit');
const modalSwitchText = document.getElementById('modal-switch-text');
const modalMsg = document.getElementById('modal-msg');
const userBar = document.getElementById('user-bar');
const userNameSpan = document.getElementById('user-name');
const btnLogout = document.getElementById('btn-logout');

const showMessage = (message) => {
  if (modalMsg) {
    modalMsg.textContent = message;
  }
};

const getLoggedUser = () => JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

const setLoggedUser = (user) => {
  localStorage.setItem('usuarioLogado', JSON.stringify(user));
};

const checkLogin = () => {
  const user = getLoggedUser();
  if (user) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnRegister) btnRegister.style.display = 'none';
    if (userBar) userBar.style.display = 'flex';
    if (userNameSpan) userNameSpan.textContent = '👤 ' + user.nome;
  }
};

const openModal = (type) => {
  if (!modalOverlay || !modalTitle || !fieldName || !modalSubmit || !modalSwitchText) return;
  modalOverlay.style.display = 'flex';
  showMessage('');
  if (type === 'register') {
    modalTitle.innerText = 'Cadastrar';
    fieldName.style.display = 'block';
    modalSubmit.innerText = 'Cadastrar';
    modalSwitchText.innerHTML = `Já possui conta? <a onclick="openModal('login')">Entrar</a>`;
  } else {
    modalTitle.innerText = 'Entrar';
    fieldName.style.display = 'none';
    modalSubmit.innerText = 'Entrar';
    modalSwitchText.innerHTML = `Não tem conta? <a onclick="openModal('register')">Cadastre-se</a>`;
  }
};

const safeFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao conectar com o backend.');
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro desconhecido.');
  }
};

const registerUser = async (nome, email, senha) => {
  return await safeFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha }),
  });
};

const loginUser = async (email, senha) => {
  return await safeFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
};

if (btnLogin) btnLogin.addEventListener('click', () => openModal('login'));
if (btnRegister) btnRegister.addEventListener('click', () => openModal('register'));
if (modalClose) modalClose.addEventListener('click', () => {
  if (modalOverlay) modalOverlay.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});

if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    location.reload();
  });
}

if (modalSubmit) {
  modalSubmit.addEventListener('click', async () => {
    const emailInput = document.getElementById('input-email');
    const senhaInput = document.getElementById('input-password');
    const nomeInput = document.getElementById('input-name');

    const email = emailInput ? emailInput.value.trim() : '';
    const senha = senhaInput ? senhaInput.value : '';

    if (modalTitle && modalTitle.innerText === 'Cadastrar') {
      const nome = nomeInput ? nomeInput.value.trim() : '';
      if (!nome || !email || !senha) {
        showMessage('Preencha todos os campos.');
        return;
      }
      try {
        const result = await registerUser(nome, email, senha);
        setLoggedUser({ nome: result.user.nome, email: result.user.email, token: result.token });
        if (modalOverlay) modalOverlay.style.display = 'none';
        checkLogin();
      } catch (error) {
        showMessage(error.message);
      }
    } else {
      if (!email || !senha) {
        showMessage('Preencha todos os campos.');
        return;
      }
      try {
        const result = await loginUser(email, senha);
        setLoggedUser({ nome: result.user.nome, email: result.user.email, token: result.token });
        if (modalOverlay) modalOverlay.style.display = 'none';
        checkLogin();
      } catch (error) {
        showMessage(error.message);
      }
    }
  });
}

checkLogin();

const bindCartButtons = () => {
  document.querySelectorAll('.btn-comprar').forEach((botao) => {
    botao.addEventListener('click', () => {
      const card = botao.closest('.card');
      if (!card) return;

      const nome = card.querySelector('h3')?.innerText || '';
      const preco = card.querySelector('.preco')?.innerText || '';
      const img = card.querySelector('img');
      const imagem = img ? img.src : '';

      const livro = { nome, preco, imagem, quantidade: 1 };
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      const existente = carrinho.find((item) => item.nome === nome);
      if (existente) {
        existente.quantidade += 1;
      } else {
        carrinho.push(livro);
      }

      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      botao.textContent = '✓ Adicionado!';
      setTimeout(() => { botao.textContent = 'Adicionar ao Carrinho'; }, 1500);
    });
  });
};

bindCartButtons();
