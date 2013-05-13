
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , drive = require('google-drive')
  , fs = require('fs');





var csv = require('csv');



var it = csv();

var activites = {};

function genKey(activity) {
	return activity.replace(/\//g, '').replace(/ /g, '-');
}

function registerPerson(person) {
	for(var i = 0; i < person.activites.length; i++) {
		person.activites[i] = person.activites[i].trim();
		if(person.activites[i] && person.email.indexOf('@') > -1 && person.activites[i] !== 'What activities are you interested in?') {
			var key = genKey(person.activites[i]);
			if(!activites[key]) {
				activites[key] = {
					name: person.activites[i],
					key: key,
					people: []
				}
			}

			activites[key].people.push(person);
			
		}
	}
}

function parseRecord(data) {
	var person = {
		name: data[1],
		email: data[2],
		activites: data[3].split(',')
	};
	registerPerson(person);
}

it.from(__dirname+'/campbell.csv')
.transform(parseRecord).on('end',function(count){
    for(var i in activites) {
    	console.log(activites[i].name + ' = ' + activites[i].people.length);

    	var content = '';

    	for(var x = 0; x < activites[i].people.length; x++) {
    		var person = activites[i].people[x];
    		content += person.name + ', ' + person.email + '\n';
    	}

		fs.writeFile('lists/'+activites[i].key+'.csv', content, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
}); 


    }
});
/*
.on('data',function(data,index){
    console.log('#'+index+' '+JSON.stringify(data));
})
.on('end',function(count){
    console.log('Number of lines: '+count);
})
.on('error',function(error){
    console.log(error.message);
});
*/

  /*

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/