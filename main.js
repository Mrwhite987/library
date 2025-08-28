let myLibrary = [];
// let displayedBookUUID = [];

function Book(title, author, pages, read = false) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.uuid = crypto.randomUUID();
  this.info = function () {
    let readStatus = "";
    if (read) {
      readStatus = "not read yet";
    } else {
      readStatus = "have read";
    }
    const info = `${this.title} by ${this.author}, ${this.pages} pages, ${readStatus}`;
    return info;
  };
}

Book.prototype.toggleReadStatus = function () {
  this.read = !this.read;
};

function addBookToLibrary(title, author, pages, read = false) {
  // take params, create a book then store it in the array
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
  // console.log(newBook.uuid);
}

addBookToLibrary("Dune", "Frank Herbert", 688, false);
addBookToLibrary("Neuromancer", "William Gibson", 271, false);
addBookToLibrary("The Martian", "Andy Weir", 369, false);

displayBooks(myLibrary);

function displayBooks(bookArray) {
  const displayContainer = document.querySelector(".book-shelf");
  displayContainer.textContent = "";
  for (let book of bookArray) {
    const bookCard = createBookCard(book);
    displayContainer.append(bookCard);
  }
}

function createBookCard(book) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("book-card");

  const bookCover = document.createElement("div");
  bookCover.classList.add("book-cover");

  const bookInfo = document.createElement("div");
  bookInfo.classList.add("book-info");

  const bookTitle = document.createElement("h2");
  bookTitle.textContent = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = `by ${book.author}`;

  const bookPages = document.createElement("p");
  bookPages.textContent = `${book.pages} pages`;

  // Read status text
  const bookStatus = document.createElement("p");
  bookStatus.textContent = book.read ? "Status: Read ✅" : "Status: Unread ❌";

  //Form
  const readCheckForm = document.createElement("form");

  const checkboxId = `mark-as-read-${book.uuid}`;

  const readLabel = document.createElement("label");
  readLabel.textContent = "Mark as read: ";
  readLabel.setAttribute("for", checkboxId);

  const readCheckbox = document.createElement("input");
  readCheckbox.type = "checkbox";
  readCheckbox.checked = book.read;
  readCheckbox.id = checkboxId;

  // Toggle logic
  readCheckbox.addEventListener("change", () => {
    book.toggleReadStatus(); // update book object
    bookStatus.textContent = book.read
      ? "Status: Read ✅"
      : "Status: Unread ❌"; // update text in UI
  });

  readCheckForm.append(readLabel, readCheckbox);

  const bookRemoveBtn = document.createElement("button");
  bookRemoveBtn.textContent = "Remove";
  bookRemoveBtn.className = "remove-book";
  bookRemoveBtn.id = book.uuid;

  bookInfo.append(
    bookTitle,
    bookAuthor,
    bookPages,
    bookStatus,
    readCheckForm,
    bookRemoveBtn
  );
  bookCard.append(bookCover, bookInfo);
  return bookCard;
}

const openAddNewBookDialogBtn = document.getElementById("open-dialog-button");
const cancelBtn = document.getElementById("cancel-btn");
const addBookDialog = document.getElementById("add-book");
const newBookForm = document.getElementById("new-book-form");

// Open dialog
openAddNewBookDialogBtn.addEventListener("click", () =>
  addBookDialog.showModal()
);

// Cancel closes dialog
cancelBtn.addEventListener("click", () => addBookDialog.close());

// Handle form submission
newBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(newBookForm);
  const book = Object.fromEntries(formData.entries());
  let read = false;
  if (book["read-status"] == "read") {
    read = true;
  }
  addBookToLibrary(book.title, book.author, Number(book.pages), read);
  displayBooks(myLibrary);
  addBookDialog.close();
});

const displayContainer = document.querySelector(".book-shelf");

displayContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-book")) {
    const uuid = e.target.id;
    myLibrary = myLibrary.filter((book) => book.uuid !== uuid);
    displayBooks(myLibrary);
  }
});
