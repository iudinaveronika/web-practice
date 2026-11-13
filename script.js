// Задание 2: Обработка клика по кнопке
const btn = document.getElementById('action-btn');
const textElement = document.getElementById('dynamic-text');

btn.addEventListener('click', () => {
    console.log("Кнопка нажата");
    textElement.textContent = "Текст успешно изменён с помощью JavaScript!";
});

// Задание 3: Загрузка данных из Google Таблицы
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYKtLWsqlEesIQ3enylYYx95g-hY0XZU3JnGiOweym0xBaMoFzwl91hYOCbg5pfdXzkm7mnyGr1d7N/pub?gid=0&single=true&output=csv';

async function loadTableData() {
    const container = document.getElementById('table-container');

    // исправлено: добавлен блок try/catch для перехвата сетевых ошибок и неверных ссылок
    try {
        const response = await fetch(CSV_URL);

        // исправлено: добавлена проверка response.ok, так как fetch не выбрасывает ошибку при статусах 404 или 500
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const csvText = await response.text();
        renderTable(csvText, container);

    } catch (error) {
        console.error('Ошибка при загрузке таблицы:', error);
        container.innerHTML = `<p style="color: red;">Не удалось загрузить данные: ${error.message}</p>`;
    }
}

function renderTable(csvText, container) {
    // исправлено: добавлена очистка пробелов и пустых строк через trim() и filter()
    const rows = csvText.trim().split('\n').filter(row => row.trim() !== '');

    if (rows.length === 0) {
        container.textContent = 'Таблица пуста.';
        return;
    }

    const table = document.createElement('table');

    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        // исправлено: учтён символ возврата каретки \r, который добавляет Google Таблица при экспорте CSV
        const cells = row.replace(/\r/g, '').split(',');

        cells.forEach(cellText => {
            const cell = document.createElement(index === 0 ? 'th' : 'td');
            cell.textContent = cellText.trim();
            tr.appendChild(cell);
        });

        table.appendChild(tr);
    });

    container.innerHTML = '';
    container.appendChild(table);
}

loadTableData();
