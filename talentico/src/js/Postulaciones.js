// C3: Módulo de Postulaciones con Modal de Confirmación
const form = document.getElementById('postulacion-form');
const tbody = document.getElementById('postulaciones-tbody');
const feedback = document.getElementById('feedback-message');
const formTitle = document.getElementById('form-title');
const btnCancel = document.getElementById('btn-cancel');

// Elementos de la Modal
const deleteModal = document.getElementById('delete-modal');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalConfirm = document.getElementById('btn-modal-confirm');

let postulacionesLocal = [];
let postulacionIdToDelete = null; // Guardar temporalmente el ID a eliminar

document.addEventListener('DOMContentLoaded', fetchPostulaciones);

function showFeedback(message, isError = false) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = isError ? 'feedback error' : 'feedback success';
    feedback.classList.remove('hidden');
    setTimeout(() => feedback.classList.add('hidden'), 4000);
}

// 1. GET: Cargar datos desde DummyJSON (/posts)
async function fetchPostulaciones() {
    try {
        const response = await fetch('https://dummyjson.com/posts');
        const data = await response.json();
        postulacionesLocal = data.posts || [];
        renderPostulaciones();
    } catch (error) {
        showFeedback('Error al conectar con la API: ' + error.message, true);
    }
}

// Renderizar tabla
function renderPostulaciones() {
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (postulacionesLocal.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay postulaciones registradas.</td></tr>';
        return;
    }

    postulacionesLocal.forEach(post => {
        const tr = document.createElement('tr');
        const safeTitle = (post.title || '').replace(/'/g, "\\'");
        const safeBody = (post.body || '').replace(/'/g, "\\'");

        tr.innerHTML = `
            <td>${post.id}</td>
            <td>${post.userId}</td>
            <td><strong>${post.title}</strong></td>
            <td>${post.reactions?.likes || 0} Likes</td>
            <td>
                <button type="button" onclick="preparePatch(${post.id}, '${safeTitle}', '${safeBody}')">Editar Título (PATCH)</button>
                <button type="button" onclick="openDeleteModal(${post.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 2. POST / PATCH: Crear o Modificar
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('postulacion-id').value;
        const title = document.getElementById('post-title').value;
        const body = document.getElementById('post-body').value;
        const userId = Number(document.getElementById('post-userId').value);

        try {
            if (id) {
                // PATCH
                const idNum = Number(id);
                const payloadPatch = { title: title };

                await fetch(`https://dummyjson.com/posts/${idNum}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payloadPatch)
                });

                const index = postulacionesLocal.findIndex(p => p.id === idNum);
                if (index !== -1) {
                    postulacionesLocal[index].title = title;
                    postulacionesLocal[index].body = body;
                }
                showFeedback(`Postulación ${id} actualizada con éxito vía PATCH.`);
            } else {
                // POST
                const payloadPost = { title, body, userId };

                const res = await fetch('https://dummyjson.com/posts/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payloadPost)
                });
                const responseData = await res.json();

                const nuevaPostulacion = {
                    id: responseData.id || (postulacionesLocal.length > 0 ? Math.max(...postulacionesLocal.map(p => p.id)) + 1 : 1),
                    title: title,
                    body: body,
                    userId: userId,
                    reactions: { likes: 0 }
                };

                postulacionesLocal.unshift(nuevaPostulacion);
                showFeedback('Nueva postulación guardada y agregada a la lista.');
            }

            resetForm();
            renderPostulaciones();
        } catch (error) {
            showFeedback('Error al guardar la postulación: ' + error.message, true);
        }
    });
}

// Preparar edición (PATCH)
window.preparePatch = (id, title, body) => {
    if (formTitle) formTitle.textContent = 'Editar Título de Postulación (PATCH)';
    document.getElementById('postulacion-id').value = id;
    document.getElementById('post-title').value = title;
    document.getElementById('post-body').value = body;
    document.getElementById('post-userId').disabled = true;
    if (btnCancel) btnCancel.classList.remove('hidden');
};

if (btnCancel) {
    btnCancel.addEventListener('click', resetForm);
}

function resetForm() {
    if (formTitle) formTitle.textContent = 'Registrar Nueva Postulación';
    document.getElementById('postulacion-id').value = '';
    document.getElementById('post-userId').disabled = false;
    if (form) form.reset();
    if (btnCancel) btnCancel.classList.add('hidden');
}

// --- GESTIÓN DE LA VENTANA MODAL ---

// Abrir Modal
window.openDeleteModal = (id) => {
    postulacionIdToDelete = id;
    if (deleteModal) deleteModal.classList.remove('hidden');
};

// Cerrar Modal
function closeDeleteModal() {
    postulacionIdToDelete = null;
    if (deleteModal) deleteModal.classList.add('hidden');
}

if (btnModalCancel) {
    btnModalCancel.addEventListener('click', closeDeleteModal);
}

// Confirmar Eliminación desde la Modal
if (btnModalConfirm) {
    btnModalConfirm.addEventListener('click', async () => {
        if (!postulacionIdToDelete) return;

        try {
            const idNum = Number(postulacionIdToDelete);
            await fetch(`https://dummyjson.com/posts/${idNum}`, { method: 'DELETE' });
            
            postulacionesLocal = postulacionesLocal.filter(p => p.id !== idNum);
            showFeedback(`Postulación ${idNum} eliminada correctamente.`);
            renderPostulaciones();
        } catch (error) {
            showFeedback('Error al eliminar: ' + error.message, true);
        } finally {
            closeDeleteModal();
        }
    });
}