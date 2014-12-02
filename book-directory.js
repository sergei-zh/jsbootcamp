function showBookList(bookStore) {
    var bookList = document.getElementById('book-list');
    while (bookList.hasChildNodes()) {
        bookList.removeChild(bookList.lastChild);
    }
    var books = bookStore.all();
    for (var bookIndex in books) {
        var book = books[bookIndex];
        var bookNode = generateBookNode(book);
        bookList.appendChild(bookNode);
    } 
}

function appendBook(book) {
    var bookList = document.getElementById('book-list');
    var bookNode = generateBookNode(book);
    
    bookList.appendChild(bookNode);
}

function removeBook(book) {
    var bookList = document.getElementById('book-list');
    var bookNode = document.getElementById('book-container-' + book.id);
    if (bookNode) {
        bookStore.remove(book);
        bookList.removeChild(bookNode);
    }
}

function setBookTitle(book, newTitle) {
    if (newTitle.trim() === '') {
        alert('New name cannot be empty');
    }    
    book.name = newTitle;
    switchToDisplayMode(book);
}

function switchToEditMode(book) {
    var bookNode = document.getElementById('book-container-' + book.id);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var editableGuts = generateEditableGuts(book);
        bookNode.appendChild(editableGuts);
    }
}

function switchToDisplayMode(book) {
    var bookNode = document.getElementById('book-container-' + book.id);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var displayableGuts = generateDisplayableGuts(book);
        bookNode.appendChild(displayableGuts);
    }
}

function switchToDeleteMode(book) {
    var bookNode = document.getElementById('book-container-' + book.id);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var deletableGuts = generateDeletableGuts(book);
        bookNode.appendChild(deletableGuts);
    }
}

function generateBookNode(book) {
    var bookContainer = document.createElement('li');
    bookContainer.setAttribute('id', 'book-container-' + book.id);
    var displayableGuts = generateDisplayableGuts(book);
    bookContainer.appendChild(displayableGuts);
    return bookContainer;
}

function generateDisplayableGuts(book) {
    var containerNode = document.createElement('span');
    var bookTitle = document.createTextNode(book.name);
    containerNode.appendChild(bookTitle);
    var bookEdit = document.createElement('button');
    bookEdit.setAttribute('id', 'book-edit-btn-' + book.id);
    bookEdit.appendChild(document.createTextNode('Edit'));
    bookEdit.addEventListener('click', function() {
        switchToEditMode(book);
    });
    containerNode.appendChild(bookEdit);
    var bookDelete = document.createElement('button');
    bookDelete.setAttribute('id', 'book-delete-btn-' + book.id);
    bookDelete.appendChild(document.createTextNode('Delete'));
    bookDelete.addEventListener('click', function() {
        switchToDeleteMode(book);
    });
    containerNode.appendChild(bookDelete);
    return containerNode;
}

function generateEditableGuts(book) {
    var containerNode = document.createElement('span');
    var bookTitle = document.createElement('input');
    bookTitle.value = book.name;
    containerNode.appendChild(bookTitle);
    var bookSave = document.createElement('button');
    bookSave.setAttribute('id', 'book-edit-save-btn-' + book.id);
    bookSave.appendChild(document.createTextNode('Save'));
    bookSave.addEventListener('click', function() {
        setBookTitle(book, bookTitle.value);
    });
    containerNode.appendChild(bookSave);
    var bookCancel = document.createElement('button');
    bookCancel.setAttribute('id', 'book-edit-cancel-btn-' + book.id);
    bookCancel.appendChild(document.createTextNode('Cancel'));
    bookCancel.addEventListener('click', function() {
        switchToDisplayMode(book);
    });
    containerNode.appendChild(bookCancel);
    return containerNode;
}

function generateDeletableGuts(book) {
    var containerNode = document.createElement('span');
    var bookTitle = document.createTextNode(book.name);
    containerNode.appendChild(bookTitle);
    var bookDelete = document.createElement('button');
    bookDelete.setAttribute('id', 'book-delete-confirm-btn-' + book.id);
    bookDelete.appendChild(document.createTextNode('Confirm'));
    bookDelete.addEventListener('click', function() {
        removeBook(book);
    });
    containerNode.appendChild(bookDelete);
    var bookCancel = document.createElement('button');
    bookCancel.setAttribute('id', 'book-delete-cancel-btn-' + book.id);
    bookCancel.appendChild(document.createTextNode('Cancel'));
    bookCancel.addEventListener('click', function() {
        switchToDisplayMode(book);
    });
    containerNode.appendChild(bookCancel);
    return containerNode;
}

var bookStore = new BookStore();

bookStore.add({name: 'Pride and Prejudice'});
bookStore.add({name: 'A Tale of Two Cities' });
bookStore.add({name: 'Treasure Island'});
bookStore.add({name: 'Dracula'});

showBookList(bookStore);

function appendNewBook() {
    var newBookName = document.getElementById('new-book-name').value;
    if (newBookName.trim() === '') {
        alert('Book name cannot be empty');
        return;
    }
    var newBook = {name:newBookName};
    if (bookStore.containsBook(newBook)) {
        alert('The Book is already in the directory');
        return;
    }
    var res = bookStore.add(newBook);
    if (res.length === 1) {
        appendBook(res.shift());
        document.getElementById('new-book-name').value = '';
    } else {
        alert('Unable to add the book');
    }
}

document.getElementById('new-book-append-btn').addEventListener('click', function() {
    appendNewBook();
});