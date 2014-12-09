define(["./book-store"], function(BookStore) {
"use strict";

function BookDirectory(bookStore) {
    var self = this;
    self._bookStore = bookStore;
    
    self._bookStore.getEventEmitter().subscribe('book-added', function(book){
        self.appendBook(book);
    });
    self._bookStore.getEventEmitter().subscribe('book-deleted', function(book){
        self.removeBook(book);
    });
}

var _bdp = BookDirectory.prototype;
     
_bdp.cleanNode = function(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
};
     
_bdp.getBookListNode = function() {
    return document.getElementById('book-list');
};

_bdp.getBookNode = function(bookId) {
    return document.getElementById('book-container-' + bookId);
};
     
_bdp.showBookList = function() {
    var self = this;
    var bookListNode = self.getBookListNode();
    self.cleanNode(bookListNode);
    var books = self._bookStore.getAllBooks();
    for (var bookIndex in books) {
        var book = books[bookIndex];
        var bookNode = self.generateBookNode(book);
        bookListNode.appendChild(bookNode);
    } 
};

_bdp.appendBook = function(book) {
    var self = this;
    var bookNode = self.generateBookNode(book);
    self.getBookListNode().appendChild(bookNode);
};

_bdp.removeBook = function(book) {
    var self = this;
    self.getBookListNode().removeChild(self.getBookNode(book.id));
};

_bdp.setBookTitle = function(bookId, newTitle) {
    var self = this;
    if (newTitle.trim() === '') {
        alert('New name cannot be empty');
        return;
    }    
    if (!self._bookStore.bookNameIsAvailable(newTitle.trim(), bookId)) {
        alert('New name should not conflict with other books');
        return;
    }    
    var book = self._bookStore.getBookById(bookId);
    book.name = newTitle;
    self.switchToDisplayMode(bookId);
};

_bdp.switchToEditMode = function(bookId) {
    var self = this;
    var bookNode = self.getBookNode(bookId);
    self.cleanNode(bookNode);
    var book = self._bookStore.getBookById(bookId);
    var editableGuts = self.generateEditableGuts(book);
    bookNode.appendChild(editableGuts);
};

_bdp.switchToDisplayMode = function(bookId) {
    var self = this;
    var bookNode = self.getBookNode(bookId);
    self.cleanNode(bookNode);
    var book = self._bookStore.getBookById(bookId);
    var displayableGuts = self.generateDisplayableGuts(book);
    bookNode.appendChild(displayableGuts);
};

_bdp.switchToDeleteMode = function(bookId) {
    var self = this;
    var bookNode = self.getBookNode(bookId);
    self.cleanNode(bookNode);
    var book = self._bookStore.getBookById(bookId);
    var deletableGuts = self.generateDeletableGuts(book);
    bookNode.appendChild(deletableGuts);
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
    var containerNode = self.renderTemplate('tmpl-book-display', book);
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
    var containerNode = self.renderTemplate('tmpl-book-edit', book);
    var bookName = containerNode.querySelector('.input-book-new-name');
    containerNode.querySelector('.form-book-edit').addEventListener('submit', function(e) {
        e.preventDefault();
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.setBookTitle(bookId, bookName.value);
    });
    containerNode.querySelector('.button-edit-cancel').addEventListener('click', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.switchToDisplayMode(bookId);
    });
    return containerNode;
};

_bdp.generateDeletableGuts = function(book) {
    var self = this;
    var containerNode = self.renderTemplate('tmpl-book-delete', book);
    containerNode.querySelector('.button-delete-confirm').addEventListener('click', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        var book = self._bookStore.getBookById(bookId);
        self._bookStore.removeBook(book);
    });
    containerNode.querySelector('.button-delete-cancel').addEventListener('click', function(e) {
        var bookId = parseInt(e.srcElement.dataset.bookId);
        self.switchToDisplayMode(bookId);
    });
    return containerNode;
};

_bdp.renderTemplate = function(templateName, book) {
    var template = document.getElementById(templateName).innerHTML;
    var html = template
                    .replace(/{{book.name}}/g, book.name)
                    .replace(/{{book.id}}/g, book.id);
    var resultNode = document.createElement('span');
    resultNode.innerHTML = html;
    return resultNode; 
};

_bdp.appendNewBook = function() {
    var self = this;
    var newBookName = document.getElementById('new-book-name').value.trim();
    if (newBookName === '') {
        alert('Book name cannot be empty');
        return;
    }
    if (!self._bookStore.bookNameIsAvailable(newBookName)) {
        alert('The Book is already in the directory');
        return;
    }
    var newBook = {name: newBookName};
    self._bookStore.addBook(newBook);
    document.getElementById('new-book-name').value = '';
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

bookStore.addBook({name: 'Pride and Prejudice'});
bookStore.addBook({name: 'A Tale of Two Cities' });
bookStore.addBook({name: 'Treasure Island'});
bookStore.addBook({name: 'Dracula'});

var bookDirectory = new BookDirectory(bookStore);
bookDirectory.run();

});