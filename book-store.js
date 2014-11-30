function BookStore() {
    this._books = [];
}

BookStore.prototype.add = function() {
    var booksAdded = [];
    var self = this;
    for (var argIndex = 0; argIndex < arguments.length; argIndex++) {
        var argument = arguments[argIndex];
        if (Array.isArray(argument)) {
            self.addArray(argument).forEach(function(res) {
                booksAdded.push(res);
            });
        } else if (self.isBook(argument)) {
            self.addSingleBook(argument).forEach(function(res) {
                booksAdded.push(res);
            });
        }
    }
    return booksAdded;
};

BookStore.prototype.addArray = function(books) {
    var booksAdded = [];
    var self = this;
    books.forEach(function(book) {
        self.add(book).forEach(function(res) {
            if (res) {
                booksAdded.push(res);
            }
        });
    });
    return booksAdded;
};

BookStore.prototype.addSingleBook = function(book) {
    var addedBooks = [];
    for (var bookIndex = 0; bookIndex < this._books.length; bookIndex++) {
        var knownBook = this._books[bookIndex];
        if (knownBook.name === book.name) {
            /* Ignore a book with known name */
            return addedBooks;
        }
    }

    if (!book.id) {
        book.id = this.generateBookId();
    }
    this._books.push(book);
    addedBooks.push(book);
    return addedBooks;
};

BookStore.prototype.generateBookId = function() {
    var maxBookId = 0;
    this._books.forEach(function(book) {
        if (book.id > maxBookId) {
            maxBookId = book.id;
        }
    });
    return maxBookId + 1;
};

BookStore.prototype.remove = function() {
    var booksRemoved = [];
    var self = this;
    for (var argIndex = 0; argIndex < arguments.length; argIndex++) {
        var argument = arguments[argIndex];
        if (self.isArray(argument)) {
            self.removeArray(argument).forEach(function(res){
                booksRemoved.push(res);
            });
        } else if (self.isStoredBook(argument)) {
            self.removeBooksById(argument.id).forEach(function(res){
                booksRemoved.push(res);
            });
        } else if (self.isNumber(argument)) {
            self.removeBooksById(argument).forEach(function(res){
                booksRemoved.push(res);
            });
        } 
    }
    return booksRemoved;
};

BookStore.prototype.removeArray = function(books) {
    var booksRemoved = [];
    var self = this;
    books.forEach(function(book) {
        self.remove(book).forEach(function(res) {
            if (res) {
                booksRemoved.push(res);
            }
        });
    });
    return booksRemoved;
};

BookStore.prototype.removeBooksById = function(bookId) {
    for (var bookIndex = 0; bookIndex < this._books.length; bookIndex++) {
        var knownBook = this._books[bookIndex];
        if (knownBook.id === bookId) {
            return this._books.splice(bookIndex, 1);
        }
    }
    return [];
};

BookStore.prototype.find = function(argument) {
    var booksFound = [];
    if (this.isString(argument)) {
        this.findBooksByName(argument).forEach(function(res) {
            booksFound.push(res);
        });
    } else if (this.isNumber(argument)) {
        this.findBooksById(argument).forEach(function(res) {
            booksFound.push(res);
        });
    } 
    return booksFound;
};

BookStore.prototype.findBooksByName = function(name) {
    var foundBooks = [];
    this._books.forEach(function(knownBook) {
        if (knownBook.name.toUpperCase().indexOf(name.toUpperCase()) > -1) {
            foundBooks.push(knownBook);
        }
    });
    return foundBooks;
};

BookStore.prototype.findBooksById = function(bookId) {
    var foundBooks = []; 
    this._books.forEach(function(knownBook) {
    	if (knownBook.id === bookId) {
            foundBooks.push(knownBook);
    	}
    });
    return foundBooks;
};

BookStore.prototype.all = function() {
    return this._books.slice(0);
};

BookStore.prototype.print = function() {
    var self = this;
    if (arguments.length === 0) {
        self._books.forEach(function(book) {
            console.log(book);
        });
    } else {
        for (var argIndex = 0; argIndex < arguments.length; argIndex++) {
            var argument = arguments[argIndex];
            if (self.isArray(argument)) {
                argument.forEach(function(el) {
                    if (self.isObject(el)) {
                        console.log(el);
                    }
                });
            } else if (self.isObject(argument)) {
                console.log(argument);
            }
        }
    }
};

BookStore.prototype.isArray = function(argument) {
    return Array.isArray(argument);    
};

BookStore.prototype.isObject = function(argument) {
    return (
            (argument !== null) 
            && 
            (typeof argument === 'object')
    );    
};

BookStore.prototype.isNumber = function(argument) {
    return (typeof argument === 'number');    
};

BookStore.prototype.isString = function(argument) {
    return (typeof argument === 'string');    
};

BookStore.prototype.isBook = function(argument) {
    return (
            this.isObject(argument) 
            &&
            (argument.name)
    );    
};

BookStore.prototype.isStoredBook = function(argument) {
    return (
            this.isBook(argument) 
            && 
            (argument.id)
    );    
};
