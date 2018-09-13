function createNewElement(number) {
  var result = document.createElement("label");
  var newInput = document.createElement("input");
  newInput.setAttribute("type", "checkbox");
  newInput.onclick = function () {
    if (this.checked) {
      playSound("./sounds/tink.wav");
      changeSelection(number, this.parentElement.parentElement.id);
      this.parentElement.classList.add("selected");
    } else {
      playSound("./sounds/kick.wav");
      removeSelection(number, this.parentElement.parentElement.id);
      this.parentElement.classList.remove("selected");
    }
  };

  newInput.className = "box";
  newInput.id = "pool-" + number;
  newInput.setAttribute('data-number', number);
  var newSpan = document.createElement("span");
  newSpan.innerHTML = number;
  result.appendChild(newInput);
  result.appendChild(newSpan);
  return result;
}

function renderNumbersPool(id) {
  var container = document.getElementById(id);
  for (var i = 1; i < 50; i++) {
    var element = createNewElement(i);
    container.appendChild(element);
  }
}

function changeSelection(number, id) {
  if (id == 'playerOne') {
    var selection = document.getElementById('selectionOne');
  } else {
    var selection = document.getElementById('selectionTwo');
  }

  var newSpan = document.createElement("span");
  newSpan.id = "selection-" + number;
  newSpan.innerHTML = number;
  newSpan.onclick = function () {
    document.getElementById("pool-" + number).click();
  };

  selection.appendChild(newSpan);
}

function removeSelection(number) {
  document.getElementById("selection-" + number).remove();
}

function playSound(path) {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', path);
  audioElement.play();
}

function checkboxes() {
  var inputElems = document.getElementsByTagName("input");
  var count = 0;
  console.log(inputElems);
  var selectedNumber = [];
  for (var i = 0; i < inputElems.length; i++) {
    if (inputElems[i].type === "checkbox" && inputElems[i].checked === true) {
      count++;
      selectedNumber.push(parseInt(inputElems[i].getAttribute('data-number')));
    }
  }
  if (count !== 6) {
    playSound("./sounds/mistake.wav");
    Alert.render("Please select exactly 6 numbers");
    
  }
  else {
    let rightNumbers = generateLottoArray(6, 1, 49).sort((a, b) => a - b);
    let rightGuesses = numberOfCorrectGuesses(selectedNumber, rightNumbers)
    add(name, rightGuesses)
    playSound("./sounds/openhat.wav");
    Alert.render("Following numbers were drawn. " + rightNumbers + "<br />" + name + " You have " + rightGuesses + " number(s) guessed right.");
    Alert.ok = function() {
      location.reload()
    }       
  }
}

function CustomAlert() {
  this.render = function (dialog) {
    var dialogoverlay = document.getElementById('dialogoverlay');
    var dialogbox = document.getElementById('dialogbox');
    dialogoverlay.style.display = "block";
    dialogbox.style.display = "block";
    document.getElementById('dialogboxbody').innerHTML = dialog;
    document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
  }

  this.ok = function () {
    document.getElementById('dialogbox').style.display = "none";
    document.getElementById('dialogoverlay').style.display = "none";    
  }
}
var Alert = new CustomAlert();

// Init
renderNumbersPool("playerOne");

const lotto = ['#charOne', '#charTwo', '#charThree', '#charFour', '#charFive']

for (let i = 0; i < 5; i++) {
  let time = (Math.random() + 2) * 4
  let spin = document.querySelector(lotto[i]);
  spin.style.setProperty('--animation-time', time + 's')
}

function buyTicket() {

  name = ""
  while (name === "") {
    name = prompt('Please enter your name:')
  }

  if (name !== "null") {
    let buy = document.getElementById('buyTicket')
    let activateCheckButton = document.getElementById('checkButton')
    activateCheckButton.setAttribute('onclick', 'checkboxes()')
    buy.setAttribute('id', 'boughtTicket')
    buy.innerHTML = 'Ticket bought'
    buy.setAttribute('onclick', '')
  }
}

var xmlhttp = new XMLHttpRequest();
var url = "https://lwssave.blob.core.windows.net/highscore/highscore.json";

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    myArr = JSON.parse(this.responseText);
    createHighscore(myArr);
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function createHighscore(arr) {
  let high = document.getElementById('highscore')
  let sortable = Object.entries(arr)

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  })

  sortable.forEach((element) => {
    let newList = document.createElement("li");
    newList.innerHTML = element[0] + " " + element[1];
    high.appendChild(newList)
  })
}

