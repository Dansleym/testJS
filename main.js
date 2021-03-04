const tBody     = document.querySelector(".js-table-body");
const phone     = document.querySelector(".js-form-phone");
const name      = document.querySelector(".js-form-name");
const email     = document.querySelector(".js-form-email");
const address   = document.querySelector(".js-form-address");
const popup     = document.getElementById("js-popup");

let myId = null;

const regPhone = /^380\d{3}\d{2}\d{2}\d{2}$/;
const regName = /[A-Za-z]{1,15}\s[A-Za-z]{1,15}$/;
const regEmail = /\S+@\S+\.\S+$/;
const regAddress = /[A-Za-z0-9_]{3,40}$/;

document.querySelector('.form__button').onclick = (e) => {
    e.preventDefault();
    if( regPhone.test(phone.value) && regName.test(name.value) && regEmail.test(email.value) && regAddress.test(address.value)){
        addData();
    } else {
        phone.style.border = "3px solid red";
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

    let newData = {
        phone: document.querySelector(".form__phone2").value,
        name: document.querySelector(".form__name2").value,
        email: document.querySelector(".form__email2").value,
        address: document.querySelector(".form__address2").value
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
    let newData = {
        phone: phone.value,
        name: name.value,
        email: email.value,
        address: address.value
    };

    phone.value = '';
    name.value = '';
    email.value = '';
    address.value = '';

    if (localStorage.getItem('data') == null) {
        localStorage.setItem('data', '[]');
    }

    let oldData = JSON.parse(localStorage.getItem('data'));
    oldData.push(newData);

    localStorage.setItem("data", JSON.stringify(oldData));
    render(JSON.parse(localStorage.getItem("data")));
}

let flagForSort = true;
let fieldControll;
function sortByColumn(field) {
    if(field !== fieldControll){
        flagForSort = true;
    }
    fieldControll = field;

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