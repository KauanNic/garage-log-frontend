const API_VEHICLES = 'https://api-garage-log.onrender.com/api/vehicles';
const API_MAINTENANCES = 'https://api-garage-log.onrender.com/api/maintenances';

// Elementos da DOM
const vehicleForm = document.getElementById('vehicle-form');
const vBrand = document.getElementById('v-brand');
const vModel = document.getElementById('v-model');
const vYear = document.getElementById('v-year');
const vType = document.getElementById('v-type');
const vehiclesList = document.getElementById('vehicles-list');
const vehicleSelect = document.getElementById('vehicleId');

const entryForm = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const title = document.getElementById('title');
const description = document.getElementById('description');
const happenedAt = document.getElementById('happenedAt');
const entriesList = document.getElementById('entries-list');
const message = document.getElementById('message');
const cancelEdit = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const reloadBtn = document.getElementById('reload-btn');

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => message.textContent = '', 3000);
}

function formatDate(date) {
  return new Date(date).toLocaleString('pt-BR');
}

function clearEntryForm() {
  entryForm.reset();
  entryId.value = '';
  formTitle.textContent = 'Novo Serviço / Modificação';
  cancelEdit.classList.add('hidden');
  happenedAt.value = new Date().toISOString().slice(0, 16);
}

// --- LÓGICA DE VEÍCULOS (NOVA ENTIDADE) ---

async function loadVehicles() {
  const response = await fetch(API_VEHICLES);
  const vehicles = await response.json();

  // Preencher a lista de badgets na tela
  vehiclesList.innerHTML = vehicles.map(v => `
    <span class="badge bg-secondary p-2 d-flex align-items-center gap-2">
      ${v.brand} ${v.model} (${v.year})
      <button class="btn btn-sm btn-danger py-0 px-1" onclick="deleteVehicle('${v._id}')">X</button>
    </span>
  `).join('');

  // Preencher o select do formulário de manutenção
  vehicleSelect.innerHTML = vehicles.length 
    ? vehicles.map(v => `<option value="${v._id}">${v.model} - ${v.year}</option>`).join('')
    : '<option value="">Cadastre um veículo primeiro...</option>';
}

vehicleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    brand: vBrand.value,
    model: vModel.value,
    year: vYear.value,
    type: vType.value
  };
  await fetch(API_VEHICLES, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  vehicleForm.reset();
  loadVehicles();
});

window.deleteVehicle = async function (id) {
  if (!confirm('Excluir este veículo? Todos os registros dele ficarão orfãos.')) return;
  await fetch(`${API_VEHICLES}/${id}`, { method: 'DELETE' });
  loadVehicles();
  loadEntries();
};

// --- LÓGICA DE MANUTENÇÃO (CRUD ANTIGO ADAPTADO) ---

async function loadEntries() {
  const response = await fetch(API_MAINTENANCES);
  const entries = await response.json();

  if (!entries.length) {
    entriesList.innerHTML = '<p>Nenhum registro encontrado.</p>';
    return;
  }

  entriesList.innerHTML = entries.map(entry => {
    // Tratativa caso o veículo tenha sido deletado
    const vName = entry.vehicleId ? entry.vehicleId.model : 'Veículo Removido';
    return `
    <div class="entry-item">
      <div class="d-flex justify-content-between">
        <h3 class="h5 m-0">${entry.title}</h3>
        <span class="badge bg-dark">${vName}</span>
      </div>
      <p class="text-muted small m-0">${formatDate(entry.happenedAt)}</p>
      <p class="mt-2">${entry.description}</p>
      <div class="entry-buttons">
        <button onclick="editEntry('${entry._id}')" class="btn btn-sm btn-outline-primary">Editar</button>
        <button onclick="deleteEntry('${entry._id}')" class="btn btn-sm btn-outline-danger">Excluir</button>
      </div>
    </div>
  `}).join('');
}

async function saveEntry(data) {
  const id = entryId.value;
  const url = id ? `${API_MAINTENANCES}/${id}` : API_MAINTENANCES;
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

window.editEntry = async function (id) {
  const response = await fetch(`${API_MAINTENANCES}/${id}`);
  const entry = await response.json();

  entryId.value = entry._id;
  vehicleSelect.value = entry.vehicleId;
  title.value = entry.title;
  description.value = entry.description;
  happenedAt.value = new Date(entry.happenedAt).toISOString().slice(0, 16);

  formTitle.textContent = 'Editar Serviço';
  cancelEdit.classList.remove('hidden');
};

window.deleteEntry = async function (id) {
  if (!confirm('Deseja excluir este registro?')) return;
  await fetch(`${API_MAINTENANCES}/${id}`, { method: 'DELETE' });
  showMessage('Registro excluído.');
  loadEntries();
};

entryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!vehicleSelect.value) {
    alert("Você precisa cadastrar e selecionar um veículo primeiro!");
    return;
  }

  const data = {
    vehicleId: vehicleSelect.value,
    title: title.value,
    description: description.value,
    happenedAt: happenedAt.value
  };

  await saveEntry(data);
  showMessage(entryId.value ? 'Serviço atualizado.' : 'Serviço registrado.');
  clearEntryForm();
  loadEntries();
});

cancelEdit.addEventListener('click', () => {
  clearEntryForm();
});

reloadBtn.addEventListener('click', loadEntries);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./service-worker.js');
    } catch (error) {
      console.log('Erro SW:', error);
    }
  });
}

// Inicializa a tela
clearEntryForm();
loadVehicles().then(loadEntries);