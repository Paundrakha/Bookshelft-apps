const STORAGE_KEY = 'BOOK_LIST';

let list = [];

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert('Your browser not support local storage');
        return false
    }
    return true;
} 

function saveData() {
    const parsed = JSON.stringify(list);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null)
        list = data;
    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function makeBookObject(bookTitle, bookAuthor, bookYear, complete) {
    return {
        id: +new Date(),
        bookTitle,
        bookAuthor,
        bookYear,
        complete
    };
}

function findBook(idBook) {
    for (book of list) {
        if (book.id === idBook)
            return book;
    }
    return null;
}

function findBookIndex(idBook) {
    let index = 0
    for (book of list) {
        if (book.id === idBook)
            return index;

         index++;    
         
    }
    return -1
}

function refreshDataFromList() {
    const bookUnread = document.getElementById(ID_UNREAD);
    const bookRead = document.getElementById(ID_READ);
    for (book of list) {
        const newBook = makeBook(book.bookTitle, book.bookAuthor, book.bookYear, book.complete);
        newBook[BOOK_ISIID] = book.id;
        if (book.complete) {
            bookRead.append(newBook);

        } else {
            bookUnread.append(newBook);
        }
    }
}