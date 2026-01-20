// --- ドロップダウンの開閉処理 ---
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('wsDropdown');
    const btn = document.getElementById('btnWsPermission');

    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        btn.classList.remove('active');
    } else {
        dropdown.style.display = 'block';
        btn.classList.add('active');
    }
}

// --- 画面のどこかをクリックしたら閉じる処理 ---
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('wsDropdown');
    const btn = document.getElementById('btnWsPermission');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        btn.classList.remove('active');
    }
});

// --- チェックボックス変更時のタグ更新処理 ---
function updateTags() {
    const container = document.getElementById('selectedTags');
    const checkboxes = document.querySelectorAll('.checkbox-custom');

    container.innerHTML = '';

    checkboxes.forEach(chk => {
        if (chk.checked) {
            const text = chk.value;
            const colorClass = chk.getAttribute('data-color');

            const tag = document.createElement('div');
            tag.className = `tag ${colorClass}`;
            tag.innerHTML = `
                <span>${text}</span>
                <span class="tag-remove" onclick="removeTag('${text}')">×</span>
            `;
            container.appendChild(tag);
        }
    });
}

// --- タグのバツボタンで選択解除する処理 ---
function removeTag(value) {
    const checkboxes = document.querySelectorAll('.checkbox-custom');
    checkboxes.forEach(chk => {
        if (chk.value === value) {
            chk.checked = false;
        }
    });
    updateTags();
}

// --- フォームクリア ---
function clearForm() {
    // プロジェクト選択をリセット
    document.querySelector('.project-select').selectedIndex = 0;
    // テキスト入力をクリア
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = '';
    });
    // チェックボックスをクリア
    document.querySelectorAll('.checkbox-custom').forEach(chk => {
        chk.checked = false;
    });
    updateTags();
}
