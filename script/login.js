
function togglePassword() {
  let p = document.getElementById("password");
  let img = document.getElementById("togglePasswordIcon").querySelector("img");
  
  if (p.type === "password") { 
    p.type = "text"; 
    img.src = "../assets/img/visibility.svg"; 
  } else { 
    p.type = "password"; 
    img.src = p.value ? "../assets/img/visibility_off.svg" : "../assets/img/lock.svg";
  }
}


function updateIcon() {
  let p = document.getElementById("password");
  let img = document.getElementById("togglePasswordIcon").querySelector("img");
  
  if (p.type === "password") {
    img.src = p.value ? "../assets/img/visibility_off.svg" : "../assets/img/lock.svg";
  }
}


function validateInput(input) {
  let isValid = true;
  
  if (input.value.trim() === '') {
    isValid = false;
  }
  
  if (input.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value)) {
      isValid = false;
    }
  }
  
  if (input.type === 'password') {
    if (input.value.length < 6) {
      isValid = false;
    }
  }
  
  if (isValid) {
    input.classList.remove('error');
  } else {
    input.classList.add('error');
  }
  return isValid;
}



async function loadImageSequence() {
  const container = document.getElementById('image-sequence');
  container.innerHTML = '<img src="../assets/img/Capa 2.svg" alt="Logo Intro">';
  container.style.display = 'block'
  
  container.classList.add('animate-logo');
  await new Promise((resolve) => setTimeout(resolve, 2000));
  container.style.display = 'none';
  document.querySelector('.logo').classList.remove('hidden');
}

window.addEventListener('load', loadImageSequence);
