$( document ).ready(function() {

    $("#login").click(function(){              
        $('#loginModal').show('slow');
    })

    $(".charOpen").click(function(){        
        let charId = $(this).attr('value');        
        $('#charModal' + charId).show('slow');
    })
    
    $(".close").click(function(){        
        $('#loginModal').hide();
    })

    $(".closeChar").click(function(){
        $('.charModal').hide();
    })
    
    let flash_message = $(".flash-message").text();  
    if(flash_message){
        setTimeout(() => {
            $(".flash-message").text('');
        }, 2000);
    }

    if(flash_message=='Incorrect username/password!'){
        $(".flash-message").removeClass('text-info').addClass('text-danger');
        setTimeout(() => {
            $('#loginModal').show("slow");            
        }, 2000);
    }

    let form = document.getElementById('login-form');

    $("#login-button").click(function(ev) {
        ev.preventDefault();
        console.log('not submitted yet!');       
        
        let username = $("#username").val();
        let password = $("#password").val();
        console.log(username)
        if(password && username){
            form.submit();

        }else{
            $(".error-message").html("Incomplete form");
            $('#loginModal').show('fast');
            console.log("form not submitted")
        }
    })

    // Change drop down selected menu for admin
    let genderAttr=$(".gender-menu").attr('value')
    $(`select option[value='${genderAttr}']`).attr("selected","selected");

    let factionAttr=$(".faction-menu").attr('value')
    console.log(factionAttr)
    $(`select option[value='${factionAttr}']`).attr("selected","selected");

    // Drop down selected menu search
    let factionForm = document.getElementById('faction-form');
    $("#faction").change(function(){        
        // console.log('zahur change')
        factionForm.submit();        
    })

    let factionName=$("#faction-name").attr('value')
    console.log(factionName)
    $(`select option[value='${factionName}']`).attr("selected","selected");

});