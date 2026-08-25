// C3: Módulo de Empresas con Modal de Confirmación
const form = document.getElementById('empresa-form');
const tbody = document.getElementById('empresas-tbody');
const feedback = document.getElementById('feedback-message');
const formTitle = document.getElementById('form-title');
const btnCancel = document.getElementById('btn-cancel');

// Elementos de la Modal
const deleteModal = document.getElementById('delete-modal');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalConfirm = document.getElementById('btn-modal-confirm');

let empresasLocal = [];
let empresaIdToDelete = null; // Variable para almacenar temporalmente el ID a eliminar

document.addEventListener('DOMContentLoaded', fetchEmpresas);

function showFeedback(message, isError = false) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = isError ? 'feedback error' : 'feedback success';
    feedback.classList.remove('hidden');
    setTimeout(() => feedback.classList.add('hidden'), 4000);
}

// GET: Cargar datos iniciales
async function fetchEmpresas() {
    try {
        const response = await fetch('https://dummyjson.com/carts');
        const data = await response.json();
        empresasLocal = data.carts || [];
        renderEmpresas();
    } catch (error) {
        showFeedback('Error al conectar con la API: ' + error.message, true);
    }
}

// Renderizar la lista
function renderEmpresas() {
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (empresasLocal.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay empresas registradas.</td></tr>';
        return;
    }

    empresasLocal.forEach(empresa => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${empresa.id}</td>
            <td>${empresa.userId}</td>
            <td>${empresa.totalProducts}</td>
            <td>$${empresa.total || 0}</td>
            <td>
                <button type="button" onclick="prepareEdit(${empresa.id}, ${empresa.userId}, ${empresa.totalProducts})">Editar</button>
                <button type="button" onclick="openDeleteModal(${empresa.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// POST / PUT: Crear o Editar
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('empresa-id').value;
        const userId = Number(document.getElementById('company-userId').value);
        const totalProducts = Number(document.getElementById('total-products').value);

        const payload = {
            userId: userId,
            products: [{ id: 1, quantity: totalProducts }]
        };

        try {
            if (id) {
                const idNum = Number(id);
                await fetch(`https://dummyjson.com/carts/${idNum}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const index = empresasLocal.findIndex(e => e.id === idNum);
                if (index !== -1) {
                    empresasLocal[index] = {
                        ...empresasLocal[index],
                        userId: userId,
                        totalProducts: totalProducts,
                        total: totalProducts * 100
                    };
                }
                showFeedback(`Empresa ${id} actualizada con éxito.`);
            } else {
                const res = await fetch('https://dummyjson.com/carts/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const responseData = await res.json();

                const nuevaEmpresa = {
                    id: responseData.id || (empresasLocal.length > 0 ? Math.max(...empresasLocal.map(e => e.id)) + 1 : 1),
                    userId: userId,
                    totalProducts: totalProducts,
                    total: totalProducts * 100
                };

                empresasLocal.unshift(nuevaEmpresa);
                showFeedback('Nueva empresa guardada y agregada a la lista.');
            }

            resetForm();
            renderEmpresas();
        } catch (error) {
            showFeedback('Error al guardar: ' + error.message, true);
        }
    });
}

window.prepareEdit = (id, userId, totalProducts) => {
    if (formTitle) formTitle.textContent = 'Editar Empresa';
    document.getElementById('empresa-id').value = id;
    document.getElementById('company-userId').value = userId;
    document.getElementById('total-products').value = totalProducts;
    if (btnCancel) btnCancel.classList.remove('hidden');
};

if (btnCancel) {
    btnCancel.addEventListener('click', resetForm);
}

function resetForm() {
    if (formTitle) formTitle.textContent = 'Agregar Nueva Empresa';
    document.getElementById('empresa-id').value = '';
    if (form) form.reset();
    if (btnCancel) btnCancel.classList.add('hidden');
}

// --- GESTIÓN DE LA VENTANA MODAL ---

// Abrir Modal
window.openDeleteModal = (id) => {
    empresaIdToDelete = id;
    if (deleteModal) deleteModal.classList.remove('hidden');
};

// Cerrar Modal
function closeDeleteModal() {
    empresaIdToDelete = null;
    if (deleteModal) deleteModal.classList.add('hidden');
}

if (btnModalCancel) {
    btnModalCancel.addEventListener('click', closeDeleteModal);
}

// Confirmar Eliminación desde la Modal
if (btnModalConfirm) {
    btnModalConfirm.addEventListener('click', async () => {
        if (!empresaIdToDelete) return;

        try {
            const idNum = Number(empresaIdToDelete);
            await fetch(`https://dummyjson.com/carts/${idNum}`, { method: 'DELETE' });
            
            empresasLocal = empresasLocal.filter(e => e.id !== idNum);
            showFeedback(`Empresa ${idNum} eliminada correctamente.`);
            renderEmpresas();
        } catch (error) {
            showFeedback('Error al eliminar: ' + error.message, true);
        } finally {
            closeDeleteModal();
        }
    });
}