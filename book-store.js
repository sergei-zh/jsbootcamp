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

//################################################################################################################################

var store = new BookStore();

var book = {
    /* Does not have any IDs */
    name: 'Pride and Prejudice'
};

store.add(book);    // Your implementation should 
                    // add a property called id to the book

console.log(book.id); // should print an number, not undefined

//###############################################################

var st = new BookStore();

var book1 = {name: 'Pride and Prejudice'};
var book2 = {name: 'A Tale of Two Cities' };
var book3 = {name: 'Treasure Island'};
var book4 = {name: 'Dracula'};

var res1 = st.add(book1);       // adds the first object to the store, 
                 // returns [{name: 'Pride and Prejudice', id: 123}]
                 // (the way you generate an ID is up to you)
console.log(res1);


var res2 = st.add(book2, book3); // adds two more objects to the store, returns an 
                  // array with two objects
console.log(res2);

var res3 = st.add(book4, book1); // adds only book4, because book1 is 
                   // already present in the database, 
                   // returns array with one element (book4) 
                   // because only this object was added
console.log(res3);

//###############################################

var res4 = st.add(1, "foobar"); // nothing is added, returns 0
console.log(res4);

//###############################################

st = new BookStore();

res1 = st.add([book1, [book2, book3], book4]);
console.log(res1);

//###############################################

console.log('REMOVE');

//console.log('7:', st.removeBookById(1));

res1 = st.remove(book1);   // remove the object from the store, 
                    // returns [{name: 'Pride and Prejudice', id: 123}]
console.log('1:', res1);

res1 = st.remove(book2, book3);    // removes two more objects to the store.
                            // returns an array with two removed elements
console.log('2:', res1);

res1 = st.remove(book4, book1);    // removes book4, because book1 was already removed
                            // returns array with a single element (book4),
                            // since only one object was removed
console.log('3:', res1);

res1 = st.add(book1, book2, book3, book4); // adds back all books
console.log('4:', res1);

res1 = st.remove(book1, book3.id);  // Removes book1 and book3, 
                            // second parameter is an ID of book3, 
                            // returns an array with two elements
console.log('5:', res1);

res1 = st.remove(book2, 'Treasure Island'); // Second parameter is silently 
                                     // ignored, remove book2
console.log('6:', res1);


//########################################################################
console.log('FIND');
st.add(book1, book2, book3, book4);
console.log('51:', st.find(book3.id));  // Returns an array with a single element - book3
console.log('52:', st.find());          // returns an empty array
console.log('53:', st.find('Pride'));   // Returns an array with a single object, 

//########################################################################
console.log('ALL');
console.log('61:', st.all());   
if (st.all().length !== 3) {
	console.error("ALL");
}
//########################################################################
console.log('PRINT');
console.log('71:none');
st.print();
console.log('72:array');
st.print({a:1}, [{b:2}, {c:3}, 1, 2, null], {o:3}, 1, null);
console.log('73:all');
st.print();   
