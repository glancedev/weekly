'use strict';

module.exports = function(Person) {

	/**
	 *  Person search
	**/ 
	Person.search = function (ctx,options,cb) {
		
		var obj = ctx.req.query.filter;
		
		if(null != obj)
		{
			obj = JSON.parse(ctx.req.query.filter);
			obj.fields = {
				id: true, 
				name: true
				// type: true   			
			};
		}
		else
		{
			obj = {
				fields :{
					id: true, 
					name: true
					// type: true
				}
			}
		}

		Person.find(obj,  function(err, result) { 
			ctx.res.send(result);
		});
	};

	Person.remoteMethod(
		'search',
		{
			description: 'search a person',
			accepts: [
				{ arg: 'ctx', type: 'object', http: { source:'context' } },
				{ arg: 'filter', type: 'object', http:{ source: 'query'} },
				{ arg: 'res', type: 'object', 'http': {source: 'res'} }
			],
			returns: {
				arg: 'array', type: 'array', root: true	
			},            
			http: {verb: 'get'} 
		}
	);
};
