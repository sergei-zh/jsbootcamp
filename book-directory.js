function BookDirectory(bookStore) {
    this._bookStore = bookStore;
}

BookDirectory.prototype.showBookList = function() {
    var self = this;
    var bookList = document.getElementById('book-list');
    while (bookList.hasChildNodes()) {
        bookList.removeChild(bookList.lastChild);
    }
    var books = self._bookStore.all();
    for (var bookIndex in books) {
        var book = books[bookIndex];
        var bookNode = self.generateBookNode(book);
        bookList.appendChild(bookNode);
    } 
};

BookDirectory.prototype.appendBook = function(book) {
    var self = this;
    var bookList = document.getElementById('book-list');
    var bookNode = self.generateBookNode(book);
    
    bookList.appendChild(bookNode);
};

BookDirectory.prototype.removeBook = function(book) {
    var self = this;
    var bookList = document.getElementById('book-list');
    var bookNode = document.getElementById('book-container-' + book.id);
    if (bookNode) {
        self._bookStore.remove(book);
        bookList.removeChild(bookNode);
    }
};

BookDirectory.prototype.setBookTitle = function(book, newTitle) {
    var self = this;
    if (newTitle.trim() === '') {
        alert('New name cannot be empty');
    }    
    book.name = newTitle;
    self.switchToDisplayMode(book);
};

BookDirectory.prototype.switchToEditMode = function(book) {
    var self = this;
    var bookNode = document.getElementById('book-container-' + book.id);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var editableGuts = self.generateEditableGuts(book);
        bookNode.appendChild(editableGuts);
    }
};

BookDirectory.prototype.switchToDisplayMode = function(book) {
    var self = this;
    var bookNode = document.getElementById('book-container-' + book.id);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var displayableGuts = self.generateDisplayableGuts(book);
        bookNode.appendChild(displayableGuts);
    }
};

BookDirectory.prototype.switchToDeleteMode = function(book) {
    var self = this;
    var bookNode = document.getElementById('book-container-' + book.id);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var deletableGuts = self.generateDeletableGuts(book);
        bookNode.appendChild(deletableGuts);
    }
};

BookDirectory.prototype.generateBookNode = function(book) {
    var self = this;
    var bookContainer = document.createElement('li');
    bookContainer.setAttribute('id', 'book-container-' + book.id);
    var displayableGuts = self.generateDisplayableGuts(book);
    bookContainer.appendChild(displayableGuts);
    return bookContainer;
};

BookDirectory.prototype.generateDisplayableGuts = function(book) {
    var self = this;
    var containerNode = document.createElement('span');
    var bookTitle = document.createTextNode(book.name);
    containerNode.appendChild(bookTitle);
    var bookEdit = document.createElement('button');
    bookEdit.setAttribute('id', 'book-edit-btn-' + book.id);
    bookEdit.appendChild(document.createTextNode('Edit'));
    bookEdit.addEventListener('click', function() {
        self.switchToEditMode(book);
    });
    containerNode.appendChild(bookEdit);
    var bookDelete = document.createElement('button');
    bookDelete.setAttribute('id', 'book-delete-btn-' + book.id);
    bookDelete.appendChild(document.createTextNode('Delete'));
    bookDelete.addEventListener('click', function() {
        self.switchToDeleteMode(book);
    });
    containerNode.appendChild(bookDelete);
    return containerNode;
};

BookDirectory.prototype.generateEditableGuts = function(book) {
    var self = this;
    var containerNode = document.createElement('span');
    var bookTitle = document.createElement('input');
    bookTitle.value = book.name;
    containerNode.appendChild(bookTitle);
    var bookSave = document.createElement('button');
    bookSave.setAttribute('id', 'book-edit-save-btn-' + book.id);
    bookSave.appendChild(document.createTextNode('Save'));
    bookSave.addEventListener('click', function() {
        self.setBookTitle(book, bookTitle.value);
    });
    containerNode.appendChild(bookSave);
    var bookCancel = document.createElement('button');
    bookCancel.setAttribute('id', 'book-edit-cancel-btn-' + book.id);
    bookCancel.appendChild(document.createTextNode('Cancel'));
    bookCancel.addEventListener('click', function() {
        self.switchToDisplayMode(book);
    });
    containerNode.appendChild(bookCancel);
    return containerNode;
};

BookDirectory.prototype.generateDeletableGuts = function(book) {
    var self = this;
    var containerNode = document.createElement('span');
    var bookTitle = document.createTextNode(book.name);
    containerNode.appendChild(bookTitle);
    var bookDelete = document.createElement('button');
    bookDelete.setAttribute('id', 'book-delete-confirm-btn-' + book.id);
    bookDelete.appendChild(document.createTextNode('Confirm'));
    bookDelete.addEventListener('click', function() {
        self.removeBook(book);
    });
    containerNode.appendChild(bookDelete);
    var bookCancel = document.createElement('button');
    bookCancel.setAttribute('id', 'book-delete-cancel-btn-' + book.id);
    bookCancel.appendChild(document.createTextNode('Cancel'));
    bookCancel.addEventListener('click', function() {
        self.switchToDisplayMode(book);
    });
    containerNode.appendChild(bookCancel);
    return containerNode;
};

BookDirectory.prototype.appendNewBook = function() {
    var self = this;
    var newBookName = document.getElementById('new-book-name').value;
    if (newBookName.trim() === '') {
        alert('Book name cannot be empty');
        return;
    }
    var newBook = {name: newBookName};
    if (self._bookStore.containsBook(newBook)) {
        alert('The Book is already in the directory');
        return;
    }
    var res = self._bookStore.add(newBook);
    if (res.length === 1) {
        self.appendBook(res.shift());
        document.getElementById('new-book-name').value = '';
    } else {
        alert('Unable to add the book');
    }
};

BookDirectory.prototype.setupAddBookListener = function() {
    var self = this;
    document.getElementById('new-book-append-btn').addEventListener('click', function() {
        self.appendNewBook();
    });
};

BookDirectory.prototype.run = function() {
    var self = this;
    self.setupAddBookListener();
    self.showBookList();
};

/*##########################################################################################*/

/* main part of code */

var bookStore = new BookStore();

bookStore.add({name: 'Pride and Prejudice'});
bookStore.add({name: 'A Tale of Two Cities' });
bookStore.add({name: 'Treasure Island'});
bookStore.add({name: 'Dracula'});

var bookDirectory = new BookDirectory(bookStore);
bookDirectory.run();
