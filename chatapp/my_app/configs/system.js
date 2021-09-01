module.exports = {
    prefixAdmin : 'adminZendvn',
    prefixUsers : '',
    env         : 'production',
    user: "dinhthaonguyen19996@gmail.com",
    pass: "anhthao12d42013491",
    secretNodemailer : 'HHB8PLznCb4t7KYGtmmIEJ6iBOC1jljGIR',
    port : 3000,
    facebook : {
        clientID        : "1731861773869097",
        clientSecret    : "4b03b2adf386f7738caf698a0c0d44ba",
        callbackURL     : `http://localhost:3000/accounts/facebook/secrets`,
        profileFields   : ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email', 'locale']
    },
    google : {
        clientID: "244082104306-5cq2tns63o7rkknjs65km7a6c1p0hp3h.apps.googleusercontent.com",
        clientSecret: "xywPOaC2_znMatgYFEuTdtCP",
        callbackURL: "http://localhost:3000/accounts/google/callback"
    }
}