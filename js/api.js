var  base_url = "https://readerapi.codepolitan.com/";

// Blok yang dipanggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : "+response.status);
    //Metod reject() akan membuat catch terpanggil
    return Promise.reject(new Error(response.statusText));
  }else {
    // mengubah suatu objek menjadi Promise agar bisa di "Then-kan"
    return Promise.resolve(response)
  }
}

// Blok kode untuk memparse json ke array
function json(response) {
  return response.json();
}

// Blok kode untuk menghandle catch
function error(error) {
  // parameter error dari Promise.reject()
  console.log("error : "+error);
}

function getArtikel() {

  if ('caches' in window) {
    caches.match(base_url+"articles").then(function(response) {
      if (response) {
        response.json().then(function(data) {
          // Objek/array JavaScript dari response.json() masuk lewat data.
          // Menyusun komponen card artikel secara dinamis
          var articlesHTML = "";
          data.result.forEach(function(article) {
            articlesHTML += `
                             <div class="card">
                               <a href="./article.html?id=${article.id}">
                                 <div class="card-image waves-effect waves-block waves-light">
                                   <img src="${article.thumbnail}" />
                                 </div>
                               </a>
                               <div class="card-content">
                                 <span class="card-title truncate">${article.title}</span>
                                 <p>${article.description}</p>
                               </div>
                             </div>
                           `;
          });
          document.getElementById("articles").innerHTML = articlesHTML;
        });
      }
    });
  }


  fetch(base_url + "articles").then(status)
                            .then(json)
                            .then(function(data) {
                              // Objek/array JavaScript dari response.json() masuk lewat data.
                              // Menyusun komponen card artikel secara dinamis
                              var articlesHTML = "";
                              data.result.forEach(function(article) {
                                articlesHTML += `
                                                 <div class="card">
                                                   <a href="./article.html?id=${article.id}">
                                                     <div class="card-image waves-effect waves-block waves-light">
                                                       <img src="${article.thumbnail}" />
                                                     </div>
                                                   </a>
                                                   <div class="card-content">
                                                     <span class="card-title truncate">${article.title}</span>
                                                     <p>${article.description}</p>
                                                   </div>
                                                 </div>
                                               `;
                              });
                              document.getElementById("articles").innerHTML = articlesHTML;
                            });

}

function getArtikelByID() {
  return new Promise(function(resolve,reject) {
    
  //Get ID From URL Windows
      var varUrl = new URLSearchParams(window.location.search);
      var varId = varUrl.get("id");

      if ('caches' in window) {
        console.log("ceee"+varId);
        caches.match(base_url+"articles/"+varId).then(function(response) {
          if (response) {
            response.json(
              
            ).then(function(data) {

              // Objek/array JavaScript dari response.json() masuk lewat data.
              // Menyusun komponen card artikel secara dinamis
              console.log(data);
              var articlesHTML = "";
              var articleHTML = `
                                <div class="card">
                                  <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${data.result.cover}" />
                                  </div>
                                  <div class="card-content">
                                    <span class="card-title">${data.result.post_title}</span>
                                    ${snarkdown(data.result.post_content)}
                                  </div>
                                </div>
                              `;
                            // Insert HTML into ID body-content
                            document.getElementById("body-content").innerHTML = articleHTML;
                            resolve(data);
                          });
          }
        });
      }

      fetch(base_url+"article/"+varId).then(status)
                                      .then(json)
                                      .then(function(data) {
                                        console.log(data);
                                        var articlesHTML = "";
                                        var articleHTML = `
                                                          <div class="card">
                                                            <div class="card-image waves-effect waves-block waves-light">
                                                              <img src="${data.result.cover}" />
                                                            </div>
                                                            <div class="card-content">
                                                              <span class="card-title">${data.result.post_title}</span>
                                                              ${snarkdown(data.result.post_content)}
                                                            </div>
                                                          </div>
                                                        `;
                                                      // Insert HTML into ID body-content
                                                      document.getElementById("body-content").innerHTML = articleHTML;
                                        resolve(data);
                                       });


  });
}

function getSavedArticles() {
  getall().then((articles) => {
    console.log("GetSavedArticles"+articles);
    var articlesHTML = "";
    articles.forEach(function (article) {
      var description = article.post_content.substring(0, 100);
      articlesHTML += `
                  <div class="card">
                    <a href="./article.html?id=${article.ID}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.cover}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${article.post_title}</span>
                      <p>${description}</p>
                    </div>
                  </div>
                `;
    });

    document.getElementById("articles").innerHTML = articlesHTML;
  });
}


function getSavedArticleById(id) {

  getById(id).then(function (article) {
    articleHTML = '';
    var articleHTML = `
        <div class="card">
          <div class="card-image waves-effect waves-block waves-light">
            <img src="${article.cover}" />
          </div>
          <div class="card-content">
            <span class="card-title">${article.post_title}</span>
            ${snarkdown(article.post_content)}
          </div>
        </div>
      `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articleHTML;
  });
}