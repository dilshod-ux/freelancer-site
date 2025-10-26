// script.js (type="module" is used in index.html)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/yourFormId";
// <-- REPLACE "yourFormId" with your real Formspree ID (https://formspree.io/f/xxxxx)

document.getElementById('year').textContent = new Date().getFullYear();

// smooth scroll for header buttons
const orderTopBtn = document.getElementById('orderTopBtn');
const orderHeroBtn = document.getElementById('orderHeroBtn');
const mobileOrderBtn = document.getElementById('mobileOrderBtn');

[orderTopBtn, orderHeroBtn, mobileOrderBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('name').focus();
    });
});

// order buttons in cards
document.querySelectorAll('.order-btn').forEach(b => {
    b.addEventListener('click', (e) => {
        const pkg = e.currentTarget.dataset.package || '';
        const sel = document.getElementById('package');
        if (pkg) sel.value = pkg;
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('name').focus();
    });
});

// form handling using AJAX to Formspree
const form = document.getElementById('orderForm');
const msg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    msg.style.color = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !email) {
        msg.style.color = 'crimson';
        msg.textContent = 'Iltimos, ism va email/telegramni kiriting.';
        return;
    }

    // Save simple backup to localStorage
    const lead = { id: 'lead_' + Date.now(), name, email, package: form.package.value, message: form.message.value, freeOk: document.getElementById('freeOk').checked, createdAt: new Date().toISOString() };
    try {
        const leads = JSON.parse(localStorage.getItem('dilshod_leads') || '[]');
        leads.unshift(lead);
        localStorage.setItem('dilshod_leads', JSON.stringify(leads));
    } catch (e) { console.warn(e); }

    // POST to Formspree
    try {
        const formData = new FormData(form);
        const res = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            msg.style.color = 'green';
            msg.textContent = 'Rahmat! Formangiz qabul qilindi. Men 24 soat ichida javob beraman.';
            form.reset();
        } else {
            const data = await res.json().catch(() => null);
            msg.style.color = 'crimson';
            msg.textContent = data && data.error ? data.error : 'Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.';
        }
    } catch (err) {
        console.error(err);
        msg.style.color = 'crimson';
        msg.textContent = 'Tarmoq xatosi. Iltimos, internet aloqangizni tekshiring.';
    }
});

// helper: view leads in console
window.viewLeads = function () {
    const leads = JSON.parse(localStorage.getItem('dilshod_leads') || '[]');
    console.table(leads);
    return leads;
};
