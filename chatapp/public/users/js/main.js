$( document ).ready(function() {
    $('i#show-hidden-password').on('click', (e) => {

        let typePassword = ($('input#password').attr('type') == 'password') ? 'text' : 'password';
        let iconShow = $('i#show-hidden-password').data('show');
        let iconHiden = $('i#show-hidden-password').data('hidden');
        let removeClass = ($('input#password').attr('type') == 'password') ? iconShow : iconHiden;
        let changeClass = ($('input#password').attr('type') == 'password') ? iconHiden : iconShow;

        $('i#show-hidden-password').removeClass(removeClass);
        $('i#show-hidden-password').addClass(changeClass);
        $('input#password').prop("type", typePassword);
        
    })
    setTimeout(function(){ 
        $("div.notify").css({'display':'none'})
    }, 10000);
});