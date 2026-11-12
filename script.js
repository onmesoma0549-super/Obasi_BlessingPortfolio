
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.dataset.page + '.html' === current) link.classList.add('active');
  });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '×' : '☰';
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const feedback = document.getElementById('formFeedback');
      if (!contactForm.reportValidity()) return;
      feedback.textContent = 'Thank you. This demo form is ready, but messages are not sent or stored.';
      feedback.classList.add('success');
      contactForm.reset();
    });
  }

  const taskForm = document.getElementById('taskForm');
  if (taskForm) {
    const input = document.getElementById('taskInput');
    const list = document.getElementById('taskList');
    const count = document.getElementById('taskCount');
    const filters = [...document.querySelectorAll('.filter')];
    let tasks = [];
    try { tasks = JSON.parse(localStorage.getItem('blessingPlannerTasks') || '[]'); } catch { tasks = []; }
    let filter = 'all';

    const save = () => localStorage.setItem('blessingPlannerTasks', JSON.stringify(tasks));
    const render = () => {
      list.replaceChildren();
      const visible = tasks.filter(task => filter === 'all' || (filter === 'active' ? !task.done : task.done));
      count.textContent = `${tasks.filter(t => !t.done).length} left · ${tasks.length} total`;
      if (!visible.length) {
        const empty = document.createElement('li');
        empty.className = 'task-item';
        empty.textContent = tasks.length ? 'Nothing in this filter yet.' : 'Your list is clear. Add your first task above.';
        list.append(empty);
      }
      visible.forEach(task => {
        const item = document.createElement('li');
        item.className = `task-item${task.done ? ' done' : ''}`;
        const check = document.createElement('input');
        check.type = 'checkbox'; check.checked = task.done; check.setAttribute('aria-label', 'Mark task complete');
        check.addEventListener('change', () => { task.done = check.checked; save(); render(); });
        const text = document.createElement('span'); text.className = 'task-text'; text.textContent = task.text;
        const actions = document.createElement('div'); actions.className = 'task-actions';
        const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = 'Edit';
        edit.addEventListener('click', () => {
          const updated = prompt('Edit your task:', task.text);
          if (updated && updated.trim()) { task.text = updated.trim(); save(); render(); }
        });
        const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Delete';
        remove.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
        actions.append(edit, remove); item.append(check, text, actions); list.append(item);
      });
    };
    taskForm.addEventListener('submit', event => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      tasks.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, done: false });
      save(); input.value = ''; render(); input.focus();
    });
    filters.forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.filter;
      filters.forEach(item => item.classList.toggle('active', item === button));
      render();
    }));
    render();
  }
});
