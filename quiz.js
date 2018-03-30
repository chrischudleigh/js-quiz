/**
 * Created by chudleighc on 17/10/13.
 * Works in Chrome, IE8+ not IE7 - JSON undefined error, firefox setAttribute error?
 * uses ajax, cookies, json, twitter bootstrap, handlebars
 */

var myQtn=document.getElementById('quizQuestion');
ajaxCall("questions.json", myQtn, function(data){

    function getUserName(){
        myBack.style.display="inline-block";
        myAction.innerHTML="next";
        myBack.innerHTML="back";
        document.getElementById('quiz').style.display="none";
        myBack.setAttribute("disabled");

        if (myCookie){
            message.innerHTML="Hi " + myCookie + ", if this is not you, please enter your name below.";
        }
        else{
            message.innerHTML="Please enter your name.";
        }
        var txtName=document.getElementById('name');
        txtName.value=myCookie;
    }//ftn

    Handlebars.registerHelper("arrayLength", function() {
        return (allQuestions.length);
    });

    // event handler to add name
    function addMyName(){
        if(document.getElementById('name').value!==''){
            myCookie=document.getElementById('name').value;
            writeCookie('name',myCookie,5);
            document.getElementById('welcome').style.display="none";
            document.getElementById('quiz').style.display="block";
            message.innerHTML='';
            startQuiz();
            return true;
        }
        else{
            message.innerHTML='Please enter a name!';
            var myClasses=message.className;
            var myArray=myClasses.split(" ");
            myArray.pop();
            myArray.push("alert-error");
            myClasses=myArray.join(" ");
            message.className=myClasses;
            return false;
        }
    }//ftn

    function startQuiz(){
        quizMessage.innerHTML="<p>Welcome to the quiz " + myCookie + ".</p>";
        nextQtn();
        myAction.onclick=nextQtn;
        myBack.onclick=prevQtn;
    }//ftn

    function prevQtn(){
        quizError.style.display="none";
        if(qtnNumber!==1 || qtnNumber!==allQuestions.length){
            for(var i=0; i<document.forms["myForm"].elements["myAnswer"].length; i++){
                if(document.forms["myForm"].elements["myAnswer"][i].checked){
                    allQuestions[qtnNumber-1].userChoice=i+1;
                }//if
            }//for

            qtnNumber--;

            myBack.removeAttribute("disabled");
            quiz1.writeQuestion(qtnNumber);
            if(qtnNumber===1){
                myBack.setAttribute("disabled");
                myAction.innerHTML="next";
            }//if
        }//if
    }//ftn

    function nextQtn(){
        quizError.style.display="none";
        //check to see if quiz to be reset ie. on result page
        if(qtnNumber>allQuestions.length){
            eraseCookie('name');
            for (var i=0;i<allQuestions.length;i++){
                allQuestions[i].userChoice=0;
            }
            qtnNumber=0;
            score=0;
            getUserName();
            document.getElementById('welcome').style.display="block";
            var myClasses=message.className;
            var myArray=myClasses.split(" ");
            myArray.pop();
            myArray.push("alert-info");
            myClasses=myArray.join(" ");
            message.className=myClasses;
            return true;
        }//if

        // add users selection to userChoices
        if(qtnNumber!==0){
            if (!checkRadio()){
                quizError.style.display="block";
                quizError.innerHTML="<strong>Please select a choice below!</strong>";
                return false;
            };
            for(var i=0; i<document.forms.myForm.elements.myAnswer.length; i++){
                if(document.forms.myForm.elements["myAnswer"][i].checked){
                    allQuestions[qtnNumber-1].userChoice=i+1;
                }//if
            }//for
        }//if

        qtnNumber++;

        if(qtnNumber!==1){
            myBack.removeAttribute("disabled");
        }

        quizAnswers.innerHTML="";
        //write out next set of answers if not at end of quiz else write score
        if (qtnNumber<=allQuestions.length){
            console.log(qtnNumber);
            quiz1.writeQuestion(qtnNumber);
            myAction.innerHTML="next";
        }//if
        else{
            allQuestions.writeScore();
        }//else
        return true;
    }//ftn

    function checkRadio(){
        for(var i=0;i<document.forms["myForm"].elements["myAnswer"].length;i++){
            if(document.forms["myForm"].elements["myAnswer"][i].checked)return true;
        }//for
        return false;
    }//ftn

    // initialise variables
    function Quiz(name,qtns){
        this.name=name;
        this.qtns=qtns;
        Quiz.prototype.testThis = function(){console.log(this.name)};
        Quiz.prototype.writeQuestion = function(qtnNumber){
            var source   = $("#qtn-template").html();
            var myTemplate = Handlebars.compile(source);
            myQtn.innerHTML = myTemplate( this.qtns[qtnNumber-1]);
        };
        Quiz.prototype.calcScore = function(){
            var total=0;
            for(var i=0;i<this.qtns.length;i++){
                if(this.qtns[i].userChoice===this.qtns[i].correctAnswer){
                    total++;
                }
            }//for
            return total;
        };
    }


    console.log(data);
    var allQuestions=data.myQtns;
    var allQuestions2=data.myQtns2;
    console.log(allQuestions2)
    var quiz1 = new Quiz("quiz1",allQuestions);
    console.log(quiz1);
    var quiz2 = new Quiz("quiz2",allQuestions2);
    console.log(quiz2);

    /*
    allQuestions.writeQuestion = function(qtnNumber){

            var source   = $("#qtn-template").html();
            var myTemplate = Handlebars.compile(source);
            myQtn.innerHTML = myTemplate( this[qtnNumber-1]);
    };

    allQuestions.calcScore = function(qtnNumber){
        var total=0;
        for(var i=0;i<allQuestions.length;i++){
            if(this[i].userChoice===this[i].correctAnswer){
                total++;
            }
        }//for
        return total;
    };
     */
    allQuestions.writeScore = function(target){
        var score = quiz1.calcScore();
        var source   = $("#score-template").html();
        var myTemplate = Handlebars.compile(source);
        myQtn.innerHTML = myTemplate(score);

        myAction.innerHTML="Try the quiz again!";
        myBack.style.display="none";
    };

    var addName=document.getElementById('addName');
    var message=document.getElementById('message');
    var quizMessage=document.getElementById('quizMessage');
    var quizError=document.getElementById('quizError');
    var myAction=document.getElementById("myAction");
    var myBack=document.getElementById("myBack");
    var quizAnswers=document.getElementById("quizAnswers");
    var myCookie=readCookie('name');
    var txtName=document.getElementById('name');
    var qtnNumber=0;
    var score=0;

    quizError.style.display="none";
    txtName.value=myCookie;
    txtName.onfocus=function(){txtName.value="";};
    getUserName();
    addName.onclick=addMyName;
    document.getElementById('name').onkeypress=function(event){
        if (event.keyCode === 13){
            event.preventDefault();addMyName();
        }
    };//ftn
});//ajaxCall





