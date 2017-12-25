$('.form').find('input, textarea').on('keyup blur focus', function(e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if ($this.val() === '') {
            label.removeClass('highlight');
        } else if ($this.val() !== '') {
            label.addClass('highlight');
        }
    }

});

$('.tab a').on('click', function(e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});

/* document.getElementById("signupForm").onsubmit = function(event) {
    event.preventDefault();
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var email = $('#signup_emailID').val();
    var password = $('#signup_password').val();
    var confPassword = $('#confPassword').val();

    $.post('/codeanywhere', {
        email: email,
        firstname: fname,
        lastname: lname,
        password: password,
        passwordConf: confPassword
    }, function(data) {
        alert("got some response");
    });
}

document.getElementById("loginForm").onsubmit = function(event) {
    event.preventDefault();
    var email = $('#login_emailID').val();
    var password = $('#login_password').val();

    $.post('/codeanywhere', {
        logemail: email,
        logpassword: password
    }, function(data) {
        alert("got some response");
    });
} */