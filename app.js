// Doppler form styling
let isSubmited = false;
let rangeVal = 0;

$("#detectSubmit").on("submit", (e) => {
    e.preventDefault();
    rangeVal = amount.value;
    isSubmited = true;
    $("#duesInputs").remove()
    $("#amount").remove()
    assingType(vehiclesData[Object.keys(vehiclesData)[0]]);
    $("#duesLabel").html("")
    $(`#${dueVal}`).css({"backgroundColor": "white", "color": "#194473"})

}) 

let getDopplerInputs = setInterval(() => {
  let dopplerInputs = $('._dp_canvas-input')
  if(dopplerInputs.length > 0){
    clearInterval(getDopplerInputs)
    drawPlaceholders(dopplerInputs)
  }
})

const drawPlaceholders = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (i == 0) {
      $(arr[i]).append('<label class="placeholder">Correo Electronico</label>')
    }
    if (i == 2) {
      $(arr[i]).append('<label class="placeholder">Nombre</label>')
    }
  }
} 

//Firestore handler

let vehiclesData = {};

db.getCollection = (collection) => db.collection(collection).get()
                            .then((querySnapshot) => querySnapshot.forEach((doc) => {
                                vehiclesData = Object.fromEntries(
                                  Object.entries(doc.data()).sort()
                                );
                                assingType(vehiclesData[Object.keys(vehiclesData)[0]]);
                            }))

db.getCollection("vehiclesData")  


//Simulator
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
})

//set selected due
let dueVal;
window.location.hash
? dueVal = window.location.hash.substring(1)
: dueVal = 24
setTimeout(() => {
  $(`#${dueVal}`).css({"backgroundColor": "white", "color": "#194473"})
}, 1000)


//calc and show result
const updateInputs = (data) => {
  const calcDues = (data) => {
    let parsedVal = parseInt(dueVal)
    let due = ($("#amount").val() / data.fixedFee) * data.duesOptions[parsedVal]
    
    isSubmited 
    ? setTimeout(() => {
        $("#result").html(''),
        $("#result").append(`<div id="duesLabel"><em>${parsedVal}</em> cuotas de <br/> <em>${formatter.format(due)}</em>  x Mes</div>`)
        $("#result").prepend('<div class="labelContainer" id="duesContainer"><span class="titleLabel finalLabel">Tu resultado:</span></div>')
        $("#result").append(`<button onclick="location.href='https://procredit.com.ar/inicio-de-solicitud'" class="final-button"></button>`)
      },100)

    : null
  }

  //triggers
  $("#amountLabel").text(formatter.format($("#amount").val()))

  calcDues(data)
  $("#amount").on("input change",() => {
    $("#amountLabel").text(formatter.format($("#amount").val()))
    calcDues(data)
  })
  $(".dues").on("click",(e) => {
    $(".dues").css({"backgroundColor": "#194473", "color": "#fff"})
    $(e.currentTarget).css({"backgroundColor": "white", "color": "#194473"})
    dueVal = e.currentTarget.id
    calcDues(data, dueVal)
  })
}

//clear inputs and call to update them
const assingType = (data) => {
  $("#duesContainer").after(`
    <div class="duesContainer" id="duesInputs"></div>
  `)
  Object.keys(data.duesOptions).forEach(key => {
    $("#duesInputs").append(`
      <a class="duesButton dues" id="${key}" href="#${key}">${key}</a>
    `)
  })
  
  $("#amountContainer").after(`
    <input type="range" min="${data.minMax.min}" max="${data.minMax.max}" step="${data.rangeStep}" value="${rangeVal}" class="rangeInput" id="amount"/>
  `)
  updateInputs(data)
}

//select type of vehicle
const selectType = (value) => {
  $("#duesInputs").remove()
  $("#amount").remove()
  assingType(vehiclesData[Object.keys(vehiclesData)[$(value).attr('data-type')]]);
}
