
let cartCount = parseInt(document.getElementById("cart-count").innerText);

const loadAllPlayers = () => {
    fetch("https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=me")
        .then(res=>res.json())
        .then(data=>{
            // console.log(data.player);
            displayPlayers(data.player);
        })
        .catch((error) => {
            console.error(error);
        });
};

// List all players by name
const loadPlayerByName = () => {
    const searchLetter = document.getElementById("inputSearch").value;
    console.log(searchLetter);

    if (searchLetter == "") {
        const errorContainer = document.getElementById("error-display");
        errorContainer.innerHTML = "";
        const div = document.createElement("div");
        div.innerHTML = `
            <p class="text-danger fs-6 fst-italic">Please enter the input. </p>
        `;
        errorContainer.appendChild(div);
        return;
    }
    else {
        fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchLetter}`) // Using the Name
            .then(res => res.json())
            .then(data => {
                const playerContainer = document.getElementById("players-container");
                playerContainer.innerHTML = "";
                // console.log(data.player);
                displayPlayers(data.player);
                const searchInputField = document.getElementById("inputSearch");
                searchInputField.value = "";
            })
            .catch((error) => {
                console.error(error);
                const errorContainer = document.getElementById("error-display");
                errorContainer.innerHTML = "";
                const div = document.createElement("div");
                div.innerHTML = `
                <p class="text-warning fs-6 fst-italic">${error.message} Data unavailable!</p>
            `;
                errorContainer.appendChild(div);
                return;

            });
    }
};


const displayPlayers = (players) =>{
    const playerContainer = document.getElementById("players-container");
    players.forEach(player => {
        const div = document.createElement("div");
        div.classList.add("player-card-div");
        div.innerHTML = `
            <div class="card h-auto m-auto" style="width: 18rem;">
                <img class="card-img-top" src=${!player?.strCutout ? "./images/alternative_pic.jpg" : player?.strCutout} alt="" />
                <div class="card-body">
                    <h5 class="card-title">${player?.strPlayer}</h5>
                    <p>Gender: ${player?.strGender}</p>
                    <p>Nationality: ${player?.strNationality}</p>
                    <p>Team: ${player?.strTeam}</p>
                    <div class="d-flex gap-3 my-3">
                        <a href="http://${player?.strFacebook}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook"></i></a>
                        <a href="http://${player?.strTwitter}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-twitter"></i></a>
                        <a href="http://${player?.strYoutube}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-square-youtube"></i></a>
                        <a href="http://${player?.strInstagram}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i></a>
                    </div>
                    <div class="d-flex justify-content-between gap-2">
                        <!-- Button trigger modal -->
                        <button onclick="handleAddToCart('${player?.strPlayer}')" class="btn btn-primary">Add to Group</button>
                        <button onclick="singlePlayer('${player?.idPlayer}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
                    </div>
                </div>
            </div>
        `;
        playerContainer.appendChild(div);
    });
}

const handleDisplayDetails = (player) =>{
    const container = document.getElementById("modal-body-div");
    const div = document.createElement("div");
    div.innerHTML = `
        <div>
            <img class="w-25" src=${!player?.strThumb ? "./images/balls-football-sport-art-and-brush-strokes-style-png.webp" : player?.strThumb} alt="" />
            <h5>${player?.strPlayer}</h5>
            <p>Gender: ${player?.strGender}</p>
            <p>Nationality: ${player?.strNationality}</p>
            <p>Team: ${player?.strTeam}</p>
            <p>Sport: ${player?.strSport}</p>
            <p>Born: ${player?.dateBorn}</p>
            <p>Status: ${player?.strStatus}</p>
            <p>Wages: ${player?.strWage}</p>
            <p>Position: ${player?.strPosition}</p>
            <p>Description: ${player?.strDescriptionEN}</p>
        </div>
        <div class="modal-footer">
            <button onclick="clearModalData()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button onclick="handleAddToCart('${player?.strPlayer}')" type="button" class="btn btn-primary"  data-bs-dismiss="modal">Add to Group</button>
        </div>
    `;
    document.getElementById("exampleModalLabel").innerText = player?.strPlayer;
    container.appendChild(div);
};

const clearModalData = () =>{
    const container = document.getElementById("modal-body-div");
    container.innerHTML = "";


};
let srlNo = 0;
let cartName=[];
const handleAddToCart = (name) =>{

    const findName = cartName.find((fName) => fName == name);
    // console.log(findName);
    if (findName || cartCount>=11) {
        
        const errorContainer = document.getElementById("cart-error-display");
        errorContainer.innerHTML = "";
        const div = document.createElement("div");
        div.innerHTML = `
            <p class="text-danger fs-6 fst-italic">Member already added!</p>
            <p class="text-danger fs-6 fst-italic">or exceed limit of 11</p>
        `;
        errorContainer.appendChild(div);
        return;
    }
    else
    {
        cartCount++;
        srlNo++;
        const errorContainer = document.getElementById("cart-error-display");
        errorContainer.innerHTML = "";
        document.getElementById("cart-count").innerText = cartCount;
        // console.log(cartCount);
        const container = document.getElementById("cart-main-container");
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${srlNo}: ${name}</p>
        `;
        container.appendChild(div);
        cartName.push(name);
    }
    clearModalData();
};


const singlePlayer = (id) =>{
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
        .then(res=>res.json())
        .then(data=>{
            // console.log(data.players[0]);
            handleDisplayDetails(data.players[0]);
        })
        .catch((error) => {
            console.error(error);
        });
};

loadAllPlayers();
