console.log("script loaded");

// grabbed these here because used everywhere
var navLinks = document.getElementById("navLinks");
var allPages = document.querySelectorAll("section");

// sets footer year
var yearEl = document.getElementById("yearTxt");
if (yearEl) yearEl.innerText = new Date().getFullYear();

// toggle mobile nav
document.getElementById("menuBtn").onclick = function() {
  navLinks.classList.toggle("open");
};

// close nav if clicked outside  
document.addEventListener("click", function(e) {
  if (!e.target.closest(".nav")) {
    navLinks.classList.remove("open");
  }
});

// escape also closes it - added this after testing on phone
window.addEventListener("keydown", function(e) {
  if (e.key === "Escape") navLinks.classList.remove("open");
});

function showPage(id) {
  // hide all first
  allPages.forEach(function(s) {
    s.classList.add("hide");
  });

  var target = document.getElementById(id);
  if (target) {
    target.classList.remove("hide");
  }

  // update active link
  var links = document.querySelectorAll("[data-page]");
  links.forEach(function(lnk) {
    lnk.classList.remove("active");
    if (lnk.getAttribute("data-page") === id) {
      lnk.classList.add("active");
    }
  });

  navLinks.classList.remove("open");
  window.scrollTo(0, 0);
}

// hook up all nav/data-page links
document.querySelectorAll("[data-page]").forEach(function(el) {
  el.addEventListener("click", function(e) {
    var pg = this.getAttribute("data-page");
    if (pg) {
      e.preventDefault();
      showPage(pg);
    }
  });
});

// brand click goes home
document.getElementById("brandBtn").onclick = function() {
  showPage("home");
};

// join buttons - both go to register
document.getElementById("joinBtn").onclick = function() {
  showPage("register");
};
document.getElementById("joinBtn2").onclick = function() {
  showPage("register");
};

// ----- registration form stuff -----

var STORE = "eca_regs";

function updateCount() {
  var raw = localStorage.getItem(STORE);
  var count = 0;
  if (raw) {
    try {
      count = JSON.parse(raw).length;
    } catch(err) {
      count = 0;
    }
  }
  document.getElementById("savedCount").innerText = count;
}

// clear button just resets form
document.getElementById("clearBtn").onclick = function() {
  document.getElementById("regForm").reset();
  document.getElementById("formNote").innerText = "";
  // clear any error messages too
  document.getElementById("eName").innerText = "";
  document.getElementById("eAge").innerText = "";
  document.getElementById("ePhone").innerText = "";
  document.getElementById("eLevel").innerText = "";
};

document.getElementById("regForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // clear old errors first
  document.getElementById("eName").innerText = "";
  document.getElementById("eAge").innerText = "";
  document.getElementById("ePhone").innerText = "";
  document.getElementById("eLevel").innerText = "";
  document.getElementById("formNote").innerText = "";

  var name = document.getElementById("name").value.trim();
  var age = document.getElementById("age").value;
  var phone = document.getElementById("phone").value.trim();
  var level = document.getElementById("level").value;
  var msg = document.getElementById("msg").value.trim();

  // validate - checking one by one and stopping at first issue
  if (name === "") {
    document.getElementById("eName").innerText = "Name can't be empty";
    return;
  }

  if (!age) {
    document.getElementById("eAge").innerText = "Please enter age";
    return;
  }
  if (age < 7 || age > 70) {
    document.getElementById("eAge").innerText = "Age should be 7 to 70";
    return;
  }

  // phone check - just length and digits, nothing fancy
  if (phone.length != 10) {
    document.getElementById("ePhone").innerText = "Need 10 digit number";
    return;
  }
  if (isNaN(phone)) {
    document.getElementById("ePhone").innerText = "Numbers only";
    return;
  }

  if (!level) {
    document.getElementById("eLevel").innerText = "Select your level";
    return;
  }

  // msg is optional so not checking it

  var entry = {
    name: name,
    age: parseInt(age),
    phone: phone,
    level: level,
    msg: msg,
    time: new Date().toLocaleString()
  };

  var existing = [];
  var saved = localStorage.getItem(STORE);
  if (saved) {
    try {
      existing = JSON.parse(saved);
    } catch(err) {
      existing = [];
    }
  }

  existing.push(entry);
  localStorage.setItem(STORE, JSON.stringify(existing));

  updateCount();
  document.getElementById("formNote").innerText = "Got it! We'll call you soon.";
  this.reset();
});

// load page and count on start
showPage("home");
updateCount();
