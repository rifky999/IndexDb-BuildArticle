var dbPromised = idb.open("news-reader", 1, function (upgradeDb) {
    var articlesObjectStore = upgradeDb.createObjectStore("articles", {
        keyPath: "ID"
    });
    articlesObjectStore.createIndex("post_title", "post_title", { unique: false });
    
    
});

function saveForLater(article) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("articles", "readwrite");
            var store = tx.objectStore("articles");
            console.log(article);
            store.add(article.result);
            return tx.complete;
        })
        .then(function () {
            alert("Artikel Berhasil disimpan")
            console.log("Artikel berhasil di simpan.");
        });
}

function getall() {
    return new Promise(function(resolve,reject) {
        dbPromised.then(function(db) {
            var tx = db.transaction("articles","readonly");
            var store = tx.objectStore("articles");
            return store.getAll();
        }).then(function(articles) {
            console.log("Show All Data IDB");
            console.log(articles);
            
            resolve(articles);
        });
    });
}

function getById(id) {
    return new Promise(function(resolve,reject) {
        dbPromised.then((db) => {
            var tx = db.transaction("articles", "readonly");
            var store = tx.objectStore("articles");
            return store.get(id);
        }).then((articles) => {
            console.log("Get By ID IndexDb");
            resolve(articles);
        });
    })
}