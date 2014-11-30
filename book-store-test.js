
//################################################################################################################################

console.log('ADD');
var store = new BookStore();

var book = {
    /* Does not have any IDs */
    name: 'Pride and Prejudice'
};

store.add(book);    // Your implementation should 
                    // add a property called id to the book

console.log('1 expected :: ', book.id); // should print an number, not undefined

//###############################################################

var st = new BookStore();

var book1 = {name: 'Pride and Prejudice'};
var book2 = {name: 'A Tale of Two Cities' };
var book3 = {name: 'Treasure Island'};
var book4 = {name: 'Dracula'};

console.log('book (1) expected :: ', st.add(book1));       
                 // adds the first object to the store, 
                 // returns [{name: 'Pride and Prejudice', id: 123}]
                 // (the way you generate an ID is up to you)

console.log('books (2, 3) expected :: ', st.add(book2, book3));
                  // adds two more objects to the store, returns an 
                  // array with two objects

console.log('book (4) expected :: ', st.add(book4, book1));
                   // adds only book4, because book1 is 
                   // already present in the database, 
                   // returns array with one element (book4) 
                   // because only this object was added

//###############################################

console.log('[] expected :: ', st.add(1, "foobar")); 
                   // nothing is added, returns 0

//###############################################

st = new BookStore();

console.log('books (1,2,3,4) expected :: ', st.add([book1, [book2, book3], book4]));

//###############################################

console.log('REMOVE');

console.log('book (1) expected :: ', st.remove(book1));
                    // remove the object from the store, 
                    // returns [{name: 'Pride and Prejudice', id: 123}]

console.log('books (2,3) expected :: ', st.remove(book2, book3));    
                            // removes two more objects to the store.
                            // returns an array with two removed elements
                            
console.log('book (4) expected :: ', st.remove(book4, book1));
                            // removes book4, because book1 was already removed
                            // returns array with a single element (book4),
                            // since only one object was removed

console.log('books (1,2,3,4) expected :: ', st.add(book1, book2, book3, book4));
                            // adds back all books

console.log('books (1,3) expected :: ', st.remove(book1, book3.id));  
                            // Removes book1 and book3, 
                            // second parameter is an ID of book3, 
                            // returns an array with two elements

console.log('book (2) expected :: ', st.remove(book2, 'Treasure Island')); 
                            // Second parameter is silently 
                            // ignored, remove book2

//########################################################################
console.log('FIND');

st.add(book1, book2, book3, book4);

console.log('book (3) expected :: ', st.find(book3.id));  
        // Returns an array with a single element - book3

console.log('[] expected :: ', st.find());          
        // returns an empty array

console.log('book (1) expected :: ', st.find('Pride'));   
        // Returns an array with a single object, 

//########################################################################
console.log('ALL');
console.log('all books expected:', st.all());   
//########################################################################
console.log('PRINT');
console.log('71: none expected');
st.print(1);
console.log('72: {a:1},{b:2},{c:3},{o:3}expected');
st.print({a:1}, [{b:2}, {c:3}, 1, 2, null], {o:3}, 1, null);
console.log('73: all books expected');
st.print();   
