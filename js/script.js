loadTableFromStorage();

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const todo = this.querySelector('[name="todo"]').value.trim();
    const date = this.querySelector('[name="date"]').value;
    if (!todo || !date) return;

    // Validasi tanggal tidak boleh lebih lama dari hari ini
    const today = new Date();
    const inputDate = new Date(date);
    today.setHours(0,0,0,0);
    inputDate.setHours(0,0,0,0);
    if (inputDate < today) {
        alert('Tanggal tidak boleh lebih lama dari hari ini!');
        return;
    }

    const tbody = document.querySelector('table tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${todo}</td>
        <td>${date}</td>
        <td>Tertunda</td>
        <td>
            <button name="done">Selesai</button>
            <button name="delete">Hapus</button>
        </td>
    `;
    tbody.appendChild(tr);

    sortTableRows();
    saveTableToStorage();
    this.reset();
});

// Tombol hapus semua
document.querySelector('button[name="delete_all"]').addEventListener('click', function() {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';
    saveTableToStorage();
});

document.querySelector('table tbody').addEventListener('click', function(e) {
    let btn = e.target;
    if (!btn || btn.tagName !== 'BUTTON') return;

    if (btn.name === 'done') {
        const tr = btn.closest('tr');
        tr.style.background = 'darkgreen';
        tr.querySelector('td:nth-child(3)').textContent = 'Selesai';
    }
    if (btn.name === 'delete') {
        const tr = btn.closest('tr');
        tr.remove();
    }
    saveTableToStorage();
});

document.getElementById('filter').addEventListener('change', function() {
    const filter = this.value;
    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach(row => {
        const status = row.querySelector('td:nth-child(3)').textContent.trim();
        if (filter === 'all') {
            row.style.display = '';
        } else if (filter === 'done') {
            row.style.display = status === 'Selesai' ? '' : 'none';
        } else if (filter === 'pending') {
            row.style.display = status === 'Tertunda' ? '' : 'none';
        }
    });
    sortTableRows();
});

// Urutkan baris berdasarkan tanggal terdekat dengan hari ini
function sortTableRows() {
    const tbody = document.querySelector('table tbody');
    const today = new Date();
    today.setHours(0,0,0,0);
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
        const dateA = new Date(a.querySelector('td:nth-child(2)').textContent);
        const dateB = new Date(b.querySelector('td:nth-child(2)').textContent);
        const diffA = Math.abs(dateA - today);
        const diffB = Math.abs(dateB - today);
        return diffA - diffB;
    });
    rows.forEach(row => tbody.appendChild(row));
}

function saveTableToStorage() {
    const rows = document.querySelectorAll('table tbody tr');
    const data = [];
    rows.forEach(row => {
        data.push({
            todo: row.querySelector('td:nth-child(1)').textContent,
            date: row.querySelector('td:nth-child(2)').textContent,
            status: row.querySelector('td:nth-child(3)').textContent
        });
    });
    localStorage.setItem('todoTable', JSON.stringify(data));
}

function loadTableFromStorage() {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';
    const data = JSON.parse(localStorage.getItem('todoTable') || '[]');
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.todo}</td>
            <td>${item.date}</td>
            <td>${item.status}</td>
            <td>
                <button name="done">Selesai</button>
                <button name="delete">Hapus</button>
            </td>
        `;
        if (item.status === 'Selesai') tr.style.background = 'lightblue';
        tbody.appendChild(tr);
    });
    sortTableRows();
}
