

var secure	= require('./lib/secure')
	, rbytes = require('rbytes')
	, bcrypt = require('bcrypt')
	, t = require('tictoc');


t.tic();
var salt = rbytes.randomBytes(32).toHex();
var hashed = secure.aN(salt, 'senha123');
t.toc();

console.log('1024*sha256', hashed);
console.log();

t.tic();
var salt = bcrypt.gen_salt_sync(5);
var hash = bcrypt.encrypt_sync("B4c0/\/", salt);
t.toc()

console.log('bcrypt', hash);
console.log();

t.tic();
console.log(bcrypt.compare_sync("B4c0/\/", hash));
bcrypt.compare_sync("not_bacon", hash); // false
t.toc();