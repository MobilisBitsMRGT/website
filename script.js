// Toggle responsive class on navbar and animate hamburger
function makeResponsive(btn) {
    var x = document.getElementById("navbar");
    if (!x) return;

    // If called without button (backwards compatibility), find the button
    if (!btn) btn = document.querySelector('.icon.hamburger');

    var isResponsive = x.classList.contains('responsive');
    if (!isResponsive) {
        x.classList.add('responsive');
        if (btn) {
            btn.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    } else {
        x.classList.remove('responsive');
        if (btn) {
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    }
}