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
        return (quiz1.qtns.length);
    });

    // event handler to add name
    function addMyName(){
        if(document.getElementById('name').value!==''){
            myCookie=document.getElementById('name').value;
            writeCookie('name',myCookie,5);
            document.getElementById('welcome').style.display="none";
            document.getElementById('quiz').style.display="block";
            message.innerHTML='';
            startQuiz(quiz2);
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

    function startQuiz(quiz,quizForm){
        quizMessage=document.querySelector(quizForm.id .quizMessage);

        quizMessage.innerHTML="<p>Welcome to the "+ quiz.name + " quiz " + myCookie + ".</p>";
        nextQtn(quiz);
        myAction.onclick=function(){nextQtn(quiz,quizForm)};
        myBack.onclick=function(){prevQtn(quiz,quizForm)};
    }//ftn

    function prevQtn(quiz,quizForm){
        quizError=document.querySelector(quizForm.id .quizError);
        quizError.style.display="none";
        if(quiz.qtnNumber!==1 || quiz.qtnNumber!==quiz.qtns.length){
            for(var i=0; i<quizForm.elements.myAnswer.length; i++){
                if(quizForm.elements["myAnswer"][i].checked){
                    quiz.qtns[quiz.qtnNumber-1].userChoice=i+1;
                }//if
            }//for

            quiz.qtnNumber--;

            myBack.removeAttribute("disabled");
            quiz.writeQuestion(quiz.qtnNumber);
            if(quiz.qtnNumber===1){
                myBack.setAttribute("disabled");
                myAction.innerHTML="next";
            }//if
        }//if
    }//ftn

    function nextQtn(quiz,quizForm){
        quizError=document.querySelector(quizForm.id .quizError);
        myBack=document.querySelector(quizForm.id .myBack);
        myAction=document.querySelector(quizForm.id .myBack);

        quizError.style.display="none";
        //check to see if quiz to be reset ie. on result page
        if(quiz.qtnNumber>quiz.qtns.length){
            eraseCookie('name');
            for (var i=0;i<quiz.qtns.length;i++){
                quiz.qtns[i].userChoice=0;
            }
            quiz.qtnNumber=0;
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
        if(quiz.qtnNumber!==0){
            if (!checkRadio(quizForm)){
                quizError.style.display="block";
                quizError.innerHTML="<strong>Please select a choice below!</strong>";
                return false;
            };
            for(var i=0; i<quizForm.elements.myAnswer.length; i++){
                if(quizForm.elements["myAnswer"][i].checked){
                    quiz.qtns[quiz.qtnNumber-1].userChoice=i+1;
                }//if
            }//for
        }//if

        quiz.qtnNumber++;

        if(quiz.qtnNumber!==1){
            myBack.removeAttribute("disabled");
        }

        quizAnswers.innerHTML="";

        //write out next set of answers if not at end of quiz else write score
        if (quiz.qtnNumber<=quiz.qtns.length){
            quiz.writeQuestion(quiz.qtnNumber);
            myAction.innerHTML="next";
        }//if
        else{
            quiz.writeScore();
            myAction.innerHTML="Try the quiz again!";
            myBack.style.display="none";
        }//else
        return true;
    }//ftn

    //check if user has selected a checkbox
    function checkRadio(myForm){
        console.log(myForm);
        for(var i=0;i<myForm.elements["myAnswer"].length;i++){
            if(myForm.elements["myAnswer"][i].checked)return true;
        }//for
        return false;
    }//ftn

    // Quiz constructor
    function Quiz(name,qtns,qtnNumber){
        this.name=name;
        this.qtns=qtns;
        this.qtnNumber=qtnNumber;
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
        Quiz.prototype.writeScore = function(){
            var score = this.calcScore();
            var source   = $("#score-template").html();
            var myTemplate = Handlebars.compile(source);
            myQtn.innerHTML = myTemplate(score);
        };
    }

    // initialise variables

    var quiz1 = new Quiz("first",data.myQtns,0);
    var quiz2 = new Quiz("second",data.myQtns2,0);

    var quiz1Form=document.getElementById('quiz1Form');
    var quiz2Form=document.getElementById('quiz2Form');
    var addName=document.getElementById('addName');
    var message=document.getElementById('message');

    var quizMessage=document.getElementById('quizMessage');
    var quizError=document.getElementById('quizError');
    var myAction=document.getElementById("myAction");
    var myBack=document.getElementById("myBack");
    var quizAnswers=document.getElementById("quizAnswers");

    var myCookie=readCookie('name');
    var txtName=document.getElementById('name');

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





