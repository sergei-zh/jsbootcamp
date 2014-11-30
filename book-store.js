function BookStore() {
    this._books = [];
}

BookStore.prototype.add = function() {
    var booksAdded = [];
    var self = this;
    for (var argIndex = 0; argIndex < arguments.length; argIndex++) {
        var argument = arguments[argIndex];
        if (Array.isArray(argument)) {
            argument.forEach(function(el) {
                var addRes = self.add(el);
                addRes.forEach(function(res) {
                    if (res) {
                        booksAdded.push(res);
                    }
                });
            });
        } else if (argument !== null && typeof argument === 'object') {
            var addRes = this.addSingleBook(argument);
            if (addRes) {
                booksAdded.push(addRes);
            }
        } else {
            /* Ignore all what is neither an array nor a book */
        }
    }
    return booksAdded;
};

BookStore.prototype.addSingleBook = function(book) {
    for (var bookIndex = 0; bookIndex < this._books.length; bookIndex++) {
        var knownBook = this._books[bookIndex];
        if (knownBook.name === book.name) {
            /* Ignore a book with known name */
            return;
        }
    }

    if (!book.id) {
        book.id = this.generateBookId();
    }
    this._books.push(book);
    return book;
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
    for (var argIndex = 0; argIndex < arguments.length; argIndex++) {
        var argument = arguments[argIndex];
        if (Array.isArray(argument)) {
            argument.forEach(function(el) {
                var remRes = this.remove(el);
                remRes.forEach(function(res) {
                    if (res) {
                        booksRemoved.push(res);
                    }
                });
            });
        } else if (argument !== null && typeof argument === 'object') {
            if (argument.id) {
                var remRes = this.removeBookById(argument.id);
                if (remRes) {
                    booksRemoved.push(remRes);
                }
            }
        } else if (typeof argument === 'number') {
            var remRes = this.removeBookById(argument);
            if (remRes) {
                booksRemoved.push(remRes);
            }
        } else {
            /* Ignore all what is neither an array nor a book */
        }
    }
    return booksRemoved;
};

BookStore.prototype.removeBookById = function(bookId) {
    for (var bookIndex = 0; bookIndex < this._books.length; bookIndex++) {
        var knownBook = this._books[bookIndex];
        if (knownBook.id === bookId) {
            return this._books.splice(bookIndex, 1);
        }
    }
};

BookStore.prototype.find = function(argument) {
    var booksFound = [];
    if (typeof argument === 'string') {
        var findRes = this.findBooksByName(argument);
        findRes.forEach(function(res) {
            booksFound.push(res);
        });
    } else if (typeof argument === 'number') {
        var res = this.findBookById(argument);
        if (res) {
            booksFound.push(res);
        }
    } else {
        /* Ignore all what is neither an array nor a book */
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

BookStore.prototype.findBookById = function(bookId) {
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
    if (arguments.length === 0) {
        this._books.forEach(function(book) {
            console.log(book);
        });
    } else {
        for (var argIndex = 0; argIndex < arguments.length; argIndex++) {
            var argument = arguments[argIndex];
            if (Array.isArray(argument)) {
                argument.forEach(function(el) {
                    if (el !== null && typeof el === 'object') {
                        console.log(el);
                    }
                });
            } else if (argument !== null && typeof argument === 'object') {
                console.log(argument);
            }
        }
    }
};
