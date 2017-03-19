'use strict';

module.exports = function(Group) {

	/**
	 *   group permission function
	 **/
	Group.permit = function(param, res, fn) {

		Group.app.models.groupMapping.updateAll({id: param.id}, {available: param.available},  function(err, res){                        

			// err
			if(err) return fn(err);   			

            if(param.available){
            	grantRoll(param.userId)
            	.then(function(res){
					return fn();
				}); 	    
            }else{
            	revokeRoll(param.userId)
            	.then(function(res){
					return fn();
				}); 	    
            }


        });   


		return fn.promise;
  	};

  	/**
	 *  grant role mapping
	**/  	
  	function grantRoll(userId){

  		return new Promise(function(resolve, reject){            
							
			//User subscription role 권한 부여
			Group.app.models.roleMapping.create({						
	            principalType: 'USER',
	            principalId: userId,
	            roleId: 'subscription'
			}, function(err, roleMapping) {
				// err 처리
				if (err) return reject(err);   
				return resolve(roleMapping);    
			});


		});	    
  	};

  	/**
	 *  revoke role mapping
	**/  	
  	function revokeRoll(userId){

  		return new Promise(function(resolve, reject){        
			
			//User subscription role 권한 삭제
			Group.app.models.roleMapping.deleteAll({						
	            principalId: userId,
	            principalType: "USER"
			}, function(err, roleMapping) {
				// err 처리
				if (err) return reject(err);   
				return resolve(roleMapping);    
			});

	    }); // end promise
  	};

  	Group.remoteMethod('permit',{
        	description: 'group permission',
        	accepts: [
          		{ arg: 'param', type: 'object', required: true, http: { source: 'body' }},
          		{ arg: 'res', type: 'object', 'http': {source: 'res'} }
        	],
        	returns: {
          		arg: 'res', type: 'object', root: true,
        	},
        	http: { verb: 'put' },
      	}
    );
};
