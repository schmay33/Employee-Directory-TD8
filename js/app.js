let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, id, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");



function attachListeners() {
    gridContainer.addEventListener("click", (e) => {
        // make sure the click is not on the gridContainer itself
        if (e.target.classList.contains("card") || e.target.closest(".card")) {
            // select the card element based on its proximity to actual element clicked
            const card = e.target.closest(".card");
            const ssn = card.getAttribute("data-index");
            const index = employees.findIndex(employee => employee.id.value === ssn);
            displayModal(index);
        }
    });
    
    modalClose.addEventListener("click", () => {
        overlay.classList.add("hidden");
    });
}


// fetch data from API
fetch(urlAPI)
	.then((res) => res.json())
	.then((res) => res.results)
    .then(displayEmployees)
    .then(addSearch)
    .then(attachListeners)
	.catch((err) => console.log(err));

function displayEmployees(employeeData) {
	employees = employeeData;
	// store the employee HTML as we create it
	addEmployeesToDOM(employees);
}

function addEmployeesToDOM(list) {
	let employeeHTML = "";
    // loop through each employee and create HTML markup
    list.forEach((employee, index) => {
		let name = employee.name;
		let email = employee.email;
		let city = employee.location.city;
        let picture = employee.picture;
        let id = employee.id;
		// template literals make this so much cleaner!
		employeeHTML += `
        <div class="card" data-index="${id.value}">
            <img class="avatar" src="${picture.large}" />
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
            </div>
        </div>
        `;
	});
	gridContainer.insertAdjacentHTML("afterbegin", employeeHTML);
}

function displayModal(index) {
	// use object destructuring make our template literal cleaner
	let {
		name,
		dob,
		phone,
		email,
        location: {
            city,
            street,
            state,
            postcode
        },
		picture,
	} = employees[index];
	let date = new Date(dob.date);
	const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr />
        <p>${phone}</p>
        <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
        <p>Birthday:
        ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    `;
	overlay.classList.remove("hidden");
	modalContainer.innerHTML = modalHTML;
}

function addSearch() {
    let form = document.createElement("form");
    form.noValidate = true;
    form.addEventListener('submit', search);
    let inputSubmit = document.createElement("input");
    let inputText = document.createElement("input");
    inputText.type = "search";
    inputText.id = "search-input";
    inputText.classList.add("search-input");
    inputText.placeholder = "Search...";
    inputSubmit.type = "submit";
    inputSubmit.id = "search-submit";
    inputSubmit.classList.add("search-submit");
    inputSubmit.value = "🔍";
    form.append(inputText);
    form.append(inputSubmit);
    //console.log(form);
    document.getElementsByClassName("search-container")[0].append(form);
}

function search(e) {
    e.preventDefault();
    const term = e.target[0].value;
    let results = employees.filter(checkName);
    removeElementsByClass("card");
    addEmployeesToDOM(results);

    function checkName(employee) {
        let fullName = employee.name.first + " " + employee.name.last;
        fullName = fullName.toLowerCase();
        if (fullName.includes(term.toLowerCase())) {
            return true;
        } else {
            return false;
        }
    }

    function removeElementsByClass(className){
        const elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
}