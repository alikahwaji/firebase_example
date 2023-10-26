import {
getFirestore,
collection,
addDoc,
onSnapshot,
doc,
updateDoc,
deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"

const db = getFirestore()
const dbRef = collection(db, "contacts")

//TODO -  App View

const leftCol = document.getElementById("left-col")
const backBtn = document.getElementById("back-btn")


backBtn.addEventListener('click', (e) => {
leftCol.style.display = "block"
rightCol.style.display = "none"
})

const toggleLeftAndRightViewsOnMobile = () => {
if(document.body.clientWidth <= 600) {
leftCol.style.display = "none"
rightCol.style.display = "block"
}
}


//SECTION -  Data

let contacts = []

const getContacts = async () => {
try {
//
await onSnapshot(dbRef, (docsSnap) => {
contacts = []

docsSnap.forEach((doc) => {
const contact = doc.data()
contact.id = doc.id
contacts.push(contact)
})
showContacts(contacts)
})
} catch(err) {
console.log(`Get Contacts ${err}`)
}
}

getContacts()

//SECTION - Display Contacts as list item

const contactList = document.getElementById("contact-list")

const showContacts = (contact) => {

contacts.forEach((contact) => {

const li = `
  <li class="contact-list-item" id="${contact.id}">
  <div class="media">
  <div class="letter">
  ${contact.firstname.charAt(0)}${contact.lastname.charAt(0)}
  </div>
  </div>
  <div class="content">
  <div class="title">
  ${contact.firstname} ${contact.lastname}
  </div>
  <div class="sub-title">${contact.email}</div>
  </div>

  <div class="action">
  <button class="edit-user">Edit</button>
  <button class="delete-user">Delete</button>
  </div>
  </li>
`
contactList.innerHTML += 1
})
}

//SECTION - Click event for list item

const contactListPressed = (event) => {
  const id = event.target.closest("li").getAttribute("id")

  if(event.target.className === "edit-user") {
  editButtonPressed(id)
  } else if (event.target.className === "delete-user") {
  deleteButtonPressed(id)
  } else {
  displayContactOnDetailsView(id)
  toggleLeftAndRightViewsOnMobile()
  }
}

contactList.addEventListener("click", contactListPressed)

//SECTION - Delete button

const deleteButtonPressed = async (id) => {

const isConfirmed = confirm("Are you sure you ant to delete it?")

if(isConfirmed) {

try{
const docRef = doc(db, "contacts", id)
await deleteDoc(docRef)

} catch(e) {
setErrorMessage(
"error",
"Unable to delete the contact information!"
)
displayErrorMessage()
}
}
}

//SECTION - Edit button

const editButtonPressed = (id) => {
modalOverlay.style.display = "flex"
const contact = getContact(id)

firstname.value = contact.firstname
lastname.value = contact.lastname
age.value = contact.age
phone.value = contact.phone
email.value = contact.email

modalOverlay.setAttribute("contact-id", contact.id)
}

// SECTION - Display Information on list item click
const rightCol = document.getElementById('right-col')

const getContact = (id) => {
  return contacts.find((contact) => {
    return contact.id === id
  })
}

const displayContactOnDetailsView = (id) => {
const contact = getContact(id)
}

//TODO - Display on the Right Col title

const rightColTitle = rightCol.querySelector(".title")
rightColTitle.innerHTML = contact.firstname

const rightColDetail = document.getElementById("right-col-detail")
rightColDetail.innerHTML = `
              <div class="label">Name:</div>
              <div class="data">${contact.firstname} ${contact.lastname}</div>

              <div class="label">Age:</div>
              <div class="data">${contact.age}</div>

              <div class="label">Phone:</div>
              <div class="data">${contact.phone}</div>

              <div class="label">Email:</div>
              <div class="data">${contact.email}</div>
`

// NOTE MODAL CARD

const addBtn = document.querySelector('.add-btn')
const modalOverlay = document.getElementById('modal-overlay')
const closeBtn = document.querySelector('.close-btn')

const addButtonPressed = () => {

modalOverlay.style.display = "flex"
modalOverlay.removeAttribute("contact-id")
firstname.value = ""
lastname.value = ""
age.value = ""
phone.value = ""
email.value = ""
}

const closeButtonPressed = () => {
modalOverlay.style.display = "none"
}

const hideModal = (e) => {
if( e instanceof Event) {
  if(e.target === e.currentTarget) {
    modalOverlay.style.display = "none"
  }
} else {
modalOverlay.style.display = "none"
}
}

addBtn.addEventListener("click", addButtonPressed)
closeBtn.addEventListener("click", closeButtonPressed)
modalOverlay.addEventListener("click", hideModal)

// TODO Validation Data

const saveBtn = document.querySelector('.save-btn')
const error = {}

const firstname = document.getElementById("firstname"),
lastname = document.getElementById("lastname"),
phone = document.getElementById("phone"),
age = document.getElementById("age"),
email = document.getElementById("email")

const saveButtonPressed = async () => {
  checkRequired([firstname, lastname, email, age, phone])
  checkEmail(email)
  checkInputLength(age, 3, 1)
  checkInputLength(phone, 15, 9)
  showErrorMessage(error)

  if(Object.keys(error).length === 0) {
    if(modalOverlay.getAttribute("contact-id")) {
      //NOTE Update data
      const docRef = doc(
      db,
      "contacts",
      modalOverlay.getAttribute("contact-id")
      )

      try{
      await updateDoc(docRef, {
      firstname: firstname.value,
      lastname: lastname.value,
      age: age.value,
      phone: phone.value,
      email: email.value
      })
      hideModal()
      } catch(e) {
      setErrorMessage(
      "error",
      "Unable to update user information, please try later!"
      )
      showErrorMessage()
      }
    } else {
    // TODO add data if not provided!

    try {
    await addDoc(dbRef, {
    firstname: firstname.value,
    lastname: lastname.value,
    age: age.value,
    phone: phone.value,
    email: email.value
    })
    hideModal()
    } catch(err) {
    setErrorMessage(
    "error",
    "Unable to add user information. Please try later!"
    )
    showErrorMessage()
    }
    }
  }
}

const checkRequired = (inputArray) => {
  inputArray.forEach((input) => {
  if(input.value.trim() === "") {
    setErrorMessage(input, input.id + " Is empty")
  } else {
  deleteErrorMessage(input)
  }
  })
}

const checkEmail = (input) => {
if(input.value.trim() !== "") {
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
if(re.test(input.value.trim())) {
deleteErrorMessage(input)
} else {
showErrorMessage(input, input.id + "Is invalid")
}
}
}

const checkInputLength = (input, MaxNum, MinNum)  => {
if(input.value.trim() !== "") {
if(input.value.trim().length >= MinNum && input.value.trim().length <= MaxNum) {
deleteErrorMessage(input)
} else {
setErrorMessage(input, input.id + `must be between ${MinNum} and ${MaxNum} digits`)
}
}
}

const deleteErrorMessage = (input) => {
delete error[input.id]
input.style.border = "1px solid green"
}


const setErrorMessage = (input, message) => {
if(input.nodeName === "INPUT") {
error[input.id] = message
input.style.border = "1px solid red"
} else {
error[input] = message
}
}
// function showErrorMessage(){}
const showErrorMessage = () => {

}
