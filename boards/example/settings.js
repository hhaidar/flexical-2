PRODUCTION = {
  'Security Compass': {
    url: 'http://securitycompass.com',
    test: function(res) {
      if(res.body.match(/All Rights Reserved/ig)) return true;
      return false;
    }
  },
  'SD Elements': {
    url: 'http://sdelements.com',
    test: function(res) {
      if(res.body.match(/All Rights Reserved/ig)) return true;
      return false;
    }
  }
};

INTERNAL = {
  'github': {
    url: 'https://github.com'
  }
};

TICKER_AUTH = {
  //user: 'board',
  //pass: 'zUDk9F0qWOT1oyX9RkYf',
  token: {'X-TrackerToken': '737cb4d81ccb8d2a35548ce9c3571c4a'}
};

module.exports = {
  INTERNAL: INTERNAL,
  PRODUCTION: PRODUCTION,
  TICKER_AUTH: TICKER_AUTH
};
