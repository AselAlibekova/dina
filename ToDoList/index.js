document.addEventListener('DOMContentLoaded', async function() {
    main.hidden=true
});

const main=document.querySelector('.main');
const loginContainer=document.querySelector('#loginForm');
const registrationContainer=document.querySelector('#registrationForm');
document.querySelector('#loginBtn').addEventListener("click", login);


document.querySelector('#registerBtn').addEventListener("click", registration);

document.querySelector(".addBtn").addEventListener("click", function() {
    addBtn();
});

document.querySelector(".changeBtn").addEventListener("click", function() {
    changeBtn();
});

document.querySelector("#cancel").addEventListener("click", function() {
    cancelBtn();
});



var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

function toggleForm() {
    var loginForm = document.getElementById('loginForm');
    var registrationForm = document.getElementById('registrationForm');
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registrationForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registrationForm.style.display = 'block';
    }
}

async function login() {
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    try {
        user = await Login(loginEmail);

        if (user) {
            console.log(user.password);
            if (user.password === loginPassword) {
                loginContainer.style.display='none'
                loginContainer.hidden = true;
                main.hidden = false;
                alert('Login successful');
                await getTasks(user._id);
                await getCompletedTasks(user._id);
            } else {
                alert('Incorrect password');
            }
        } else {
            alert('User not found');
        }
    } catch (error) {
        console.error('Error logging in', error);
    }

    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

document.querySelector("#submit").addEventListener("click", function() {
    console.log(user)
    if (!user) {
        console.error('User is not defined');
        return;
    }

    const userId = user._id;
    console.log(userId);
    postTask(userId);
    $('.dialog').attr('close', true);
});


async function registration() {
    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const isUnique = await checkEmailUnique(email);
    
    if (!isUnique) {
        alert('Email is already in use. Please choose a different email.');
        return;
    }

    await Registration(name, email, password);
    alert('Registration was successful');

 
    const newUser = await Login(email);
    if (newUser) {
        await getTasks(newUser._id);
        await getCompletedTasks(newUser._id);

     
        registrationContainer.style.display = 'none';
        main.hidden = false;
    } else {
        console.error('Error: User not found after registration');
    }

    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
}




function changeBtn() {
    loginContainer.style.display='block'
    loginContainer.hidden=false
    main.hidden=true;
}

function addBtn() {
    $('.dialog').attr('close', false);
    $('.dialog').attr('open', true);

}

function cancelBtn() {
    $('.dialog').attr('open', false)
    $('.dialog').attr('close', true)

}

async function sendGETRequest() {
    try {
        const response = await fetch('http://localhost:3005/api/getBlogs');
        const data = await response.json();
        document.getElementById('getResponse').innerText = JSON.stringify(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function sendPOSTRequest() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;
    try {
        const response = await fetch('http://localhost:3005/api/postBlogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, age, email })
        });
        const data = await response.json();
        document.getElementById('postResponse').innerText = JSON.stringify(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function sendPUTRequest() {
    const name = document.getElementById('putName').value;
    const age = document.getElementById('putAge').value;
    const email = document.getElementById('putEmail').value;
    try {
        const response = await fetch(`http://localhost:3005/api/putBlogs/${name}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ age, email })
        });
        const data = await response.json();
        document.getElementById('putResponse').innerText = JSON.stringify(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function sendDELETERequest() {
    const name = document.getElementById('deleteName').value;
    try {
        const response = await fetch(`http://localhost:3005/api/deleteBlogs/${name}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        document.getElementById('deleteResponse').innerText = JSON.stringify(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function Login(loginEmail) {
    try {
        const response = await fetch(`http://localhost:3000/api/login/${loginEmail}`);
        const data = await response.json();
        return data.user; 
    } catch (error) {
        console.error('Error logging in', error);
    }
}


async function Registration(name, email, password) {
    try {
        const response = await fetch(`http://localhost:3000/api/postUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
    } catch (error) {
        console.error('Error registering', error);
    }
}

async function checkEmailUnique(email) {
    try {

        const response = await fetch(`http://localhost:3000/api/checkEmailUnique/${email}`);
        const data = await response.json();
        

        return data.isUnique;
    } catch (error) {
        console.error('Error checking email uniqueness:', error);
        return false;
    }
}