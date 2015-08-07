$(function () {
    var Book = Backbone.Model.extend({
        defaults: {
            ID: "",
            BookName: ""
        },
        idAttribute: "ID",

        urlRoot: 'http://localhost:51377/api/Books'
    });

    var BooksCollection = Backbone.Collection.extend({
        model: Book
    });


    var collection1 = new BooksCollection();
//Lets create a pre-populated collection
    var book1 = new Book({ID: 1, BookName: "Book 1"});
    var book2 = new Book({ID: 2, BookName: "Book 2"});
    var collection2 = new BooksCollection([book1, book2]);
    var book3 = new Book({ID: 3, BookName: "Book 3"});
    collection2.add(book3);

    book3 = new Book({ID: 3, BookName: "Book 3"});
    collection2.add(book3);
    var book3_changed = new Book({ID: 3, BookName: "Changed Model"});
    collection2.add(book3_changed, {merge: true});

    var book4 = new Book({ID: 4, BookName: "Book 4"});
    var book5 = new Book({ID: 5, BookName: "Book 5"});
    collection2.add([book4, book5]);

    var book0 = new Book({ID: 0, BookName: "Book 0"});
    collection2.add(book0, {at: 0});
});