define(['event-emitter'], function(EventEmitter) {
    "use strict";

    function BookStore() {
        this._books = [];
        this._eventEmitter = new EventEmitter();
    }

    var _bsp = BookStore.prototype;

    _bsp.containsBook = function(book) {
        if (this.bookNameIsAvailable(book.name)) {
            return false;
        } else {
            return true;
        }
    };

    _bsp.bookNameIsAvailable = function(bookName, exceptionId) {
        for (var bookIndex in this._books) {
            var knownBook = this._books[bookIndex];
            if (knownBook.name.toUpperCase() === bookName.toUpperCase()) {
                if (knownBook.id !== exceptionId) {
                    return false;
                }
            }
        }
        return true;
    };

    _bsp.addBook = function(book) {
        if (!this._isBook(book)) {
            throw 'Book required';
        }
        if (this.containsBook(book)) {
            /* Ignore a book with known name */
            throw 'The book is already in the storage';
        }
        book.id = this._generateBookId();
        this._books.push(book);
        this._eventEmitter.emitEvent('book-added', book);
        return book;
    };

    _bsp._generateBookId = function() {
        var maxBookId = 0;
        this._books.forEach(function(book) {
            if (book.id > maxBookId) {
                maxBookId = book.id;
            }
        });
        return maxBookId + 1;
    };

    _bsp.removeBook = function(book) {
        if (!this._isBook(book)) {
            throw 'Book required';
        }
        for (var bookIndex in this._books) {
            var knownBook = this._books[bookIndex];
            if (knownBook.id === book.id) {
                this._books.splice(bookIndex, 1);
                this._eventEmitter.emitEvent('book-deleted', book);
                return book;
            }
        }
        throw 'The book is not found';
    };

    _bsp.getAllBooks = function() {
        return this._books.slice(0);
    };

    _bsp.findBooksByName = function(name) {
        var foundBooks = [];
        this._books.forEach(function(knownBook) {
            if (knownBook.name.toUpperCase().indexOf(name.toUpperCase()) > -1) {
                foundBooks.push(knownBook);
            }
        });
        return foundBooks;
    };

    _bsp.getBookById = function(bookId) {
        for (var bookIndex in this._books) {
            var knownBook = this._books[bookIndex];
            if (knownBook.id === bookId) {
                return knownBook;
            }
        }
        throw 'The book is not found';
    };

    _bsp.getEventEmitter = function() {
        return this._eventEmitter;
    };

    _bsp._isArray = function(argument) {
        return Array.isArray(argument);    
    };

    _bsp._isObject = function(argument) {
        return (
                (argument !== null) 
                && 
                (typeof argument === 'object')
        );    
    };

    _bsp._isNumber = function(argument) {
        return (typeof argument === 'number');    
    };

    _bsp._isString = function(argument) {
        return (typeof argument === 'string');    
    };

    _bsp._isBook = function(argument) {
        return (
                this._isObject(argument) 
                &&
                (argument.name)
        );    
    };

    _bsp._isStoredBook = function(argument) {
        return (
                this._isBook(argument) 
                && 
                (argument.id)
        );    
    };

    return BookStore;
});