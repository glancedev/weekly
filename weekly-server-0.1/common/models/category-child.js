'use strict';

module.exports = function(Categorychildchild) {

	'use strict';

	module.exports = function(Categorychild) {


		/**
		 *  Person search
		**/ 
		Categorychild.search = function (ctx,options,cb) {
			
			var keword = ctx.req.query.filter.where.name.lkie;
			
			var obj = {
				fields : ['name', 'item'],
				limit: 5,
				where: {
					id: 'field',
					or: [
						{name: {like: keword}},
						{item: {like: keword}}
					]
				}
			}

			var arr = [];

			Categorychild.find(obj,  function(err, result) { 

				angular.forEach(result, function(value, i){
					if(null == value.name) arr.push(value.name);
					if(null == value.item){
						angular.forEach(value.item, function(value, i){
							arr.push(value);		
						})
					}
				});

				console.log(arr);

				ctx.res.send(arr);
			});
		};

		Categorychild.remoteMethod(
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

};
