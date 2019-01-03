const fbData = {
    facebook_api_key      :     process.env.FB_API_KEY || "1639639556137911",
    facebook_api_secret   :     process.env.FB_API_SECRET,
    callback_url          :     "http://localhost:4000/auth/facebook/callback",
    use_database          :     "false",
    host                  :     "localhost",
    username              :     "boehm-s",
    password              :     "",
    database              :     "DB NAME"
};

module.exports = fbData;
