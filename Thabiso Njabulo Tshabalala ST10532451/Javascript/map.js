   const mapEl = document.getElementById('map');
   if (mapEl) {
     const lat = -26.2041;  
     const lng = 28.0473;    

     const map = L.map('map').setView([lat, lng], 12);

     L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: 19,
       attribution: '&copy; OpenStreetMap contributors'
     }).addTo(map);

     L.marker([lat, lng]).addTo(map)
       .bindPopup('<strong>JNR Transportation</strong><br>Our pickup area')
       .openPopup();
   }