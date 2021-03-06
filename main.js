const tBody     = document.querySelector(".js-table-body");
const popup     = document.getElementById("js-popup");
const phone     = document.querySelector(".js-form-phone");
const name      = document.querySelector(".js-form-name");
const email     = document.querySelector(".js-form-email");
const address   = document.querySelector(".js-form-address");
const phone2    = document.querySelector(".js-form-phone-edit");
const name2     = document.querySelector(".js-form-name-edit");
const email2    = document.querySelector(".js-form-email-edit");
const address2  = document.querySelector(".js-form-address-edit");

//стартовый массив для тестирования
let initialArr = [
    {phone: "380123456780", name: "Ilya Kalimin", email: "Dansleymeplz@gmail.com", address: "Kiev, Khreschatyk St, 20"},
    {phone: "380123456733", name: "Egor Drujinnikov", email: "Drug@geek.com", address: "Lviv, Dvorova 12"},
    {phone: "380123456722", name: "Voloboev Nikita", email: "Nikita@geek.com", address: "NY, 5th Ave, 38"},
    {phone: "380123456744", name: "Olena Pidlasa", email: "Pidlasa@gmail.com", address: "Mykolaiv, Saint Paul"},
    {phone: "380123456711", name: "Irene Herbey", email: "Herbey@mail.com", address: "Odessa, Kozak 30"},
]

if (localStorage.getItem('data') == null) {
    localStorage.setItem('data', JSON.stringify(initialArr));
}

//паттерны для валидации
const regPhone = /^380\d{3}\d{2}\d{2}\d{2}$/;
const regName = /[A-Za-z]{1,15}\s[A-Za-z]{1,15}$/;
const regEmail = /\S+@\S+\.\S+$/;
const regAddress = /[A-Za-z0-9]{3,30}/;

function validationControl (phone, name, email, address, errorMessage, myFunction) {
    function hideMessage() {
        errorMessage.style.visibility = "hidden";
    }

    if( regPhone.test(phone) && regName.test(name) && regEmail.test(email) && regAddress.test(address)){
        myFunction();
    } else {
        if(regPhone.test(phone)) {
            errorMessage.style.top = "90px";
            errorMessage.textContent = "введите имя и фамилию!";
            if(regName.test(name)) {
                errorMessage.style.top = "140px";
                errorMessage.textContent = "не верный формат ввода емейла!";
                if(regEmail.test(email)) {
                    errorMessage.style.top = "188px";
                    errorMessage.textContent = "введите адресс!";
                }
            }
        } else {
            errorMessage.style.top = "40px";
            errorMessage.textContent = "не верно введенный номер!";
        }

        errorMessage.style.visibility = "visible";
        setTimeout(hideMessage, 2000);
    }
}

document.querySelector('.form__button').onclick = (e) => {
    e.preventDefault();
    let errorMessage = document.getElementById("js-form-error");

    validationControl(phone.value, name.value, email.value, address.value, errorMessage, addData);
}

document.querySelector('.form__button-edit').onclick = (e) => {
    e.preventDefault();
    let errorMessage = document.getElementById("js-form-error-edit");

    validationControl(phone2.value, name2.value, email2.value, address2.value, errorMessage, editData);
}

function searchData() {
    let searchData = document.getElementById("searchInput");
    let searchDataUpperCase = searchData.value.toUpperCase();

    let data = JSON.parse(localStorage.getItem('data'));
    tBody.innerHTML = '';
    for(let i = 0; i < data.length; i++) {
        if(data[i].phone.toUpperCase().indexOf(searchDataUpperCase) > -1
            || data[i].name.toUpperCase().indexOf(searchDataUpperCase) > -1
            || data[i].email.toUpperCase().indexOf(searchDataUpperCase) > -1
            || data[i].address.toUpperCase().indexOf(searchDataUpperCase) > -1) {
            tBody.innerHTML +=
                `<div class="table__row">
                    <div>${data[i].phone}</div>
                    <div>${data[i].name}</div>
                    <div>${data[i].email}</div>
                    <div>${data[i].address}</div>
                    <div>
                        <span class="table__row-edit" onclick="popupEdit(${i})">Edit</span>
                        <span>&nbsp;|&nbsp;</span>
                        <span class="table__row-delete" onclick="deleteData(${i})">Delete</span>
                    </div>
                </div>`;
        }
    }
}

function render(data) {
    tBody.innerHTML = '';
    if (data) {
        for (let i = 0; i < data.length; i++) {
            tBody.innerHTML +=
                `<div class="table__row">
                    <div>${data[i].phone}</div>
                    <div>${data[i].name}</div>
                    <div>${data[i].email}</div>
                    <div>${data[i].address}</div>
                    <div>
                        <span class="table__row-edit" onclick="popupEdit(${i})">Edit</span>
                        <span>&nbsp;|&nbsp;</span>
                        <span class="table__row-delete" onclick="deleteData(${i})">Delete</span>
                    </div>
                </div>`;
        }
    }
}

function editData() {
    deleteData(myId);
    let upperNameControl = name2.value.split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ');

    let newData = {
        phone: phone2.value,
        name: upperNameControl,
        email: email2.value,
        address: address2.value
    };

    let oldData = JSON.parse(localStorage.getItem('data'));
    oldData.push(newData);

    localStorage.setItem("data", JSON.stringify(oldData));
    render(JSON.parse(localStorage.getItem("data")));

    popup.classList.toggle("show");
}

function deleteData(id) {
    let data = JSON.parse(localStorage.getItem('data'));
    data.splice(id, 1);

    localStorage.setItem("data", JSON.stringify(data));
    render(JSON.parse(localStorage.getItem("data")));
}

function addData() {
    let upperNameControl = name.value.split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ');

    console.log(upperNameControl);
    let newData = {
        phone: phone.value,
        name: upperNameControl,
        email: email.value,
        address: address.value
    };

    phone.value = '';
    name.value = '';
    email.value = '';
    address.value = '';


    let oldData = JSON.parse(localStorage.getItem('data'));
    oldData.push(newData);

    localStorage.setItem("data", JSON.stringify(oldData));
    render(JSON.parse(localStorage.getItem("data")));
}

//флаги для контроля сортировки от меньшего к большему и наоборот
let flagForSort = true;
let fieldControl;
function sortByColumn(field) {
    if(field !== fieldControl){
        flagForSort = true;
    }
    fieldControl = field;

    let data = JSON.parse(localStorage.getItem('data'));

    data.sort(SortByField(field));

    localStorage.setItem("data", JSON.stringify(data));
    render(JSON.parse(localStorage.getItem("data")));
}

function SortByField(field) {
    if (flagForSort) {
        flagForSort = !flagForSort;
        if (field === 'phone') {
            return (a, b) => a[field] - b[field];
        }
        return (a, b) => a[field] > b[field] ? 1 : -1;
    } else {
        flagForSort = !flagForSort;
        if (field === 'phone') {
            return (a, b) => b[field] - a[field];
        }
        return (a, b) => a[field] < b[field] ? 1 : -1;
    }
}

//id для контроля даных попадающих в форму для изменения
let myId = null;
function popupEdit(id) {
    popup.classList.toggle("show");

    let data = JSON.parse(localStorage.getItem('data'));

    document.querySelector(".form__phone2").value = data[id].phone;
    document.querySelector(".form__name2").value = data[id].name;
    document.querySelector(".form__email2").value = data[id].email;
    document.querySelector(".form__address2").value = data[id].address;

    myId = id;
}

function closePopup() {
    popup.classList.toggle("show");
}

render(JSON.parse(localStorage.getItem("data")));