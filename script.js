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