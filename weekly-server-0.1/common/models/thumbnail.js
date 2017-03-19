'use strict';
var Promise = require('bluebird');
var util = require('./../../server/boot/util.js');
var CONTAINERS_URL = '/api/containers/';

module.exports = function(Thumbnail) {

	/**
     *  Thumbnail upload
    **/ 
   Thumbnail.upload = function (ctx,options,cb) {

        if(!options) options = {};

        ctx.req.params.container = util.makeFolderByPk(ctx.req.query.companyId, ctx.req.query.personId);        

        Thumbnail.app.models.container.upload(ctx.req, ctx.result, options, function (err, fileObj, next) {
            if(err) console.log('err', err); //util.logger('error').error("Thumbnail.upload", err);                                    
            else 
            {
                var fileInfo = fileObj.files.file;               

                for (var i = 0; i < fileInfo.length; i++) { 

                    // var alias = util.generateUUID(fileInfo[i].name);
                    var parts = fileInfo[i].name.split('.'), extension = parts[parts.length-1];
                    var alias = 'high.'+extension;

                    util.renameFile(fileInfo[i], alias)
                    .then(function(res){                                  

	                    Thumbnail.create({
	                        companyId: ctx.req.query.companyId,
	                        personId: ctx.req.query.personId,
	                        container: res.container,
	                        name: res.name,	                        
	                        default: CONTAINERS_URL+res.container+'/download/default.'+extension,
	                        medium: CONTAINERS_URL+res.container+'/download/medium.'+extension,
	                        high: CONTAINERS_URL+res.container+'/download/'+alias
	                    },function (err,obj) {
	                        if (err !== null) util.logger('error').error("thumbnail.upload", err);                                    
	                        else 
	                        {   
	                        	//default size
	                            util.resizeImg(res.container, alias, 'default.'+extension, 148);
	                            //medium size
	                            util.resizeImg(res.container, alias, 'medium.'+extension, 48);                            
	                            //response link                                                
	                            ctx.res.send({ "link": obj.url });
	                        }
	                    });
                    });

                }

            }
        });
    };

    Thumbnail.remoteMethod(
        'upload',
        {
            description: 'Uploads a Thumbnail',
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

};
