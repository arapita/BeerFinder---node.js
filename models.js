var crypto = require('crypto'),
    User,
    City,
    Shop,
    BeerSchema;

function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;


BeerSchema = new Schema({
  nazwa        : String,
  ekstrakt     : String,
  alkohol      : String,
  gatunek      : String,
  cena 	       : Number,
  rodzaj       : String,
  pojemnosc    : String,
  counter      : Number,
  shopss : { type: Schema.ObjectId, ref: 'Shop' }
});

City = new Schema({
  nazwa : String
});

Shop = new Schema({
  nazwa : String,
  dzielnica : String,
  ulica : String,
  lynk : String,
  citiess : { type: Schema.ObjectId, ref: 'City' }
});



  function validatePresenceOf(value) {
    return value && value.length;
  }

  User = new Schema({
    'email': { type: String, validate: [validatePresenceOf, 'an email is required'], index: { unique: true } },
    'hashed_password': String,
    'salt': String
  });

  User.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  User.virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

  User.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  });
  
  User.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  User.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  });

  User.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });

mongoose.model('User', User);
mongoose.model('Beer', BeerSchema);
mongoose.model('City', City);
mongoose.model('Shop', Shop);

  fn();
}

exports.defineModels = defineModels; 