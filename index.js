const init = () => {

    let btn = document.querySelector('#button-2');
    btn.addEventListener('click', getWeather);
  
    let close = document.querySelector('.close');
    close.addEventListener('click', closeModal);
  
    let closeBtn = document.querySelector('#close');
    closeBtn.addEventListener('click', closeModal);
  
    let modal = document.querySelector('#myModal');
  
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

const closeModal = () => window.location.reload();

const showErrorMessage = () => {
    let snackbar = document.querySelector("#snackbar");
    snackbar.className = "show";
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

const getWeather = () => {

    let input = document.querySelector("#input").value;
  
    if (input.length == 5) {
        let btn = document.querySelector('#button-2');
        btn.setAttribute("data-toggle", "modal");
        btn.setAttribute("data-target", "#myModal");
        getCordinates();
    } else {
        showErrorMessage();
        document.querySelector('#input').focus();
    }
}

const showTemperature = temp => {

    let div = document.createElement("div");
    let label = document.createElement("label");
    let output = document.querySelector(".modal-body");
    let input = document.querySelector("#input").value;
    let newImage = document.createElement("img");
    let celsius = temp;
    let labelText;
    let farenheit = celsius * 9 / 5 + 32;

    label.classList.add("col-15");
    div.setAttribute("id", "temperatureOutput");

    if (farenheit >= 83) {
        newImage.setAttribute("src", "images/warm.jpg");
        labelText = document.createTextNode(farenheit.toFixed(0) + '\xB0F');
        newImage.title = "Warm";
    } else if (farenheit <= 34) {
        newImage.setAttribute("src", "images/cold.jpg");
        labelText = document.createTextNode(farenheit.toFixed(0) + '\xB0F');
        newImage.title = "Cold";
    } else {
        labelText = document.createTextNode(farenheit.toFixed(0) + '\xB0F');
        newImage.setAttribute("src", "images/white.png");
    }

    label.appendChild(labelText);
    div.appendChild(label);
    div.appendChild(newImage);
    output.appendChild(div);

}

const showWind = windSpeed => {

    let div = document.createElement("div");
    let label = document.createElement("label");
    let output = document.querySelector(".modal-body");
    let newImage = document.createElement("img");
    let wind = windSpeed;
    let labelText;

    labelText = document.createTextNode(wind.replace(/^0/, '') + ' mph Wind');

    div.setAttribute("id", "windOutput");
    label.classList.add("col-15");

    label.appendChild(labelText);
    div.appendChild(label);

    if (wind >= 15) {
        newImage.setAttribute("src", "images/wind.png");
        newImage.title = "Wind";
        div.appendChild(newImage);
    } else {
        newImage.setAttribute("src", "images/white.png");
        div.appendChild(newImage);
    }

    output.appendChild(div);

}

const getCordinates = async () => {
    let url = "https://api.geonames.org/postalCodeSearchJSON?username=dylancadd&countryCode=US&postalcode=" + document.querySelector("#input").value;;

    await fetch(url).then(data => data.json()).then(jsonData => {

        let latitude = jsonData.postalCodes[0].lat;
        let longitude = jsonData.postalCodes[0].lng;
        let name = jsonData.postalCodes[0].placeName;
        let state = jsonData.postalCodes[0].adminCode1;

        let coords = {"latitude": latitude, "longitude": longitude};
        let location = `${name}, ${state}`;

        showLocation(location);
        getWeatherInfo(coords);

    })
}

const getWeatherInfo = async coords => {
    let lat = coords.latitude;
    let lng = coords.longitude;

    let url = `https://api.geonames.org/findNearByWeatherJSON?username=dylancadd&lat=${lat}&lng=${lng}`;

    await fetch(url).then(data => data.json()).then(jsonData => {
        let temp = jsonData.weatherObservation.temperature;
        let wind = jsonData.weatherObservation.windSpeed;

        showTemperature(temp);
        showWind(wind);

    })
}

const showLocation = location => {
    let spanText = document.querySelector("#spanText");
    spanText.innerHTML = `${location}`;
}

const validate = evt => {
    let theEvent = evt || window.event;
    let key;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    let regex = /[0-9]|\../;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

window.onload = init;