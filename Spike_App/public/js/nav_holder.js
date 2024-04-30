document.addEventListener("DOMContentLoaded", function () {
            var lastScrollTop = 0;
            var navbar = document.getElementsByTagName('nav')[0]; // Get the navigation bar

            window.addEventListener("scroll", function () {
                var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

                if (currentScroll > lastScrollTop) {
                    // Scrolling down
                    navbar.style.top = '-70px'; // Adjust this value to the height of your nav
                } else {
                    // Scrolling up
                    navbar.style.top = '0';
                }
                lastScrollTop = currentScroll <= 0 ? 0 :
                currentScroll; // For Mobile or negative scrolling
            }, false);
        });