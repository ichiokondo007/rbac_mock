// =====================================================
// 共通（index.html / detail.html）で読み込まれるスクリプト
// - モック用：ライブラリなし
// =====================================================

// -------------------------
// WS権限ドロップダウン（index.html）
// -------------------------

function toggleDropdown(event) {
    // index.html 以外から呼ばれても落ちないようにガード
    const dropdown = document.getElementById('wsDropdown');
    const btn = document.getElementById('btnWsPermission');
    if (!dropdown || !btn) return;

    event?.stopPropagation?.();

    const isOpen = dropdown.classList.contains('show');
    if (isOpen) {
        dropdown.classList.remove('show');
        btn.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        btn.classList.add('active');
    }
}

function updateTags() {
    const selectedTagsArea = document.getElementById('selectedTags');
    const dropdown = document.getElementById('wsDropdown');
    const btn = document.getElementById('btnWsPermission');

    // index.html 以外（detail.html）では要素が無いので何もしない
    if (!selectedTagsArea) return;

    selectedTagsArea.innerHTML = '';

    const checked = Array.from(document.querySelectorAll('.checkbox-custom'))
        .filter((el) => el.checked);

    checked.forEach((chk) => {
        const value = chk.value || '';
        const colorClass = chk.dataset?.color || '';

        const tag = document.createElement('span');
        tag.className = `tag ${colorClass}`;
        tag.textContent = value;

        const remove = document.createElement('span');
        remove.className = 'tag-remove';
        remove.textContent = '×';
        remove.title = '削除';

        remove.addEventListener('click', (e) => {
            e.stopPropagation();
            chk.checked = false;
            updateTags();
        });

        tag.appendChild(remove);
        selectedTagsArea.appendChild(tag);
    });

    // ボタンの見た目（選択中なら active）
    if (btn) {
        if (checked.length > 0) btn.classList.add('active');
        else btn.classList.remove('active');
    }

    // 開いている時にレイアウトが崩れるのを避けるため、必要ならここで調整可能
    if (dropdown && dropdown.classList.contains('show')) {
        // no-op
    }
}

// フォームクリア（index.html）
function clearForm() {
    const projectSelect = document.querySelector('.project-select');
    if (projectSelect) projectSelect.selectedIndex = 0;

    document.querySelectorAll('input[type="text"]').forEach((input) => {
        input.value = '';
    });

    document.querySelectorAll('.checkbox-custom').forEach((chk) => {
        chk.checked = false;
    });

    updateTags();
}

// index.html：画面のどこかをクリックしたらドロップダウンを閉じる
function closeWsDropdownIfOpen() {
    const dropdown = document.getElementById('wsDropdown');
    const btn = document.getElementById('btnWsPermission');
    if (!dropdown || !btn) return;

    dropdown.classList.remove('show');
    btn.classList.remove('active');
}

// -------------------------
// detail.html を右から 2/3 表示するドロワー（index.html）
// -------------------------

function openDetailDrawer() {
    const overlay = document.getElementById('detailDrawerOverlay');
    const frame = document.getElementById('detailDrawerFrame');
    if (!overlay || !frame) return;

    // detail.html を iframe で読み込む
    frame.src = 'detail_updated.html';

    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    // 背景スクロール抑止（ReactのDrawerに寄せる）
    document.body.style.overflow = 'hidden';
}

function closeDetailDrawer() {
    const overlay = document.getElementById('detailDrawerOverlay');
    const frame = document.getElementById('detailDrawerFrame');
    if (!overlay || !frame) return;

    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');

    // 画面を閉じたらフォーム状態もリセットしたい場合は破棄する
    // （「閉じたら index の状態に戻る」という紙芝居要件に合う）
    frame.src = 'about:blank';

    document.body.style.overflow = '';
}

// detail.html -> index.html へ「閉じる」通知を受ける
function handleDetailMessage(event) {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    // モックなので origin チェックは省略（実運用なら event.origin を検証）
    if (data.type === 'detail:close') {
        closeDetailDrawer();
    }
}

// -------------------------
// 初期化
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
    // index.html：詳細リンクにドロワーを紐付け
    const detailLinks = document.querySelectorAll('.detail-link');
    if (detailLinks && detailLinks.length > 0) {
        detailLinks.forEach((a) => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                openDetailDrawer();
            });
        });
    }

    // index.html：ドロップダウン外クリックで閉じる
    document.addEventListener('click', () => {
        // ドロップダウンが存在するページのみ動作
        closeWsDropdownIfOpen();
    });

    // index.html：overlayクリックで閉じる（パネル外側のみ）
    const overlay = document.getElementById('detailDrawerOverlay');
    const panel = document.getElementById('detailDrawer');
    const closeBtn = document.getElementById('detailDrawerClose');

    if (overlay && panel) {
        overlay.addEventListener('click', (e) => {
            // パネル内クリックは閉じない
            if (e.target === overlay) closeDetailDrawer();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeDetailDrawer);

    // ESCで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const ov = document.getElementById('detailDrawerOverlay');
        if (ov && ov.classList.contains('show')) closeDetailDrawer();
    });

    // postMessage受信
    window.addEventListener('message', handleDetailMessage);

    // 初期タグ描画（index.htmlのみ要素がある）
    updateTags();
});
