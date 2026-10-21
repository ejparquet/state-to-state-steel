// Header + mobile menu
const hdr = document.getElementById('hdr');
const onScroll = () => hdr.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
menuBtn.onclick = () => { const o = menu.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o); hdr.classList.add('scrolled'); };
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }));

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('yr').textContent = new Date().getFullYear();
