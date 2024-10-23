<script>
    document.addEventListener("DOMContentLoaded", function () {
        const shorelineSavers = document.getElementById('shoreline-savers');
        const ecoFriendlyEats = document.getElementById('eco-friendly-eats');
        const greenMobility = document.getElementById('green-mobility');
        const body = document.body;

        shorelineSavers.addEventListener('mouseover', function () {
            body.style.backgroundColor = 'rgba(0, 109, 119, 0.7)';
        });

        shorelineSavers.addEventListener('mouseout', function () {
            body.style.backgroundColor = '#f4f4f9';
        });

        ecoFriendlyEats.addEventListener('mouseover', function () {
            body.style.backgroundColor = 'rgba(255, 195, 0, 0.7)';
        });

        ecoFriendlyEats.addEventListener('mouseout', function () {
            body.style.backgroundColor = '#f4f4f9';
        });

        greenMobility.addEventListener('mouseover', function () {
            body.style.backgroundColor = 'rgba(0, 150, 0, 0.7)';
        });

        greenMobility.addEventListener('mouseout', function () {
            body.style.backgroundColor = '#f4f4f9';
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
        const textContent = document.querySelector(".text-content");

        textContent.addEventListener("mouseover", function () {
            textContent.style.backgroundColor = "#e0f7fa";
            textContent.style.transform = "scale(1.05)";
        });

        textContent.addEventListener("mouseout", function () {
            textContent.style.backgroundColor = "#f9f9f9";
            textContent.style.transform = "scale(1)";
        });
    });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/static/sw.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.error('Service Worker registration failed', err));
}

</script>
