'use strict'
const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search';

let imageIndex = 0
let objIDs=[];
function watchForm() {
    $('form').submit(event => {
    event.preventDefault();
        const query = 'q'
        let search = $('#search-term').val();
        const url = baseUrl + '?' + query + '=' + search;
        getUrl(url);
       $('.results').empty();


});
}
//ACCESS ENTIRE CATALOG
function getUrl(url) {

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        //FETCH SPECIFIC ITEM ID
        .then(responseJson => {
            objIDs= responseJson.objectIDs;
            getObjectUrl()
        })
        .catch(err => {
            $('#error-message').text(`woops. ${err.message}`);
        } ); 
}

function getObjectUrl() {
    let objId = objIDs[imageIndex]
    
    let url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+objId;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => showResults(responseJson))
        .catch(err => {
            $('#error-message').text(`woopsy. ${err.message}`);
        });
        console.log(objId)
}

//make function that will assign random number for objID array itme with every submit//

function showResults(responseJson) {
    let keywordMatchArray = responseJson;
  
    $('.results').empty();
    $('.results').append(`
    <a target='_blank' href='${keywordMatchArray.primaryImage}'><img src=${keywordMatchArray.primaryImage}  class='img'></a>
    <a target='_blank' href='https://en.wikipedia.org/wiki/${keywordMatchArray.artistDisplayName}'><h3>${keywordMatchArray.artistDisplayName}</h3></a>
    <h4 class='title'>${keywordMatchArray.title} </h4>
    <p>${keywordMatchArray.objectDate}</p>
    <p>${keywordMatchArray.medium}</p>
    <p>${keywordMatchArray.period}</p>
    <p>${keywordMatchArray.dynasty}</p>
    <p>${keywordMatchArray.culture}</p>
    <p>${keywordMatchArray.country}</p>
    <button id='next'>Next</button>
    `  
        );
       
    //when the next button is clicked, another api request made with for the next array item in keywordMatchArray
        $('#next').on('click', function(){
            imageIndex++;
            getObjectUrl()
        })
    
    $('#search-term').val('')
}

//number of results pulls same number of array items from keywordMatchArray array
//?????????????
function renderPage() {
    watchForm();
    
}

$(renderPage)


