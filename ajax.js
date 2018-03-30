function getHTTPObject(){
    var xhr;
    if (window.XMLHttpRequest) { xhr = new XMLHttpRequest();}
    return xhr;
}//ftn

function ajaxCall(dataurl,outputElement,callback) {
    var request = getHTTPObject();
    outputElement.innerHTML = "Loading...";
    request.onreadystatechange = function(){
        if(request.readyState ==4 ){
            if(request.status==200){
                var contacts = JSON.parse(request.responseText);
                if(typeof callback === "function"){ callback(contacts); }//if
            }//if
            else{
                alert("An error occurred trying to contact the server.");
            }//else
        }//if
    };//ftn
    request.open("GET", dataurl,true);
    request.send(null);
}//ftn

