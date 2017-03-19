
// module.exports = function(app) {
	
// 	var User = app.models.user;
// 	var Role = app.models.role;
// 	var RoleMapping = app.models.roleMapping;	

// 	User.create([
// 		{userId: 'weekly', username: '위클리', email: 'weekly@weekly.com', password: 'weekly', available: true, type: 'admin'},		
// 		{userId: 'weekly2', username: '위클리 2', email: 'weekly2@weekly.com', password: 'weekly2', available: true, type: 'admin'},
// 	], function(err, users) {
// 		if (err) throw err;

// 		console.log('Created users:', users);

// 		Role.create({
// 			id: 'super',
// 			name: 'super',
// 			description: 'CMS 모든 권한'
// 		}, function(err, role) {
// 			if (err) throw err;

// 			console.log('Created role:', role);

// 			//make bob an admin
// 			role.principals.create({
// 				// principalType: RoleMapping.ADMIN,
// 				principalType: RoleMapping.USER,
// 				principalId: users[0].id				
// 			}, function(err, principal) {
// 				if (err) throw err;

// 				console.log('Created principal:', principal);
// 			});
// 		});

// 		//create the admin role
// 		Role.create({
// 			id: 'admin',
// 			name: 'admin',
// 			description: 'CMS admin 권한'
// 		}, function(err, role) {
// 			if (err) throw err;

// 			console.log('Created role:', role);			

// 			//make bob an admin
// 			role.principals.create({
// 				// principalType: RoleMapping.ADMIN,
// 				principalType: RoleMapping.USER,
// 				principalId: users[0].id				
// 			}, function(err, principal) {
// 				if (err) throw err;

// 				console.log('Created principal:', principal);
// 			});
// 		});

// 		//create the admin role
// 		Role.create({
// 			id: 'person',
// 			name: 'person',
// 			description: '인물 권한'
// 		}, function(err, role) {
// 			if (err) throw err;

// 			console.log('Created role:', role);			

// 			//make bob an admin
// 			role.principals.create({
// 				// principalType: RoleMapping.ADMIN,
// 				principalType: RoleMapping.USER,
// 				principalId: users[0].id				
// 			}, function(err, principal) {
// 				if (err) throw err;

// 				console.log('Created principal:', principal);
// 			});
// 		});

// 		//create the admin role
// 		Role.create({
// 			id: 'company',
// 			name: 'company',
// 			description: '회사/기관 권한'
// 		}, function(err, role) {
// 			if (err) throw err;

// 			console.log('Created role:', role);			

// 			//make bob an admin
// 			role.principals.create({
// 				// principalType: RoleMapping.ADMIN,
// 				principalType: RoleMapping.USER,
// 				principalId: users[0].id				
// 			}, function(err, principal) {
// 				if (err) throw err;

// 				console.log('Created principal:', principal);
// 			});
// 		});

// 		//create the admin role
// 		Role.create({
// 			id: 'news',
// 			name: 'news',
// 			description: '뉴스 권한'
// 		}, function(err, role) {
// 			if (err) throw err;

// 			console.log('Created role:', role);			

// 			//make bob an admin
// 			role.principals.create({
// 				// principalType: RoleMapping.ADMIN,
// 				principalType: RoleMapping.USER,
// 				principalId: users[0].id				
// 			}, function(err, principal) {
// 				if (err) throw err;

// 				console.log('Created principal:', principal);
// 			});
// 		});

// 		//create the admin role
// 		Role.create({
// 			id: 'event',
// 			name: 'event',
// 			description: '행사 권한'
// 		}, function(err, role) {
// 			if (err) throw err;

// 			console.log('Created role:', role);			

// 			//make bob an admin
// 			role.principals.create({
// 				// principalType: RoleMapping.ADMIN,
// 				principalType: RoleMapping.USER,
// 				principalId: users[0].id				
// 			}, function(err, principal) {
// 				if (err) throw err;

// 				console.log('Created principal:', principal);
// 			});
// 		});

// 		//create the admin role
// 		Role.create({
// 			id: 'business',
// 			name: 'business',
// 			description: '지원사업 권한'
// 		}, function(err, role) {
// 			if (err) throw err;

// 			console.log('Created role:', role);			

// 			//make bob an admin
// 			role.principals.create({
// 				// principalType: RoleMapping.ADMIN,
// 				principalType: RoleMapping.USER,
// 				principalId: users[0].id				
// 			}, function(err, principal) {
// 				if (err) throw err;

// 				console.log('Created principal:', principal);
// 			});
// 		});


// 		//create the admin role
// 		Role.create({
// 			id: 'subscription',
// 			name: 'subscription',
// 			description: '유료 사용자 권한'
// 		}, function(err, role) {
// 			if (err) throw err;
// 		});

// 	});
// };