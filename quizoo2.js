/**
 * Created by chris chudleigh
 * Works in Chrome, IE8+, firefox 
 * uses ajax, cookies, json, twitter bootstrap, handlebars
 */

var myOutput=document.querySelector('#message');
ajaxCall("questions-new.json", myOutput, function(data){

    function getUserName(){
        var myBack=document.querySelectorAll('.myBack');
        var myAction=document.querySelectorAll('.myAction');

        for (var i=0; i<myBack.length;i++) {
            myBack[i].style.display="inline-block";
            myBack[i].innerHTML="back";
            myBack[i].setAttribute("disabled","disabled");
        }
        for (var i=0; i<myAction.length;i++) {
            myAction[i].innerHTML="next"
        }

        document.querySelector('.tab-content').style.display="none";
        document.querySelector('ul.nav').style.display="none";

        //reset quizzes
        quiz1.resetUserChoice();
        quiz1.qtnNumber=0;
        quiz2.resetUserChoice();
        quiz2.qtnNumber=0;
        quiz3.resetUserChoice();
        quiz3.qtnNumber=0;

        if (myCookie){
            message.innerHTML="Hi " + myCookie + ", if this is not you, please enter your name below.";
            var txtName=document.getElementById('name');
            txtName.value=myCookie;
        }
        else{
            message.innerHTML="Please enter your name.";
        }

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
            document.querySelector('ul.nav').style.display="block";
            document.querySelector('.tab-content').style.display="block";
            document.querySelector('.quiz').style.display="block";
            message.innerHTML='';
            startQuiz(quiz1,quiz1Form);
            startQuiz(quiz2,quiz2Form);
            startQuiz(quiz3,quiz3Form);
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

        var myBack=document.querySelector('#'+quizForm.id+ ' .myBack');
        var myAction=document.querySelector('#'+quizForm.id+ ' .myAction');
        var quizMessage=document.querySelector('#'+quizForm.id+ ' .quizMessage');

        myBack.style.display="inline-block";
        myBack.innerHTML="back";
        myBack.setAttribute("disabled","disabled");
        myAction.innerHTML="next";

        quizMessage.innerHTML="<p>Welcome to the "+ quiz.name + " quiz " + myCookie + ".</p>";
        nextQtn(quiz,quizForm);
        myAction.onclick=function(){nextQtn(quiz,quizForm)};
        myBack.onclick=function(){prevQtn(quiz,quizForm)};
    }//ftn

    function prevQtn(quiz,quizForm){
        var quizError=document.querySelector('#'+quizForm.id +' .quizError');
        var myBack=document.querySelector('#'+quizForm.id+ ' .myBack');
        var myAction=document.querySelector('#'+quizForm.id+ ' .myAction');
        var quizQuestion=document.querySelector('#'+quizForm.id+ ' .quizQuestion');

        //check to see if quiz to be reset ie. on result page
        if(quiz.qtnNumber>quiz.qtns.length){
            eraseCookie('name');

            getUserName();
            document.getElementById('welcome').style.display="block";
            var myClasses=message.className;
            var myArray=myClasses.split(" ");
            myArray.pop();
            myArray.push("alert-info");
            myClasses=myArray.join(" ");
            message.className=myClasses;
            return true;
        }
        quizError.style.display="none";
        if(quiz.qtnNumber!==1 || quiz.qtnNumber!==quiz.qtns.length){
            for(var i=0; i<quizForm.elements.myAnswer.length; i++){
                if(quizForm.elements["myAnswer"][i].checked){
                    quiz.qtns[quiz.qtnNumber-1].userChoice=i+1;
                }//if
            }//for

            quiz.qtnNumber--;

            myBack.removeAttribute("disabled");
            quiz.writeQuestion(quiz.qtnNumber,quizQuestion);
            if(quiz.qtnNumber===1){
                myBack.setAttribute("disabled");
                myAction.innerHTML="next";
            }//if
        }//if
    }//ftn

    function nextQtn(quiz,quizForm){
        var quizError=document.querySelector('#'+quizForm.id+' .quizError');
        var myBack=document.querySelector('#'+quizForm.id+' .myBack');
        var myAction=document.querySelector('#'+quizForm.id+' .myAction');
        var quizAnswers=document.querySelector('#'+quizForm.id+ ' .quizAnswers');
        var quizQuestion=document.querySelector('#'+quizForm.id+ ' .quizQuestion');

        quizError.style.display="none";

        //check to see if quiz to be reset ie. on result page
        if(quiz.qtnNumber>quiz.qtns.length){
           // eraseCookie('name');
            for (var i=0;i<quiz.qtns.length;i++){
                quiz.qtns[i].userChoice=0;
            }
            quiz.qtnNumber=0;
            startQuiz(quiz,quizForm);
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
            quiz.writeQuestion(quiz.qtnNumber,quizQuestion);
            myAction.innerHTML="next";
        }//if
        else{

            quiz.writeScore(quizQuestion);
            quiz.writeResult(quiz,quizAnswers);
            myAction.innerHTML="Try again!";
            myBack.innerHTML="Leave the quizzes";
        }//else
        return true;
    }//ftn

    //check if user has selected a checkbox
    function checkRadio(myForm){
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
        Quiz.prototype.writeQuestion = function(qtnNumber,qtnTarget){
            var source   = $("#qtn-template").html();
            var myTemplate = Handlebars.compile(source);
            $(qtnTarget).hide();
            qtnTarget.innerHTML = myTemplate( this.qtns[qtnNumber-1]);
            $(qtnTarget).fadeIn('slow');
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
         Quiz.prototype.writeResult = function(qtns,qtnTarget){
            var source   = $("#results-template").html();
            var myTemplate = Handlebars.compile(source);
            qtnTarget.innerHTML = myTemplate(qtns);

        };
        Quiz.prototype.writeScore = function(qtnTarget){
            var score = this.calcScore();
            var source   = $("#score-template").html();
            var myTemplate = Handlebars.compile(source);
            qtnTarget.innerHTML = myTemplate(score);

        };
        Quiz.prototype.resetUserChoice = function(){
            for(var i=0;i<this.qtns.length;i++){
                this.qtns[i].userChoice=0;
                }//for
        }//ftn
    }//ftn

    // initialise variables
    var quiz1 = new Quiz("first",data.myQtns,0);
    var quiz2 = new Quiz("second",data.myQtns2,0);
    var quiz3 = new Quiz("third",data.myQtns3,0);
    var quiz1Form=document.getElementById('quiz1Form');
    var quiz2Form=document.getElementById('quiz2Form');
    var quiz3Form=document.getElementById('quiz3Form');

    var addName=document.getElementById('addName');
    var message=document.getElementById('message');
    var myCookie=readCookie('name');
    var txtName=document.getElementById('name');
    if(myCookie){txtName.value=myCookie};
    txtName.onfocus=function(){txtName.value="";};

    var quizError=document.querySelector('.quizError');
    quizError.style.display="none";

    document.querySelector('ul.nav').style.display="none";

    getUserName();
    addName.onclick=addMyName;

    document.getElementById('name').onkeypress=function(event){
        event = event || window.event; //IE8 does not pass the event object
             
        if (event.keyCode  ===13){
            (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
            addMyName();
        }
        else{
            
        }
    };//ftn
});//ajaxCall





