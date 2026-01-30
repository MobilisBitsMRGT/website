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

// Handle dropdown menus on touch devices
document.addEventListener('DOMContentLoaded', function() {
    var dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(function(dropdown) {
        var dropbtn = dropdown.querySelector('.dropbtn');
        var content = dropdown.querySelector('.dropdown-content');
        
        if (dropbtn && content) {
            dropbtn.addEventListener('click', function(e) {
                // Check if we're on a touch device or mobile view
                if (window.innerWidth <= 1260 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    e.preventDefault();
                    
                    // Close all other dropdowns
                    dropdowns.forEach(function(otherDropdown) {
                        if (otherDropdown !== dropdown) {
                            var otherContent = otherDropdown.querySelector('.dropdown-content');
                            if (otherContent) {
                                otherContent.style.display = 'none';
                            }
                        }
                    });
                    
                    // Toggle current dropdown
                    if (content.style.display === 'block') {
                        content.style.display = 'none';
                    } else {
                        content.style.display = 'block';
                    }
                }
            });
        }
    });
    
    // Close dropdowns when clicking outside on mobile/touch devices
    document.addEventListener('click', function(e) {
        // Only close dropdowns on mobile/touch devices or when in responsive mode
        if (window.innerWidth <= 1260 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(function(dropdown) {
                    var content = dropdown.querySelector('.dropdown-content');
                    if (content) {
                        content.style.display = 'none';
                    }
                });
            }
        }
    });
});

/* Hero Slider */
/*
SLIDE adatok
Ez egy konfigurációs tömb, hogy végig tudjunk iterálni rajta.
Ez azért jó, mert ha új slide kell csak itt hozzáadom, és nem kell kódot éget
 */

const slidesData=[
    {
        image: "sources/csapat.jpg",
    },
    {
        image: "sources/Developer_team.png",
    },
    {
        image: "sources/Robots_name2.png",
    },
    {
        image: "sources/Team_members.png",
    },
    {
        image: "sources/Coaches.png",
    },
    {
        image: "sources/Start_of_development.png",
    },
    {
        image: "sources/Place_of_development.png",
    },
]
/* DOM elemek */
const slidesEl = document.getElementById("slides");
const dotsEl = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressFill = document.getElementById("progressFill");

/* Állapot változók */
let activeIndex = 0;
let autoTimer = null;
let startX = null;
let isDragging = false;
let progressInterval = null;
let autoDuration = 0
let autoStartTime = 0
let threshold = 60; // Minimum elmozdulás a swipe-hoz
const AUTO_MIN = 5000;
const AUTO_MAX = 10000;

/* Slide rendelelés ás lazy load*/
function renderSlides() {
    slidesEl.innerHTML = "";
    dotsEl.innerHTML = "";

    slidesData.forEach(function (s, i){
        const slide = document.createElement("div");
        slide.className = "slide loading";

        /* Lazy loading
        Nem azonnal rakunk be képet, hanem lassú net, vagy throttling esetén
        hanem egy Image objektumot előtöltünk majd azt blur effectezzük a töltést szimulálva
        */
       const img = new Image();
       img.src = s.image;
       img.onload = function (){
        slide.style.backgroundImage = `url(${s.image})`; //TODO: TALÁN nem kell a '' kiiratás
        slide.classList.remove("loading");
        slidesEl.classList.add("loaded");
       }

        slide.innerHTML =
            '<div class="content">' +
                '<div class="content-inner">' +
                    '<h1 class="animate-left">' + s.title + '</h1>' +
                    '<p class="animate-bottom">' + s.line1 + '</p>' +
                    '<p class="animate-top">' + s.line2 + '</p>' +
                    '<p class="animate-right">' + s.line3 + '</p>' +
                    '<button class="cta animate-bottom">' + s.button + '</button>' +
                '</div>' +
            '</div>';

            slidesEl.appendChild(slide);

        // Dots
        const dot = document.createElement("div");
        dot.className = "dot" + (i === activeIndex ? " active" : "");
        dot.onclick = function () {goTo(i) }
        dotsEl.appendChild(dot);

    })
    updateTransform();
}
/* Slide pozíció frissítése */
function updateTransform() {
    slidesEl.style.transform = `translateX(-${activeIndex * 100}%)`;

    Array.from(dotsEl.children).forEach(function (dot, i){
        dot.classList.toggle("active", i === activeIndex);
    })
}
/* Autoplay + progress bar */
function startAuto(){
    stopAuto(); // Stop korábbi időzítőt

    autoDuration = 8000;
    autoStartTime = Date.now();

    /* Progressbar reset */
    progressFill.style.transition = "none";
    progressFill.style.width = "0%";
    progressFill.offsetWidth; // Reflow kényszerítése

    progressFill.style.transition = `width ${autoDuration}ms linear`;
    progressFill.style.width = "100%";

    /*Slide váltás időzítő */
    autoTimer = setTimeout(function (){
        /* randomNext(); */
        next();
        startAuto();
    },autoDuration);
    /* Másodperc alaú visszaszámláló*/
    progressInterval = setInterval(function (){
        const elapsed = Date.now() - autoStartTime;
        const remaining = Math.max(0, autoDuration - elapsed);
        progressTimer.textContent = Math.ceil(remaining / 1000);
    },200);
}

function stopAuto(){
    if (autoTimer){
        clearTimeout(autoTimer);
        autoTimer = null;
    }

    if (progressInterval){
        clearInterval(progressInterval);
        progressInterval = null;
    }

    progressFill.style.transition = "none";
    progressFill.style.width = "0%";
    progressTimer.textContent = "";
}

function resetAuto(){
    stopAuto();
    startAuto();
}
/* Navigáció a slidernek*/
function next(){
    activeIndex = (activeIndex + 1) % slidesData.length;
    renderSlides();
    resetAuto();
}
function prev(){
    activeIndex = (activeIndex - 1 + slidesData.length) % slidesData.length;
    renderSlides();
    resetAuto();
}
function goTo(index){
    activeIndex = index;
    renderSlides();
    resetAuto();
}
function randomNext(){
    let nextIndex = activeIndex;
    while (nextIndex === activeIndex){
        nextIndex = Math.floor(Math.random() * slidesData.length);
    }
    activeIndex = nextIndex;
    renderSlides();
    resetAuto();
}

/* Touch and mouse swipe */
function getX(e){
    if (e.touches && e.touches.length) return e.touches[0].clientX;
    if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientX;
    console.log(e.clientX);
    return e.clientX;
}
slidesEl.addEventListener("mousedown", function (e){
    startX = getX(e);
    isDragging = true;
    console.log("Drag start:", startX);
});

slidesEl.addEventListener("mouseup", function (e){
    if (!isDragging) return;
    const diff = startX - getX(e);
    console.log("Drag end:", getX(e), "Diff:", diff);
    if (diff > threshold) next();
    else if (diff < -threshold) prev();
    isDragging = false;
});

slidesEl.addEventListener("touchstart", function (e){
    startX = getX(e);
    isDragging = true;
    console.log("Touch start:", startX);
});
slidesEl.addEventListener("touchend", function (e){
    if (!isDragging) return;
    const diff = startX - getX(e);
    console.log("Touch end:", getX(e), "Diff:", diff);
    if (diff > threshold) next();
    else if (diff < -threshold) prev();
    isDragging = false;
});

/* Gomg navigáció */
document.addEventListener("keydown", function (e){
    if (e.key === "ArrowRight" || e.key === "d") next();
    else if (e.key === "ArrowLeft" || e.key === "a") prev();
});

/* Visibility Change
ha a User elvált a főoldalról, akkor ne fusson az autoplay a háttérben 
*/
document.addEventListener("visibilitychange", function (){
    if (document.hidden) stopAuto();
    else startAuto();
});

/* Gomb események */
prevBtn.onclick = prev;
nextBtn.onclick = next;


renderSlides();
startAuto();