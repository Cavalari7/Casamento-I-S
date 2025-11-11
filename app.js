document.addEventListener('DOMContentLoaded', () => {
  const qs = (sel) => document.querySelector(sel);

  const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
  const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));
  const id = () => Math.random().toString(36).substr(2, 9);
  const money = (v) =>
    Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function addAndRender(form, key, obj, renderFn) {
    const arr = read(key);
    arr.push(obj);
    write(key, arr);
    form.reset();
    renderFn();
  }

  // --- CONVIDADOS ---
  const guestForm = qs('#guest-form');
  const guestList = qs('#guest-list');
  const search = qs('#search-guest');

  function renderGuests() {
    const all = read('guests');
    const f = (search.value || '').toLowerCase();
    guestList.innerHTML = '';
    all.filter(g => g.name.toLowerCase().includes(f)).forEach(g => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${g.name}</strong> <em>${g.type}</em> <button data-id="${g.id}">X</button>`;
      guestList.appendChild(li);
    });
  }

  guestForm.addEventListener('submit', e => {
    e.preventDefault();
    addAndRender(guestForm, 'guests', {
      id: id(),
      name: qs('#guest-name').value,
      type: qs('#guest-type').value
    }, renderGuests);
  });

  guestList.addEventListener('click', e => {
    if (e.target.dataset.id) {
      let l = read('guests').filter(x => x.id !== e.target.dataset.id);
      write('guests', l);
      renderGuests();
    }
  });

  search.addEventListener('input', renderGuests);
  qs('#clear-guests').addEventListener('click', () => {
    write('guests', []);
    renderGuests();
  });

  // --- BUFFET ---
  function renderBuffet() {
    ['entrada', 'prato', 'bebida'].forEach(cat => {
      qs('#list-' + cat).innerHTML = '';
    });

    read('buffet').forEach(i => {
      const li = document.createElement('li');
      li.innerHTML = `${i.name} <button data-id="${i.id}">X</button>`;
      qs('#list-' + i.category).appendChild(li);
    });
  }

  qs('#buffet-form').addEventListener('submit', e => {
    e.preventDefault();
    addAndRender(qs('#buffet-form'), 'buffet', {
      id: id(),
      name: qs('#buffet-name').value,
      category: qs('#buffet-category').value
    }, renderBuffet);
  });

  ['entrada', 'prato', 'bebida'].forEach(cat => {
    qs('#list-' + cat).addEventListener('click', e => {
      if (e.target.dataset.id) {
        write('buffet', read('buffet').filter(x => x.id !== e.target.dataset.id));
        renderBuffet();
      }
    });
  });

  // --- GASTOS ---
  function renderExpenses() {
    qs('#expense-list').innerHTML = '';
    let total = 0;
    read('expenses').forEach(i => {
      total += Number(i.value);
      const li = document.createElement('li');
      li.innerHTML = `${i.name} - ${money(i.value)} <button data-id="${i.id}">X</button>`;
      qs('#expense-list').appendChild(li);
    });
    qs('#total-value').textContent = money(total);
  }

  qs('#expense-form').addEventListener('submit', e => {
    e.preventDefault();
    addAndRender(qs('#expense-form'), 'expenses', {
      id: id(),
      name: qs('#expense-name').value,
      value: qs('#expense-value').value.replace(',', '.')
    }, renderExpenses);
  });

  qs('#expense-list').addEventListener('click', e => {
    if (e.target.dataset.id) {
      write('expenses', read('expenses').filter(x => x.id !== e.target.dataset.id));
      renderExpenses();
    }
  });

  renderGuests();
  renderBuffet();
  renderExpenses();
});
