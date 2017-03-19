'use strict';

module.exports = function(Role) {

	/**
	 *  grant grant.
	 **/
	Role.grant = function(credentials, res, fn) {

		// User subscription role 권한 부여
		Role.app.models.roleMapping.create({						
            principalType: 'USER',
            principalId: members.principalId,
            roleId: 'subscription'
		}, function(err, roleMapping) {
			// err 처리
			if (err) return fn(err);  
			return fn(); 	
		});

		return fn.promise;
  	};


  	Role.remoteMethod('grant',{
        	description: 'grant user role',
        	accepts: [
          		{ arg: 'credentials', type: 'object', required: true, http: { source: 'body' }},
          		{ arg: 'res', type: 'object', 'http': {source: 'res'} }
        	],
        	returns: {
          		arg: 'accessToken', type: 'object', root: true,
        	},
        	http: { verb: 'post' },
      	}
    );
};
