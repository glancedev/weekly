'use strict';

module.exports = function(Category) {


	/**
	 *  Category search
	**/ 
	Category.search = function (ctx, id, filter, fn) {

		var keword = filter.where.name.like;			

		var obj = {
			fields : ['name'],
			limit: 5,
			where: {
				and: [
					{categoryId: id},
					{or: [
						{name: {like: keword}}						
					]}
				]
			}
		};

		var arr = [];

		Category.app.models.CategoryChild.find(obj, function(err, result) { 

			// console.log('result', result);

			if(err) console.log(err);
			
			ctx.res.send(result);


			// if(null == result.length) return fn(arr);

			// for (var i = 0; i < result.length; i++) {
					
			// 	if(null == result[i].name) arr.push(result[i].name);
			// 	if(null == result[i].item){
			// 		for (var j = 0; j < result[i].item.length; j++) {
			// 			arr.push(result[i].item[j]);		
			// 		}
			// 	}

			// 	console.log('log ', result.length, i)

			// 	if(i == result.length-1){				
			// 		console.log('arr', arr);
			// 		return fn(arr);
			// 	}
			// }

			// return fn.promise;

		});
	};

	Category.remoteMethod(
		'search',
		{
			description: 'search a person',
			accepts: [
				{ arg: 'ctx', type: 'object', http: { source:'context' } },
				{ arg: 'id', type: 'string', http:{ source: 'query'} },
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
