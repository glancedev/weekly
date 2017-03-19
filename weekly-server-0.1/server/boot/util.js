var fs = require('fs');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var uuid = require('node-uuid');
var Promise = require('bluebird');

// var log4js = require("log4js");
// log4js.configure(__dirname+'/../log4js_configuration.json');


/**
 *   Return log4js object
 **/
// exports.logger = function(type){
//     return log4js.getLogger(type);
// };


/**
 *   Create folder base on date
 **/
exports.makeFolderByDate = function(name){

    var date = moment(new Date()).format('YYYYMMDD');

    //Create storage datefolder
    var date_dir = path.join(__dirname + './../../server/storage/' + name + date);
    if (!fs.existsSync(date_dir)){
        fs.mkdirSync(date_dir);
    }

    return name + date;
};


/**
 *   Create folder base on pk
 **/
exports.makeFolderByPk = function(companyId, personId){

    var date = moment(new Date()).format('hhmmss');

    if(null == companyId) companyId = '';
    if(null == personId) personId = '';

    //Create storage datefolder
    var date_dir = path.join(__dirname + './../../server/storage/' + companyId + personId);
    if (!fs.existsSync(date_dir)){
        fs.mkdirSync(date_dir);
    }

    return companyId + personId;
};

/**
*	Get value from Cookies
*/
exports.parseCookies = function(res) {
    var list = {},
        rc = res.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
};

/**
*   generate UUID
*/
exports.generateUUID = function(fileName, req) {
    var origFilename = fileName;
    var parts = origFilename.split('.'), 
        extension = parts[parts.length-1];
    var newFilename = uuid.v1()+'.'+extension;
    
    return newFilename;
};

/**
*   generate UUID
*/
exports.generateTempPassword = function(info) {    
    return new Promise(function(resolve, reject){            

        var temp = uuid.v4().split('-');

        return resolve({info:info, password:temp[0]});        
    });
};

/**
*   rename file
*/
exports.renameFile = function(fileInfo, newFileName) {

    return new Promise(function(resolve, reject){            
        var path = __dirname+'/../storage/';

        fs.rename( path+fileInfo.container+'/'+fileInfo.name, path+fileInfo.container+'/'+newFileName, function (err) {
            
            if (err) return reject(false);

            return resolve(fileInfo);    
        });
    });
};



/**
 *	Resize image file
**/
exports.resizeImg = function(container, oldName, newName, size){
    
    var path = __dirname+'/../storage/';
    var opt, timeStarted = new Date;    

    im.resize(opt = {
        srcPath: path +container+ '/' +oldName,
        dstPath: path +container+ '/' +newName,
        width: size
    }, function (err, stdout, stderr){
        
        if (err) {            
            console.error(err.stack || err);
            //return Promise.resolve(false);
        }else{
            console.log('crop(',opt,') ->', stdout);
            console.log('Real time spent: '+(new Date() - timeStarted) + ' ms');            

            //return Promise.resolve(stdout);
        }        
    });
}; 