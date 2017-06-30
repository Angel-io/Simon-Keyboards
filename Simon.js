const levels = 10;
let keys = generateKeys(levels);
let a, b, dificultad;

function generateKeys(){
  return new Array(levels).fill(0).map(generateRandomKey);
}

function generateRandomKey() {
  const min = 65;
  const max = 90;
  return Math.round(Math.random()*(max - min + 1)) + min;
}

function getElementByKeyCode(keyCode) {
    return document.querySelector(`[data-key = "${keyCode}"]`)
}

function activate(keyCode, opts = {}) {
  const el = getElementByKeyCode(keyCode);
  el.classList.add("active");
  if (opts.success) {
    el.classList.add("success");
  } else if (opts.fail) {
    el.classList.add("fail");
  }
  setTimeout(function(){deactivate(el)}, 500);
}

function deactivate(el){
  el.className = "key";
}

function initGame(){swal({
  title: "¡Selecciona un nivel de dificultad!",
  text: "1: Fácil 2: Intermedio 3: Difícil",
  type: "input",
  showCancelButton: false,
  closeOnConfirm: false,
  animation: "slide-from-top",
  inputPlaceholder: "Write 1, 2 or 3"
},
function(inputValue){
  if (inputValue === false) return false;
  if (inputValue === "") {
    swal.showInputError("You need to write something!");
    return false
  } else if (inputValue == 1) {
    a = 1000;
    b = 1500;
    dificultad = "Fácil";
    return nextLevel(0);
  } else if (inputValue == 2) {
    a = 800;
    b = 500;
    dificultad = "Intermedio";
    return nextLevel(0);
  } else if (inputValue == 3) {
    a = 400;
    b = 250;
    dificultad = "Difícil";
    return nextLevel(0);
  } else {
    swal.showInputError("You need to write a valid number!")
  }
});
}

function nextLevel(currentLevel) {
  if (currentLevel == levels){
    return swal({
      title: "Ganaste",
      type: "success",
    });
  }
  swal({
    timer: 1000,
    title: `Nivel ${currentLevel + 1}
    Dificultad: ${dificultad}`,
    showConfirmButton: false
  });
  for (let i = 0; i <= currentLevel; i++) {
    setTimeout(function(){activate(keys[i]);}, a * (i+1) + b);
  }
  let i = 0;
  let currentKey = keys[i];
  window.addEventListener("keydown", onkeydown);

  function onkeydown(ev) {
    if (ev.keyCode == currentKey) {
      activate(currentKey, {success: true});
      i++;
      if (i > currentLevel) {
        window.removeEventListener("keydown", onkeydown);
        setTimeout(function(){nextLevel(i)}, 1500);
      }
      currentKey = keys[i];
    } else {
      activate(ev.keyCode, {fail: true});
      window.removeEventListener("keydown", onkeydown);
      setTimeout(function(){
        swal({
          title: "Perdiste",
          text: "¿Quieres jugar de nuevo?",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
          closeOnConfirm: false
        }, function (ok) {
          setTimeout(function () {
            if (ok) {
              keys = generateKeys(levels);
              initGame();
            }
          }, 1000)
        })}, 1000)
    }
  }
}

initGame();
