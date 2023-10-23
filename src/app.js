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
