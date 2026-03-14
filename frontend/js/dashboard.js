document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameDisplay = document.getElementById('userName');
    const userRoleDisplay = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');
    const adminBadge = document.getElementById('adminBadge');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveTaskBtn = document.getElementById('saveTaskBtn');

    let currentEditId = null;
    const user = JSON.parse(localStorage.getItem('user'));

    if (!localStorage.getItem('token') || !user) {
        window.location.href = 'index.html';
        return;
    }

    // Set user info
    userNameDisplay.textContent = user.name;
    userRoleDisplay.textContent = user.role;
    userAvatar.textContent = user.name.charAt(0).toUpperCase();
    if (user.role === 'admin') adminBadge.style.display = 'block';

    // Fetch and render tasks
    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            renderTasks(res.data.tasks);
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const renderTasks = (tasks) => {
        if (!tasks || tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No tasks found. Create one to get started!</p>';
            return;
        }

        taskList.innerHTML = tasks.map(task => `
            <div class="task-item">
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <p>${task.description || 'No description'}</p>
                    <div class="task-meta">
                        <span class="badge badge-${task.status}">${task.status}</span>
                        <span class="badge badge-${task.priority}">P: ${task.priority}</span>
                        ${user.role === 'admin' ? `<span style="font-size: 0.7rem; color: var(--text-muted)">By: ${task.owner.name}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-icon edit-btn" data-id="${task._id}" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon btn-delete delete-btn" data-id="${task._id}" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Attach listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteTask(btn.dataset.id));
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => startEdit(tasks.find(t => t._id === btn.dataset.id)));
        });
    };

    // Task CRUD
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDesc').value,
            priority: document.getElementById('taskPriority').value
        };

        try {
            if (currentEditId) {
                await api.put(`/tasks/${currentEditId}`, data);
                showToast('Task updated!', 'success');
            } else {
                await api.post('/tasks', data);
                showToast('Task created!', 'success');
            }
            taskForm.reset();
            cancelEdit();
            fetchTasks();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    const deleteTask = async (id) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            showToast('Task deleted!', 'success');
            fetchTasks();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const startEdit = (task) => {
        currentEditId = task._id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDesc').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        saveTaskBtn.textContent = 'Update Task';
        cancelEditBtn.style.display = 'block';
        document.getElementById('taskTitle').focus();
    };

    const cancelEdit = () => {
        currentEditId = null;
        saveTaskBtn.textContent = 'Create Task';
        cancelEditBtn.style.display = 'none';
        taskForm.reset();
    };

    cancelEditBtn.addEventListener('click', cancelEdit);

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Toast Notification
    const showToast = (message, type) => {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `message ${type}`;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
    };

    fetchTasks();
});
