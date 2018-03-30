/**
 * Created by chudleighc on 17/10/13.
 * Works in Chrome, IE8+ not IE7 - JSON undefined error, firefox setAttribute error? *
 * uses ajax, cookies, json, twitter bootstrap, handlebars
 * to do: quit quiz when finished
 */

var myOutput=document.querySelector('#message');
ajaxCall("questions.json", myOutput, function(data){

    function getUserName(){
        var $myBack=$('.myBack');
        var $myAction=$('.myAction');
        $myBack.css("display","inline-block").html("back").prop("disabled",true);
        $myAction.html("next");

        $('.tab-content').css("display","none");
        $('ul.nav').css("display","none");

        //reset quizzes
        quiz1.resetUserChoice();
        quiz1.qtnNumber=0;
        quiz2.resetUserChoice();
        quiz2.qtnNumber=0;
        quiz3.resetUserChoice();
        quiz3.qtnNumber=0;

        if (myCookie){
            $message.html("Hi " + myCookie + ", if this is not you, please enter your name below.");
        }
        else{
            $message.html("Please enter your name.");
        }
        var $txtName=$('#name');
        $txtName.val(myCookie);
    }//ftn

    Handlebars.registerHelper("arrayLength", function() {
        return (quiz1.qtns.length);
    });

    // event handler to add name
    function addMyName(){
        if($('#name').val()!==''){
            myCookie=$('#name').val();
            writeCookie('name',myCookie,5);
            $('#welcome').css("display","none");
            $('ul.nav').css("display","block");
            $('.tab-content').css("display","block");
            $('.quiz').css("display","block");
            $message.html('');
            startQuiz(quiz1,$quiz1Form);
            startQuiz(quiz2,$quiz2Form);
            startQuiz(quiz3,$quiz3Form);
            return true;
        }
        else{
            $message.html('Please enter a name!');
            $message.removeClass("alert-danger").addClass("alert-error");
            return false;
        }
    }//ftn

    function startQuiz(quiz,$quizForm){

        var $myBack=$('#'+$quizForm.attr('id')+ ' .myBack');
        var $myAction=$('#'+$quizForm.attr('id')+ ' .myAction');
        var $quizMessage=$('#'+$quizForm.attr('id')+ ' .quizMessage');

        $myBack.css("display","inline-block").html("back");
        $myBack.prop("disabled",true);

        $myAction.html("next");

        $quizMessage.html("<p>Welcome to the "+ quiz.name + " quiz " + myCookie + ".</p>");
        nextQtn(quiz,$quizForm);
        $myAction.click(function(){nextQtn(quiz,$quizForm);});
        $myBack.click(function(){prevQtn(quiz,$quizForm);});
    }//ftn

    function prevQtn(quiz,$quizForm){
        var $quizError=$('#'+$quizForm.attr('id') +' .quizError');
        var $myBack=$('#'+$quizForm.attr('id')+ ' .myBack');
        var $myAction=$('#'+$quizForm.attr('id')+ ' .myAction');
        var $quizQuestion=$('#'+$quizForm.attr('id')+ ' .quizQuestion');

        //check to see if quiz to be reset ie. on result page
        if(quiz.qtnNumber>quiz.qtns.length){
            eraseCookie('name');

            getUserName();
            $('#welcome').css("display","block");
            $message.removeClass("alert-danger").addClass("alert-info");
            return true;
        }
        $quizError.css("display","none");
        if(quiz.qtnNumber!==1 || quiz.qtnNumber!==quiz.qtns.length){

            quiz.qtns[quiz.qtnNumber-1].userChoice=1+parseInt($('input[name=myAnswer]:checked', $quizForm).val());
            console.log($('input[name=myAnswer]:checked', $quizForm).val());

            quiz.qtnNumber--;

            $myBack.prop("disabled",false);
            quiz.writeQuestion(quiz.qtnNumber,$quizQuestion);
            if(quiz.qtnNumber===1){
                $myBack.prop("disabled",true);
                $myAction.html("next");
            }//if
        }//if
    }//ftn

    function nextQtn(quiz,$quizForm){
        var $quizError=$('#'+$quizForm.attr('id')+' .quizError');
        var $myBack=$('#'+$quizForm.attr('id')+' .myBack');
        var $myAction=$('#'+$quizForm.attr('id')+' .myAction');
        var $quizAnswers=$('#'+$quizForm.attr('id')+ ' .quizAnswers');
        var $quizQuestion=$('#'+$quizForm.attr('id')+ ' .quizQuestion');

        $quizError.css("display","none");

        //check to see if quiz to be reset ie. on result page
        if(quiz.qtnNumber>quiz.qtns.length){
           // eraseCookie('name');
            for (var i=0;i<quiz.qtns.length;i++){
                quiz.qtns[i].userChoice=0;
            }
            quiz.qtnNumber=0;
            startQuiz(quiz,$quizForm);
            return true;
        }//if

        // add users selection to userChoices
        if(quiz.qtnNumber!==0){
            if (!checkRadio($quizForm)){
                $quizError.css("display","block");
                $quizError.html("<strong>Please select a choice below!</strong>");
                return false;
            }//if
            quiz.qtns[quiz.qtnNumber-1].userChoice=1+parseInt($('input[name=myAnswer]:checked', $quizForm).val());
            console.log($('input[name=myAnswer]:checked', $quizForm).val());

        }//if

        quiz.qtnNumber++;

        if(quiz.qtnNumber!==1){
            $myBack.prop("disabled",false);
        }

        $quizAnswers.html("");

        //write out next set of answers if not at end of quiz else write score
        if (quiz.qtnNumber<=quiz.qtns.length){
            quiz.writeQuestion(quiz.qtnNumber,$quizQuestion);
            $myAction.html("next");
        }//if
        else{
            quiz.writeScore($quizQuestion);
            $myAction.html("Try the quiz again!");
            $myBack.html("Leave the quizzes");
        }//else
        return true;
    }//ftn

    //check if user has selected a checkbox
    function checkRadio($myForm){
        if( $myForm.find('input[name="myAnswer"]:checked').length){
            return true;
        }
        else{
            return false;
        }
    }//ftn

    // Quiz constructor
    function Quiz(name,qtns,qtnNumber){
        this.name=name;
        this.qtns=qtns;
        this.qtnNumber=qtnNumber;
        Quiz.prototype.writeQuestion = function(qtnNumber,$qtnTarget){
            var $source   = $("#qtn-template").html();
            var myTemplate = Handlebars.compile($source);
            $qtnTarget.hide();
            $qtnTarget.html(myTemplate( this.qtns[qtnNumber-1]));
            $qtnTarget.fadeIn('slow');
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
        Quiz.prototype.writeScore = function($qtnTarget){
            var score = this.calcScore();
            var $source   = $("#score-template").html();
            var myTemplate = Handlebars.compile($source);
            $qtnTarget.html(myTemplate(score));

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
    var $quiz1Form=$('#quiz1Form');
    var $quiz2Form=$('#quiz2Form');
    var $quiz3Form=$('#quiz3Form');

    var $addName=$('#addName');
    var $message=$('#message');
    var myCookie=readCookie('name');
    var $txtName=$('#name');
    $txtName.val(myCookie);
    $txtName.focus(function(){$txtName.val("");});

    var $quizError=$('.quizError');
    $quizError.css("display","none");

    $('ul.nav').css("display","none");

    getUserName();
    $addName.click(addMyName);
    $txtName.keypress(function(event){
        if (event.keyCode === 13){
            event.preventDefault();addMyName();
        }
    });//ftn
});//ajaxCall





