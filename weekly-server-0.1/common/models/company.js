'use strict';

module.exports = function(Company) {

	/**
     *  Company search
    **/ 
    Company.search = function (ctx,options,cb) {


   		var obj = ctx.req.query.filter;
        
        if(null != obj)
        {
            obj = JSON.parse(ctx.req.query.filter);
            obj.fields = {
                id: true, 
                name: true              
            };
        }
        else
        {
            obj = {
                fields :{
                    id: true, 
                    name: true
                }
            }
        }

        Company.find(obj,  function(err, result) { 
            ctx.res.send(result);
        });
    };

    Company.remoteMethod(
        'search',
        {
            description: 'search a company',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} },
                { arg: 'res', type: 'object', 'http': {source: 'res'} }
            ],
            returns: {
                arg: 'array', type: 'array', root: true
            },            
            http: {verb: 'get'} 
        }
    );
};
