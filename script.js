// Data Storage
let bookings = JSON.parse(localStorage.getItem('elite_stay_data')) || [];

// 1. Navigation Logic
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-section');
        
        navItems.forEach(i => i.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(target).classList.add('active');
        document.getElementById('page-title').innerText = item.innerText.trim();
    });
});

// 2. Price Calculation
const updatePrice = () => {
    const rate = document.getElementById('gRoom').value;
    const nights = document.getElementById('gNights').value || 0;
    const total = rate * nights;
    document.getElementById('livePrice').innerText = `₹${total}`;
    return total;
};

document.getElementById('gRoom').addEventListener('change', updatePrice);
document.getElementById('gNights').addEventListener('input', updatePrice);

// 3. Form Submission
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newBooking = {
        id: Date.now(),
        name: document.getElementById('gName').value,
        date: document.getElementById('gDate').value,
        room: document.getElementById('gRoom').options[document.getElementById('gRoom').selectedIndex].text.split(' (')[0],
        amount: updatePrice(),
        status: 'Confirmed'
    };

    bookings.push(newBooking);
    localStorage.setItem('elite_stay_data', JSON.stringify(bookings));
    renderAll();
    e.target.reset();
    updatePrice();
    alert("Booking Confirmed!");
});

// 4. Delete Logic
const deleteRes = (id) => {
    if(confirm("Are you sure?")) {
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('elite_stay_data', JSON.stringify(bookings));
        renderAll();
    }
};

// 5. Render Everything
function renderAll() {
    // Bookings Table
    const tableBody = document.getElementById('booking-table-body');
    tableBody.innerHTML = bookings.map(b => `
        <tr>
            <td><strong>${b.name}</strong></td>
            <td>${b.date}</td>
            <td>${b.room}</td>
            <td>₹${b.amount}</td>
            <td><span class="status-pill">${b.status}</span></td>
            <td><button onclick="deleteRes(${b.id})" style="border:none; background:none; color:red; cursor:pointer;"><i class="ph ph-trash"></i></button></td>
        </tr>
    `).reverse().join('');

    // Dashboard Stats
    document.getElementById('total-bookings').innerText = bookings.length;
    const rev = bookings.reduce((sum, b) => sum + b.amount, 0);
    document.getElementById('total-revenue').innerText = `₹${rev}`;

    // Guest History Logic
    const guestCounts = {};
    bookings.forEach(b => guestCounts[b.name] = (guestCounts[b.name] || 0) + 1);
    
    document.getElementById('guest-table-body').innerHTML = Object.keys(guestCounts).map(name => `
        <tr>
            <td>${name}</td>
            <td>${guestCounts[name]} times</td>
            <td>${guestCounts[name] > 2 ? '💎 Gold Member' : 'Regular'}</td>
        </tr>
    `).join('');
}

// Initial Run
renderAll();