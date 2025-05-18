
document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-overlays');
    const resultMsg = document.createElement('p');
    resultMsg.id = 'result-msg';
    resultMsg.style.color = '#d4af37';
    resultMsg.style.fontSize = '1.2em';
    resultMsg.style.marginTop = '10px';
    resultMsg.style.display = 'none';
    document.querySelector('.header').appendChild(resultMsg);

    const suggestBox = document.createElement('ul');
    suggestBox.id = 'suggest-box';
    suggestBox.style.listStyle = 'none';
    suggestBox.style.padding = '0';
    suggestBox.style.marginTop = '5px';
    suggestBox.style.color = '#d4af37';
    suggestBox.style.fontSize = '1em';
    document.querySelector('.header').appendChild(suggestBox);

    const clearBtn = document.getElementById('clear-btn');
    const nameInput = document.getElementById('name-input');

    clearBtn.addEventListener('click', () => {
        nameInput.value = '';
        resultMsg.style.display = 'none';
        suggestBox.innerHTML = '';
        document.querySelectorAll('.table-overlay').forEach(div => {
            div.style.display = 'none';
            div.classList.remove('fade-in');
        });
    });

    fetch('https://opensheet.elk.sh/1NuCoh_gcHEVKhZu2RsmxlEjTCRChEAeBcjBpWE16MTI/Sheet1')
        .then(res => res.json())
        .then(data => {
            const guestMap = {};
            const rawGuestMap = {};
            data.forEach(row => {
                const fullName = (row['Full Name'] || '').trim();
                const table = (row['Table'] || '').trim();
                if (fullName && table) {
                    const norm = normalizeInput(fullName);
                    guestMap[norm] = table.toLowerCase();
                    rawGuestMap[fullName] = table;
                }
            });

            const positions = [{"table": "Table 1", "left": "0.224132%", "top": "14.3303%"}, {"table": "Table 2", "left": "88.344%", "top": "9.66435%"}, {"table": "Table 3", "left": "7.78943%", "top": "10.3642%"}, {"table": "Table 4", "left": "81.0423%", "top": "9.43105%"}, {"table": "Table 5", "left": "14.0043%", "top": "10.1309%"}, {"table": "Table 6", "left": "76.8029%", "top": "5.69829%"}, {"table": "Table 7", "left": "18.1457%", "top": "5.69829%"}, {"table": "Table 8", "left": "73.8284%", "top": "16.43%"}, {"table": "Table 9", "left": "21.1281%", "top": "15.9313%"}, {"table": "Table 10", "left": "69.5124%", "top": "9.39897%"}, {"table": "Table 11", "left": "25.8101%", "top": "10.5655%"}, {"table": "Table 12", "left": "62.2107%", "top": "9.86556%"}, {"table": "Table 13", "left": "47.5227%", "top": "5.43291%"}, {"table": "Table 14", "left": "88.0669%", "top": "30.629%"}, {"table": "Table 15", "left": "32.8325%", "top": "10.0989%"}, {"table": "Table 16", "left": "82.208%", "top": "31.0956%"}, {"table": "Table 17", "left": "8.06312%", "top": "30.5969%"}, {"table": "Table 18", "left": "75.8197%", "top": "31.0635%"}, {"table": "Table 19", "left": "13.556%", "top": "30.5969%"}, {"table": "Table 20", "left": "69.4189%", "top": "31.2968%"}, {"table": "Table 21", "left": "20.0412%", "top": "31.5301%"}, {"table": "Table 22", "left": "63.4687%", "top": "31.5301%"}, {"table": "Table 23", "left": "26.255%", "top": "31.5301%"}, {"table": "Table 24", "left": "95.0026%", "top": "46.9278%"}, {"table": "Table 25", "left": "33.2019%", "top": "30.0983%"}, {"table": "Table 26", "left": "88.344%", "top": "51.7949%"}, {"table": "Table 27", "left": "0.0405468%", "top": "45.9625%"}, {"table": "Table 28", "left": "81.8532%", "top": "51.5616%"}, {"table": "Table 29", "left": "14.3647%", "top": "51.3283%"}, {"table": "Table 30", "left": "77.4348%", "top": "55.761%"}, {"table": "Table 31", "left": "8.05411%", "top": "51.5616%"}, {"table": "Table 32", "left": "74.5492%", "top": "45.9625%"}, {"table": "Table 33", "left": "22.2093%", "top": "44.7639%"}, {"table": "Table 34", "left": "69.6926%", "top": "50.8297%"}, {"table": "Table 35", "left": "19.2325%", "top": "57.1287%"}, {"table": "Table 36", "left": "82.9344%", "top": "68.327%"}, {"table": "Table 37", "left": "33.0161%", "top": "51.063%"}, {"table": "Table 38", "left": "70.2265%", "top": "67.8604%"}, {"table": "Table 39", "left": "26.0748%", "top": "55.2623%"}, {"table": "Table 40", "left": "62.7457%", "top": "52.9264%"}];
            positions.forEach(pos => {
                const div = document.createElement('div');
                div.className = 'table-overlay';
                div.dataset.table = pos.table.toLowerCase();
                div.style.left = pos.left;
                div.style.top = pos.top;
                tableContainer.appendChild(div);
            });

            nameInput.addEventListener('input', () => {
                const input = normalizeInput(nameInput.value.trim());
                suggestBox.innerHTML = '';

                if (input.length < 3) {
                    resultMsg.style.display = 'none';
                    document.querySelectorAll('.table-overlay').forEach(div => {
                        div.style.display = 'none';
                        div.classList.remove('fade-in');
                    });
                    return;
                }

                const matches = Object.keys(guestMap).filter(name => name.includes(input));
                matches.slice(0, 5).forEach(match => {
                    const li = document.createElement('li');
                    for (const rawName in rawGuestMap) {
                        if (normalizeInput(rawName) === match) {
                            li.textContent = capitalizeWords(rawName);
                            li.style.cursor = 'pointer';
                            li.onclick = () => {
                                nameInput.value = capitalizeWords(rawName);
                                showGuest(rawName);
                                suggestBox.innerHTML = '';
                            };
                            suggestBox.appendChild(li);
                            break;
                        }
                    }
                });

                if (matches.length === 0) {
                    resultMsg.textContent = 'Get help / Trouver assistance';
                    resultMsg.style.display = 'block';
                    document.querySelectorAll('.table-overlay').forEach(div => {
                        div.style.display = 'none';
                        div.classList.remove('fade-in');
                    });
                }
            });

            function showGuest(rawName) {
                const normName = normalizeInput(rawName);
                const tableName = guestMap[normName];
                if (!tableName) return;

                document.querySelectorAll('.table-overlay').forEach(div => {
                    div.style.display = (div.dataset.table === tableName) ? 'block' : 'none';
                    div.classList.remove('fade-in');
                });

                const targetOverlay = [...document.querySelectorAll('.table-overlay')].find(div => div.dataset.table === tableName);
                if (targetOverlay) {
                    targetOverlay.classList.add('fade-in');
                }

                resultMsg.textContent = `${capitalizeWords(rawName)} – ${rawGuestMap[rawName]}`;
                resultMsg.style.display = 'block';
            }

            function normalizeInput(str) {
                return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
            }

            function capitalizeWords(str) {
                return str.replace(/\b\w/g, char => char.toUpperCase());
            }
        });
});
