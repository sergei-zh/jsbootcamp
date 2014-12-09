define(["./book-store", "./book-directory-facade"], 
    function(BookStore, BookDirectoryFacade) {
        "use strict";

        var bookStore = new BookStore();

        bookStore.addBook({name: 'Pride and Prejudice'});
        bookStore.addBook({name: 'A Tale of Two Cities' });
        bookStore.addBook({name: 'Treasure Island'});
        bookStore.addBook({name: 'Dracula'});

        var bookDirectoryFacade = new BookDirectoryFacade(bookStore);
        bookDirectoryFacade.run();
});