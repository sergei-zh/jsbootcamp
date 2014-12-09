define(["./book-store"], function(BookStore) {
"use strict";

function BookDirectory(bookStore) {
    this._bookStore = bookStore;
}

var _bdp = BookDirectory.prototype;
        
_bdp.showBookList = function() {
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

_bdp.appendBook = function(book) {
    var self = this;
    var bookList = document.getElementById('book-list');
    var bookNode = self.generateBookNode(book);
    
    bookList.appendChild(bookNode);
};

_bdp.removeBook = function(bookId) {
    var self = this;
    var bookList = document.getElementById('book-list');
    var bookNode = document.getElementById('book-container-' + bookId);
    if (bookNode) {
        self._bookStore.remove(bookId);
        bookList.removeChild(bookNode);
    }
};

_bdp.renameBook = function(bookId) {
    var self = this;
    var bookNameInput = document.getElementById('inp-book-new-name-' + bookId);
    if (bookNameInput) {
        var bookName = bookNameInput.value;
        var book = self._bookStore.findBooksById(bookId)[0];
        self.setBookTitle(book, bookName);
    }
};

_bdp.setBookTitle = function(bookId, newTitle) {
    var self = this;
    if (newTitle.trim() === '') {
        alert('New name cannot be empty');
        return;
    }    
    var book = self._bookStore.findBooksById(bookId)[0];
    book.name = newTitle;
    self.switchToDisplayMode(bookId);
};

_bdp.switchToEditMode = function(bookId) {
    var self = this;
    var bookNode = document.getElementById('book-container-' + bookId);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var book = self._bookStore.findBooksById(bookId)[0];
        var editableGuts = self.generateEditableGuts(book);
        bookNode.appendChild(editableGuts);
    }
};

_bdp.switchToDisplayMode = function(bookId) {
    var self = this;
    var bookNode = document.getElementById('book-container-' + bookId);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var book = self._bookStore.findBooksById(bookId)[0];
        var displayableGuts = self.generateDisplayableGuts(book);
        bookNode.appendChild(displayableGuts);
    }
};

_bdp.switchToDeleteMode = function(bookId) {
    var self = this;
    var bookNode = document.getElementById('book-container-' + bookId);
    if (bookNode) {
        while (bookNode.hasChildNodes()) {
            bookNode.removeChild(bookNode.lastChild);
        }
        var book = self._bookStore.findBooksById(bookId)[0];
        var deletableGuts = self.generateDeletableGuts(book);
        bookNode.appendChild(deletableGuts);
    }
};

_bdp.generateBookNode = function(book) {
    var self = this;
    var bookContainer = document.createElement('li');
    bookContainer.setAttribute('id', 'book-container-' + book.id);
    var displayableGuts = self.generateDisplayableGuts(book);
    bookContainer.appendChild(displayableGuts);
    return bookContainer;
};

_bdp.generateDisplayableGuts = function(book) {
    var self = this;
    var template = document.getElementById('tmpl-book-display').innerHTML;
    var html = template
                    .replace(/{{book.name}}/g, book.name)
                    .replace(/{{book.id}}/g, book.id);
    var containerNode = document.createElement('span');
    containerNode.innerHTML = html;
    containerNode.querySelector('.button-edit').addEventListener('click', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.switchToEditMode(bookId);
    });
    containerNode.querySelector('.button-delete').addEventListener('click', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.switchToDeleteMode(bookId);
    });
    return containerNode;
};

_bdp.generateEditableGuts = function(book) {
    var self = this;
    var template = document.getElementById('tmpl-book-edit').innerHTML;
    var html = template
                    .replace(/{{book.name}}/g, book.name)
                    .replace(/{{book.id}}/g, book.id);
    var containerNode = document.createElement('span');
    containerNode.innerHTML = html;
    var bookName = containerNode.querySelector('.input-book-new-name');
    containerNode.querySelector('.form-book-edit').addEventListener('submit', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.setBookTitle(bookId, bookName.value);
        e.preventDefault();
    });
    containerNode.querySelector('.button-edit-cancel').addEventListener('click', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.switchToDisplayMode(bookId);
    });
    return containerNode;
};

_bdp.generateDeletableGuts = function(book) {
    var self = this;
    var template = document.getElementById('tmpl-book-delete').innerHTML;
    var html = template
                    .replace(/{{book.name}}/g, book.name)
                    .replace(/{{book.id}}/g, book.id);
    var containerNode = document.createElement('span');
    containerNode.innerHTML = html;
    containerNode.querySelector('.button-delete-confirm').addEventListener('click', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.removeBook(bookId);
    });
    containerNode.querySelector('.button-delete-cancel').addEventListener('click', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.switchToDisplayMode(bookId);
    });
    return containerNode;
};

_bdp.appendNewBook = function() {
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

_bdp.setupAddBookListener = function() {
    var self = this;
    document.getElementById('bs-add-book-form').addEventListener('submit', function(evt) {
        evt.preventDefault();
        self.appendNewBook();
    });
};

_bdp.run = function() {
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

});