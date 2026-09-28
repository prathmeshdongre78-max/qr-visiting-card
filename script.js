/* =====================================================
   QR Visiting Card Generator
   Steps: 1) read the form  2) update the card
          3) make the QR code  4) download as image
   ===================================================== */

// ---------- 1. Get all the HTML elements we need ----------
const nameInput    = document.getElementById("name");
const titleInput   = document.getElementById("title");
const phoneInput   = document.getElementById("phone");
const emailInput   = document.getElementById("email");
const websiteInput = document.getElementById("website");
const colorInput   = document.getElementById("color");

const cName    = document.getElementById("cName");
const cTitle   = document.getElementById("cTitle");
const cPhone   = document.getElementById("cPhone");
const cEmail   = document.getElementById("cEmail");
const cWebsite = document.getElementById("cWebsite");

const card = document.getElementById("card");

// Text shown on the card when a field is empty
const defaults = {
  name: "Your Name",
  title: "Your Job Title",
  phone: "+91 00000 00000",
  email: "you@example.com",
  website: "yourwebsite.com"
};

// ---------- 2. Create the QR code object (only once) ----------
const qr = new QRCode(document.getElementById("qrcode"), {
  width: 100,
  height: 100,
  colorDark: "#16213a",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.M
});

// ---------- 3. Build a vCard text ----------
// A vCard is a standard format. When a phone scans it,
// the phone offers to "Add to Contacts".
function buildVCard(name, title, phone, email, website) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:" + name,
    "TITLE:" + title,
    "TEL:" + phone,
    "EMAIL:" + email,
    "URL:" + website,
    "END:VCARD"
  ].join("\n");
}

// ---------- 4. Update the card and the QR code ----------
function updateCard() {
  // Use the typed value, or the default text if the box is empty
  const name    = nameInput.value.trim()    || defaults.name;
  const title   = titleInput.value.trim()   || defaults.title;
  const phone   = phoneInput.value.trim()   || defaults.phone;
  const email   = emailInput.value.trim()   || defaults.email;
  const website = websiteInput.value.trim() || defaults.website;

  // Show the values on the card
  cName.textContent    = name;
  cTitle.textContent   = title;
  cPhone.textContent   = phone;
  cEmail.textContent   = email;
  cWebsite.textContent = website;

  // Change the card colour using a CSS variable
  document.documentElement.style.setProperty("--accent", colorInput.value);

  // Make a new QR code from the vCard text
  qr.clear();
  qr.makeCode(buildVCard(name, title, phone, email, website));
}

// Run updateCard() every time the user types or picks a colour
[nameInput, titleInput, phoneInput, emailInput, websiteInput, colorInput]
  .forEach(function (input) {
    input.addEventListener("input", updateCard);
  });

// ---------- 5. Helper: save a canvas as a PNG file ----------
function saveCanvas(canvas, fileName) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ---------- 6. Download the full card ----------
document.getElementById("downloadCard").addEventListener("click", function () {
  // html2canvas takes a "photo" of the card element
  html2canvas(card, { scale: 2, backgroundColor: null }).then(function (canvas) {
    const fileName = (nameInput.value.trim() || "my") + "-visiting-card.png";
    saveCanvas(canvas, fileName.replace(/\s+/g, "-"));
  });
});

// ---------- 7. Download only the QR code ----------
document.getElementById("downloadQR").addEventListener("click", function () {
  // The QR library draws a <canvas> inside #qrcode
  const qrCanvas = document.querySelector("#qrcode canvas");
  saveCanvas(qrCanvas, "my-qr-code.png");
});

// ---------- 8. Clear the form ----------
document.getElementById("resetBtn").addEventListener("click", function () {
  [nameInput, titleInput, phoneInput, emailInput, websiteInput]
    .forEach(function (input) { input.value = ""; });
  colorInput.value = "#0f766e";
  updateCard();
});

// Show the first card when the page opens
updateCard();
