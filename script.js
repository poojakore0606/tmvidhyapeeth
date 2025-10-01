const EXCEL_URL = "https://raw.githubusercontent.com/poojakore0606/YOUR_REPO_NAME/main/updated_events.xlsx";

async function loadEventsFromExcel() {
  const response = await fetch(EXCEL_URL);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheet = workbook.Sheets["events"];
  const data = XLSX.utils.sheet_to_json(sheet);

  const container = document.getElementById("eventContainer");
  container.innerHTML = "";

  data.forEach((event, index) => {
    if (event.Status === "Active") {
      const div = document.createElement("div");
      div.className = "event";
      div.innerHTML = `
        <h3>${event.Event}</h3>
        <p><strong>Date:</strong> ${event.Date}</p>
        <p><strong>Time:</strong> ${event.Time}</p>
        <p><strong>Location:</strong> ${event.Location}</p>
        <p><strong>Speaker:</strong> ${event.Speaker}</p>
        <img src="images/${event.Image}" alt="${event.Event}" style="trong> <span id="registeredCount${index}">0</span> / 150</p>
        <button onclick="showForm('${event.Event}', ${index})">Register</button>
      `;
      container.appendChild(div);
    }
  });

  updateStats(data);
}

function showForm(eventName, index) {
  document.getElementById("eventName").value = eventName;
  document.getElementById("registrationForm").style.display = "block";
}

function submitForm(e) {
  e.preventDefault();
  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;
  const phone = document.getElementById("studentPhone").value;
  const event = document.getElementById("eventName").value;

  const registration = { name, email, phone, event, date: new Date().toISOString().split("T")[0] };
  let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  registrations.push(registration);
  localStorage.setItem("registrations", JSON.stringify(registrations));

  alert(`Thank you for registering, ${name}!`);
  document.getElementById("registrationForm").reset();
  document.getElementById("registrationForm").style.display = "none";

  loadEventsFromExcel(); // Refresh seat counts
}

function updateStats(events) {
  const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  events.forEach((event, index) => {
    const count = registrations.filter(r => r.event === event.Event).length;
    const countSpan = document.getElementById(`registeredCount${index}`);
    if (countSpan) countSpan.innerText = count;
  });
}

window.onload = loadEventsFromExcel;