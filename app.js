var mongoose = require('mongoose')
    , express = require('express')
    , jade = require('jade')
    , models = require('./models')
    , User
    , Beer
    , City
    , Shop;


// Mongodb schema
var Schema = mongoose.Schema;
//var userCount = 0;

mongoose.connect('mongodb://localhost/blog');
console.log("Server up")

var app = express.createServer();

var MemStore = require('connect-mongodb');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session( { secret:'mySecret' } ));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

models.defineModels(mongoose, function() {
  app.User = User = mongoose.model('User');
  app.Beer = Beer = mongoose.model('Beer');
  app.City = City = mongoose.model('City');
  app.Shop = Shop = mongoose.model('Shop');
})


function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/sessions/new');
      }
    });
  } else {
    res.redirect('/sessions/new');
  }
}

app.get('/', loadUser, function(req, res) {
  res.render('index.jade');
});

//------------------------C R E A T E    BEEEERS ------------------//
// Show all
app.get('/beers', loadUser, function(req, res){
  var beers = Beer.find({}, function(err, docs){
    res.render('beers/index.jade', { locals: {
        beers: docs
      }
      });
    console.log("Serving all");
  });
});

// Create a new beer
app.get('/beers/new', loadUser, function(req, res){
  var shops = Shop.find({}, function(err, docs){
    res.render('beers/new.jade', { locals: {
        shops: docs
      }
      });
  console.log(docs[0]._id);
  });
});

// Edit a record
app.get('/beers/edit/:id', loadUser, function(req, res){
  Beer.findById(req.params.id, function(err, nazwa){
    try {
      res.render('beers/edit.jade', { locals: {
          beer: nazwa
        }
        });
    } catch(e) {
      console.log(e)
    }
  });
});

app.post('/beers', loadUser, function(req, res){
  var beer = new Beer(req.body);
  beer.counter=0;
  beer.save();
  console.log('Saved ' + beer.id);
  req.flash('info', 'Beer added successfully!');
  res.redirect('/beers');  
});

app.post('/beers/:id', loadUser ,function(req, res){
  Beer.update({ _id: req.params.id }, req.body,
    function(){ res.redirect('/beers'), req.flash('info', 'Beer modified successfully!')
  });
});

// show one
app.get('/beers/:id', loadUser, function(req, res){
  Beer.findById(req.params.id, function(err, nazwa){
    //res.send(JSON.stringify(post));
    try {
   	nazwa.counter++;
	nazwa.save();
      res.render('beers/beer.jade', { locals: {
          beer: nazwa
        }
        });
      
      console.log("Serving " + beer.id);
    } catch(e) {
      console.log(e)
    }
  });
  //Beer.update({ _id: req.params.id }, function(err, docs){

//});
});

// show lucky one
app.get('/luckyOne', loadUser, function(req, res){
  var beers = Beer.find({});
beers.limit(20);
beers.asc('cena');



beers.exec(function (err, docs) {
    var random = Math.floor((Math.random()*4)+1);

	Beer.findById(docs[random]._id, function(err, doc){
    res.render('beers/luckyOne.jade', { locals: {
        beers: doc
      }
      }); 
  });
});
});

//finder







app.get('/beers/remove/:id', loadUser, function(req, res){
  Beer.findById(req.params.id, function (err, beer) {
    beer.remove(beer);
    console.log('Deleted ' + beer.id)
    req.flash('info', '%s deleted successfully!', beer.nazwa);
    res.redirect('/beers');
    if (!err) {
    }
  });
});
//------------------------C R E A T E    BEEEERS ------------------//

//------------------------C R E A T E    CITY ------------------//

// Show all
app.get('/city', loadUser, function(req, res){
  var cit = City.find({}, function(err, docs){
    res.render('cities/index.jade', { locals: {
        cit: docs
      }
      });
    console.log("Serving all cities");
  });
});

// Create a new beer
app.get('/city/new', loadUser, function(req, res){
  res.render('cities/new.jade');
  console.log('Serving - Create new city');
});

// Edit a record
app.get('/city/edit/:id', loadUser, function(req, res){
  City.findById(req.params.id, function(err, nazwa){
    try {
      res.render('cities/edit.jade', { locals: {
          city: nazwa
        }
        });
    } catch(e) {
      console.log(e)
    }
  });
});

app.post('/city', loadUser, function(req, res){
  var city = new City(req.body);
  city.save();
  console.log('Saved ' + city.id);
  req.flash('info', 'City added successfully!');
  res.redirect('/city');  
});

app.post('/city/:id', loadUser ,function(req, res){
  City.update({ 
    _id: req.params.id }, 
    req.body, 
    function(){ res.redirect('/city'), req.flash('info', 'City modified successfully!')
  });
});

// show one
app.get('/city/:id', loadUser, function(req, res){
  City.findById(req.params.id, function(err, nazwa){
    Shop.find({ 'citiess' : nazwa._id }, function (err, docs) {
    try {
      res.render('cities/city.jade', { locals: {
          city: nazwa,
          shops: docs
        }
        });
      console.log("Serving " + city.id);
    } catch(e) {
      console.log(e)
    }
    });
  });
});

app.get('/city/remove/:id', loadUser, function(req, res){
  City.findById(req.params.id, function (err, city) {
    city.remove(city);
    console.log('Deleted ' + city.id)
    req.flash('info', '%s deleted successfully!', city.nazwa);
    res.redirect('/city');
    if (!err) {
    }
  });
});

//------------------------C R E A T E    CITY ------------------//
//------------------------C R E A T E    SHOPS ------------------//

// Show all
app.get('/shops', loadUser, function(req, res){
  var shops = Shop.find({}, function(err, docs){
    res.render('shops/index.jade', { locals: {
        shops: docs
      }
      });
    console.log("Serving all");
  });
});

// Create a new beer
app.get('/shops/new', loadUser, function(req, res){
  var cities = City.find({}, function(err, docs){
    res.render('shops/new.jade', { locals: {
        cities: docs
      }
      });
  console.log(docs[0]._id);
  });
});

// Edit a record
app.get('/shops/edit/:id', loadUser, function(req, res){
  Shop.findById(req.params.id, function(err, nazwa){
    try {
      res.render('shops/edit.jade', { locals: {
          shop: nazwa
        }
        });
    } catch(e) {
      console.log(e)
    }
  });
});

app.post('/shops', loadUser, function(req, res){
  var shop = new Shop(req.body);
  shop.save();
  console.log('Saved ' + shop.id);
  req.flash('info', 'Shop added successfully!');
  res.redirect('/shops');  
});

app.post('/shops/:id', loadUser ,function(req, res){
  Shop.update({ 
    _id: req.params.id }, 
    req.body, 
    function(){ res.redirect('/shops'), req.flash('info', 'Shop modified successfully!')
  });
});

// show one
app.get('/shops/:id', loadUser, function(req, res){

  var shop = Shop.findById(req.params.id, function(err, nazwa){
   Beer.find({ 'shopss' : nazwa._id }, function (err, docs) {
    try {
      res.render('shops/shop.jade', { locals: {
          shops: nazwa,
	  beers: docs
        }
        });
      //console.log("Serving " + shop.id);
    } catch(e) {
      console.log(e)
    }
  });	
});

});

app.get('/shops/remove/:id', loadUser, function(req, res){
  Shop.findById(req.params.id, function (err, shop) {
    shop.remove(shop);
    console.log('Deleted ' + shop.id)
    req.flash('info', '%s deleted successfully!', shop.nazwa);
    if (!err) {
    }
  });
});

//------------------------C R E A T E    SHOPS ------------------//

//------------------------C R E A T E    USEEEERS ------------------//
app.get('/users/new', function(req, res) {
  res.render('users/new.jade', {
    locals: { user: new User() }
  });
});

app.post('/users.:format?', function(req, res) {
  var user = new User(req.body.user);

  function userSaveFailed() {
    res.render('users/new.jade', {
      locals: { user: user }
    });
  }

  user.save(function(err) {
    if (err) return userSaveFailed();

    switch (req.params.format) {
      case 'json':
        res.send(user.toObject());
      break;

      default:
        req.session.user_id = user.id;
        res.redirect('/beers');
    }
  });
});
//------------------------C R E A T E    USEEERS ------------------//

//------------------------SEESSSSIOOON ------------------//
app.get('/sessions/new', function(req, res) {
  res.render('sessions/new.jade', {
    locals: { user: new User() }
  });
});

app.post('/sessions', function(req, res) {
  User.findOne({ email: req.body.user.email }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;
      req.session.email = user.email;
      res.redirect('/');
    } else {
      res.redirect('/sessions/new');
    }
  }); 
});

app.get('/sessions/destroy', loadUser, function(req, res) {
  if (req.session) {
    req.session.destroy(function() {});
 }
 res.redirect('/sessions/new');
});
//------------------------SEESSSSIOOON ------------------//
//Helper session
function FlashMessage(type, messages) {
  this.type = type;
  this.messages = typeof messages === 'string' ? [messages] : messages;
}

FlashMessage.prototype = {
  toHTML: function() {
    return '<div class="ui-widget flash">' +
           '<p>' + this.messages.join(', ') + '</p>' +
           '</div>';
  }
};

app.dynamicHelpers({
	session: function(req, res){
		return req.session;
	},
	flashMessages: function(req, res) {
    	  var html = '';
    ['error', 'info'].forEach(function(type) {
      	  var messages = req.flash(type);
      		if (messages.length > 0) {
       	 	html += new FlashMessage(type, messages).toHTML();
      	}
    });
    	return html;
  	}
}
);

app.listen(3000);