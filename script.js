function verifyHuman() {
  const botCheck = document.getElementById("bot-check");
  const app = document.getElementById("app");

  if (!botCheck || !app) {
    console.error("Bot check or app container not found");
    return;
  }

  botCheck.style.display = "none";
  app.style.display = "block";

  // Make sure map resizes correctly after showing
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
    loadArea();
    showDeal();
  }, 300);
}
// map specifications and initialization
let map;
let markers = [];

function makeItWorkMap() {
  map = L.map('map').setView([40.7128, -74.0060], 13); // NYC is default

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}
window.onload = makeItWorkMap
//business phaux data until user loads real data, and category filter function
let businesses = [
  { id:1, name:"Post Modernist Cafe", category:"Cafe", lat:40.715, lng:-74.002, rating:4 },
  { id:2, name:"Bookworms", category:"Bookshop", lat:40.710, lng:-74.01, rating:5 },
  { id:3, name:"MoMA", category:"Museum", lat:40.722, lng:-74.005, rating:4 },
  { id:4, name:"Boutique Couture", category:"Boutique", lat:40.716, lng:-74.003, rating:5 },
  { id:5, name:"Fancy Restaurant", category:"Restaurant", lat:40.713, lng:-74.008, rating:3 }
];

let bookmarks = [];
function filterCategory(cat) {
  if(cat==="All"){ displayBusinesses(businesses); }
  else{
    const filtered = businesses.filter(b => b.category === cat);
    displayBusinesses(filtered);
  }
}

// Area lookup based on user input
function loadArea() {
  displayBusinesses(businesses);

  // erease previous placeholder places
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  businesses.forEach(b => {
    let marker = L.marker([b.lat, b.lng]).addTo(map)
      .bindPopup(`<b>${b.name}</b><br>Category: ${b.category}<br>Rating: ${b.rating} ⭐<br><button onclick="bookmark(${b.id})">🔖 Bookmark</button>`);
    markers.push(marker);
  });

// how we show businesses on the list
  function displayBusinesses(bizList) {
    const bizDiv = document.getElementById("businessList");
    const bizDiv = document.getElementById("businessList");
  bizDiv.innerHTML = "";
  bizList.forEach(b => {
    bizDiv.innerHTML += `
      <div class="business">
        <h3>${b.name}</h3>
        <p>Category: ${b.category}</p>
        <p>Rating: ${b.rating} ⭐</p>
        <button onclick="bookmark(${b.id})">🔖 Bookmark</button>
      </div>
    `;
  });
}

//bookmarks
function filterCategory(cat) {
  if(cat==="All"){ displayBusinesses(businesses); }
  else{
    const filtered = businesses.filter(b => b.category === cat);
    displayBusinesses(filtered);
  }
}

//deals upgrade
function showDeal(){ 
  setTimeout(()=>{document.getElementById("dealPopup").style.display="block";},3000);
}
function closeDeal(){ 
  document.getElementById("dealPopup").style.display="none"; 
}
let deals = [
  { businessId: 1, text: "10% off at Blue Leaf Cafe today!" },
  { businessId: 2, text: "Buy 1 get 1 free at City Books!" },
  { businessId: 4, text: "20% off all items at Boutique Chic!" }
];
//deals function to change per location shift
function showDeal() {
  // Filter deals for businesses currently visible
  let visibleBusinessIds = businesses.map(b => b.id);
  let relevantDeals = deals.filter(d => visibleBusinessIds.includes(d.businessId));

  if (relevantDeals.length === 0) return;

  // Pick a random relevant deal
  let deal = relevantDeals[Math.floor(Math.random() * relevantDeals.length)];
  
  // Find business name
  let business = businesses.find(b => b.id === deal.businessId);

  // Display popup
  const popup = document.getElementById("dealPopup");
  popup.innerHTML = `<p>🎉 ${deal.text} (${business.name})</p>
                     <button onclick="closeDeal()">Close</button>`;
  popup.style.display = "block";
}

