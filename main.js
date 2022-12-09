const inputBook = document.getElementById("input-sesi");
const inputSubmit = document.getElementById("submit");
const ID_READ = "read";
const ID_UNREAD = "unread";
const BOOK_ISIID = "isiid";

function addBook() {
    const bookRead = document.getElementById(ID_READ);
    const bookUnread = document.getElementById(ID_UNREAD);
    const checkBox = document.getElementById('inputCheckbox');
    const inputTitle = document.getElementById("title").value;
    const inputAuthor = document.getElementById("author").value;
    const inputYear = document.getElementById("year").value;

    if(!checkBox.checked) {
        const book = makeBook(inputTitle, inputAuthor, inputYear, false)
        const bookObject = makeBookObject(inputTitle, inputAuthor, inputYear, false)
        book[BOOK_ISIID] = bookObject.id;
        list.push(bookObject);
        bookUnread.append(book);
        
    } else {
        const book = makeBook(inputTitle, inputAuthor, inputYear, true)
        const bookObject = makeBookObject(inputTitle, inputAuthor, inputYear, true)
        book[BOOK_ISIID] = bookObject.id;
        list.push(bookObject);
        bookRead.append(book);
       
    }
    updateDataToStorage();
}

function deleteForm() {
    document.getElementById('title').value = ""; 
    document.getElementById('author').value = "";
    document.getElementById('year').value = "";
    document.getElementById('inputCheckbox').checked = false;
}

function makeBook(title, author, year, complete) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = title;
    const authorName = document.createElement('p');
    authorName.innerText = author;
    const bookYear = document.createElement('p2');
    bookYear.innerText = `${year}`;
    const detailBook = document.createElement('div');
    detailBook.classList.add('detail-book')
    detailBook.append(bookTitle, authorName, bookYear);
    const actionBook = document.createElement("div");
    actionBook.classList.add("action");
    const container = document.createElement("article");
    container.classList.add("book-item");
    container.append(detailBook, actionBook);

    if(complete) {
        actionBook.append(
            createUndoButton(),
            createTrashButton(),

        );
    } else {
        actionBook.append(
            createChecklistButton(),
            createTrashButton(),
        );
    }
    return container;
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function(event) {
        eventListener(event);
    });
    return button;
}

function addBookComplete(bookElement) {
    const bookRead = document.getElementById(ID_READ);
    const bookTitle = bookElement.querySelector('.detail-book > h3').innerText;
    const bookAuthor = bookElement.querySelector('.detail-book > p').innerText;
    const bookYear = bookElement.querySelector('.detail-book > p2').innerText;
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ISIID]);
    book.complete = true;
    newBook[BOOK_ISIID] = book.id;
    bookRead.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function removeBookComplete(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ISIID]);
    list.splice(bookPosition, 1);
    bookElement.remove();
    updateDataToStorage();
}

function createChecklistButton() {
    return createButton('centang', function(event) {
        const parent = event.target.parentElement;
        addBookComplete(parent.parentElement);
    });
}

function createTrashButton() {
    return createButton('sampah', function(event) {
        const parent = event.target.parentElement;
        removeBookComplete(parent.parentElement);
    });
}

function undoBookComplete(bookElement) {
    const bookUnread = document.getElementById(ID_UNREAD);
    const bookTitle = bookElement.querySelector('.detail-book > h3').innerText;
    const bookAuthor = bookElement.querySelector('.detail-book > p').innerText;
    const bookYear = bookElement.querySelector('.detail-book > p2').innerText;
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
    const book = findBook(bookElement[BOOK_ISIID]);
    book.complete = false;
    newBook[BOOK_ISIID] = book.id;
    bookUnread.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function createUndoButton() {
    return createButton('undo', function(event) {
        const parent = event.target.parentElement;
        undoBookComplete(parent.parentElement);
    });
}



document.addEventListener("DOMContentLoaded", function() {
    const inputBook = document.getElementById('submit');
    inputBook.addEventListener('click', function(event) {
        event.preventDefault();
        addBook();
        deleteForm();
    });
    if(isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener('ondatasaved', () => {
    console.log('Data berhasil disimpan');
});

document.addEventListener('ondataloaded', () => {
    refreshDataFromList();
});

