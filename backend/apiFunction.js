var colors = require('colors')
var sqlFunction = require('../sqlDb/sqlFunctions');
var timeAgo = require('node-time-ago');

exports.getOverview = function(){
    return new Promise((resolve, reject) => {			
        sqlFunction.getConnection().then(function(data) { 
            sqlFunction.getOverview().then(function(dataOverview) {
                if(dataOverview){
                    resolve(successObj(dataOverview)); 
                }else{
                    reject(failedObj(data));      
                }
            });
        });
    });
}

exports.getDevelopers = function(){
    return new Promise((resolve, reject) => {	
        sqlFunction.getConnection().then(function(data) {
            var query = `SELECT CONCAT(UCASE(LEFT(name, 1)), SUBSTRING(name, 2)) as username, CONCAT(UCASE(LEFT(company, 1)), SUBSTRING(company, 2)) as company, language, created FROM developers ORDER BY name asc`;
            sqlFunction.executeQuery(query).then(function(users) {
                if(users){
                    var finalResult = [{}]
                    for(var i=0; i<users.length; i++){
                        var item = users[i];   
                        var created = String(users[i].created.toString().substring(0,24));
                        finalResult.push({ 
                            "users" : item.username,
                            "company" : item.company,
                            "language" : item.language,
                            "created" : timeAgo(created)
                        });
                    }
                    resolve(successObj(finalResult)); 
                }else{
                    reject(failedObj(data));      
                }
            });
        });
    });
}

exports.getCompaniesByLang = function(req, res){
    var params = req.params;
    return new Promise((resolve, reject) => {	
        sqlFunction.getConnection().then(function(data) {  
            var query = `SELECT CONCAT(UCASE(LEFT(company, 1)), SUBSTRING(company, 2)) as company, language FROM developers WHERE language LIKE '%${params.language}%'`;
            sqlFunction.executeQuery(query).then(function(company) {
                if(company){
                    resolve(successObj(company)); 
                }else{
                    reject(failedObj(data));      
                }
            });
        });
    });
}

exports.getDeveloperName = function(){
    return new Promise((resolve, reject) => {			
        sqlFunction.getConnection().then(function(data) {  
            var query = `SELECT CONCAT(UCASE(LEFT(name, 1)), SUBSTRING(name, 2)) as users, CONCAT(UCASE(LEFT(company, 1)), SUBSTRING(company, 2)) as company, language From developers ORDER BY name asc`;
            sqlFunction.executeQuery(query).then(function(users) {
                if(users){
                    resolve(successObj(users)); 
                }else{
                    reject(failedObj(data));      
                }
            });
        });
    });
}

exports.addDeveloper = function(req, res){
    var body = req.body;
    return new Promise((resolve, reject) => {           
        sqlFunction.getConnection().then(function(data) {  
            var query = `INSERT INTO developers VALUES ('',LOWER('${body.developername}'), LOWER('${body.company}'), LOWER('${body.language}'), NOW())`;
            sqlFunction.rowsAffected(query).then(function(inserted) {
                res.send(successObj(inserted))
                if(inserted){
                    res.send(successObj(inserted))
                    resolve(); 
                }else{
                    res.send(failedObj("Something went wrong with add developer"));
                    reject();      
                }
            });
        });
    });
}

exports.deleteDeveloper = function(req, res){
    var body = req.body;
    return new Promise((resolve, reject) => {			
        sqlFunction.getConnection().then(function(data) {  
            var query = `DELETE FROM developers WHERE name = LOWER('${body.developername}')`;
            sqlFunction.rowsAffected(query).then(function(deleted) {
                if(deleted){
                    res.send(successObj(deleted))
                    resolve(); 
                }else{
                    res.send(failedObj("Something went wrong with delete developer"));
                    reject();      
                }
            });
        });
    });
}

exports.getDeveloper = function(req, res){
    var body = req.body;
    return new Promise((resolve, reject) => {           
        sqlFunction.getConnection().then(function(data) {  
            var query = `SELECT CONCAT(UCASE(LEFT(name, 1)), SUBSTRING(name, 2)) as username, CONCAT(UCASE(LEFT(company, 1)), SUBSTRING(company, 2)) as company, language FROM developers WHERE name = '${body.username}'`;
            sqlFunction.executeQuery(query).then(function(userinfo) {
                if(userinfo){
                    res.send(successObj(userinfo[0]))
                    resolve(); 
                }else{
                    res.send(failedObj(data));
                    reject();      
                }
            });
        });
    });
}

exports.editDeveloper = function(req, res){
    var body = req.body;
    return new Promise((resolve, reject) => {           
        sqlFunction.getConnection().then(function(data) {  
            var query = `UPDATE developers SET name = '${body.updatedUsername}', company = '${body.company}', language = '${body.language}' WHERE name = '${body.username}'`;
            sqlFunction.rowsAffected(query).then(function(updated) {
                if(updated){
                    res.send(successObj(updated[0]))
                    resolve();
                }else{
                    res.send(failedObj(data));
                    reject();      
                }
            });
        });
    });
}

function successObj(result) {
	var resObj = { 'error': false }
    if (result){ resObj['body'] = result; }
    return resObj;
}

function failedObj(result) {
	var resObj = { 'error': true }
    if (result){ resObj['body'] = result; }
    return resObj;
}