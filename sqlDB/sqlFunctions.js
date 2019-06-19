'use strict';

const sql = require('mysql');
const setting = require('../settings/settings');

const mysql = sql.createConnection({
    user: setting.username,
    host: setting.host,
	password: setting.password,
    database: setting.database,
    options: {
        appName: setting.appname
	},
	connectionTimeout: 30 * 1000,
    requestTimeout: 30 * 1000
});

let alreadyConnected;

exports.getConnection = function(){
    return new Promise(function (resolve, reject) { 
        if(mysql) {
            return resolve();
        }      
        mysql = mysql.connect(function(err){
            if(err) {
                return reject(err);
            }
            else{
                return resolve(`sqlClient::connect successfully`);
            }
        });        
    });
}

exports.getOverview = (query) => {
    var finalResult = {};
    const newUser = `SELECT count(*) as newUser FROM developers WHERE MONTH(created) = MONTH(NOW());`;
    const node = `SELECT count(*) as node FROM developers WHERE language LIKE '%node%';`;
    const python = `SELECT count(*) as python FROM developers WHERE language LIKE '%python%'`;
    const java = `SELECT count(*) as java FROM developers WHERE language LIKE '%java%'`;
    const angular = `SELECT count(*) as angular FROM developers WHERE language LIKE '%angular%'`;
    const go = `SELECT count(*) as go FROM developers WHERE language LIKE '%go%'`;
    const totalDevelopers = `SELECT count(*) as total_user FROM developers`;
    const developers = `SELECT * FROM developers`;

    return new Promise((resolve, reject) => {
        mysql.query(newUser, (err, result) => {
            if(err) return reject(err);
            finalResult.newUser = result[0].newUser;
        });
        mysql.query(node, (err, result) => {
            if(err) return reject(err);
            finalResult.node = result[0].node;
        });
        mysql.query(python, (err, result) => {
            if(err) return reject(err);
            finalResult.python = result[0].python;
        });
        mysql.query(java, (err, result) => {
            if(err) return reject(err);
            finalResult.java = result[0].java;
        });
        mysql.query(angular, (err, result) => {
            if(err) return reject(err);
            finalResult.angular = result[0].angular;
        });
        mysql.query(go, (err, result) => {
            if(err) return reject(err);
            finalResult.go = result[0].go;
        });
        mysql.query(totalDevelopers, (err, result) => {
            if(err) return reject(err);
            finalResult.totalUsers = result[0].total_user;
        });
        mysql.query(developers, (err, result) => {
            if(err) return reject(err);
            finalResult.users = result;
            resolve(finalResult);
        });
    });
    return new Promise((resolve, reject) => {
        mysql.query(newDeveloperThisMonth, (err, result) => {
            if(err) return reject(err);
            finalResult.newUser = result[0].newuser;
        });
        mysql.query(totalLoginThisMonth, (err, result) => {
            if(err) return reject(err);
            finalResult.totalLogin = result[0].totallogin;
        });
        mysql.query(totalDevelopers, (err, result) => {
            if(err) return reject(err);
            finalResult.totalUsers = result[0].total_user;
        });
        mysql.query(users, (err, result) => {
            if(err) return reject(err);
            finalResult.users = result[0];
            resolve(finalResult);
        });
    });
}

exports.rowsAffected = (query) => {
    return new Promise((resolve, reject) => {
        mysql.query(query, (err, result) => {
            if(err) return reject(err);
            resolve(result.affectedRows);
        })
    })
}

exports.executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        mysql.query(query, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
}

exports.close = () => {
    connection.close();
}

exports.isConnected = () => {
    return connection == 'true';
}