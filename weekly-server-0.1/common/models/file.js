'use strict';
var Promise = require('bluebird');
var util = require('./../../server/boot/util.js');
var CONTAINERS_URL = '/api/containers/';

module.exports = function(File) {

    /**
     *  file upload
    **/ 
   File.upload = function (ctx,options,cb) {

        if(!options) options = {};

        ctx.req.params.container = util.makeFolderByDate('banner_');   // create banner foler by date  

        File.app.models.container.upload(ctx.req, ctx.result, options, function (err, fileObj, next) {
            if(err) console.log('err', err); //util.logger('error').error("File.upload", err);                                    
            else 
            {
                var fileInfo = fileObj.files.file;

                // console.log('========================');
                // console.log('res', ctx.req.query);   
                // console.log('res', ctx.req.params);                 
                
                for (var i = 0; i < fileInfo.length; i++) { 

                    var alias = util.generateUUID(fileInfo[i].name);               

                    util.renameFile(fileInfo[i], alias)
                    .then(function(res){                                  

                        File.create({
                            companyId: ctx.req.query.companyId,  //company model 
                            personId: ctx.req.query.personId, //person model 
                            bannerId: ctx.req.query.bannerId, //banner model 
                            container: res.container,
                            name: res.name,          
                            alias: alias,               
                            type: res.type,
                            size: res.size,
                            url: CONTAINERS_URL+res.container+'/download/'+alias
                        },function (err,obj) {
                            if (err !== null) util.logger('error').error("thumbnail.upload", err);                                    
                            else 
                            {   
                                //response link                                                
                                ctx.res.send({ "link": obj.url });
                            }
                        });
                    });

                }

            }
        });
    };

    File.remoteMethod(
        'upload',
        {
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} },
                { arg: 'res', type: 'object', 'http': {source: 'res'} }
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },            
            http: {verb: 'post'} 
        }
    );


    // File.mUpload = function (ctx,options,cb) {

    //     if(!options) options = {};

    //     // ctx.req.params.container = 'art';        
    //     ctx.req.params.container = util.makeFolderByDate();

    //     File.app.models.container.upload(ctx.req, ctx.result, options, function (err, fileObj, next) {
    //         if(err) util.logger('error').error("File.mUpload", err);                                    
    //         else {
    //             var fileInfo = fileObj.files.file[0];
                
    //             File.create({
    //                 name: fileInfo.name,
    //                 type: fileInfo.type,
    //                 size: fileInfo.size,
    //                 container: fileInfo.container,
    //                 alias: fileObj.fields.alias,
    //                 artId: parseInt(fileObj.fields.artId),                    
    //                 url: CONTAINERS_URL+fileInfo.container+'/download/'+fileInfo.name
    //             },function (err,obj) {
    //                 if (err !== null) 
    //                 {                    
    //                     util.logger('error').error("File.create", err);                                    
    //                     ctx.res.send({"result":500});              
    //                 } 
    //                 else 
    //                 { 
    //                     if(fileInfo.size >= 1024) util.resizeImg(fileInfo.container, fileInfo.name, 480);                    

    //                     //profile img  
    //                     if(fileInfo.originalFilename.includes("profile_img.png")) util.resizeImg(fileInfo.container, fileInfo.name, 72);
                      
    //                     //response link                                                
    //                     ctx.res.send({ "link": obj.url });
    //                 }
    //             });
    //         }
    //     });
    // };

    // File.remoteMethod(
    //     'mUpload',
    //     {
    //         description: 'Uploads a file',
    //         accepts: [
    //             { arg: 'ctx', type: 'object', http: { source:'context' } },
    //             { arg: 'options', type: 'object', http:{ source: 'query'} },
    //             { arg: 'res', type: 'object', 'http': {source: 'res'} }
    //         ],
    //         returns: {
    //             arg: 'fileObject', type: 'object', root: true
    //         },            
    //         http: {verb: 'post'}
    //     }
    // );
};
