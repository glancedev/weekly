'use strict';

var Promise = require('bluebird');
var util = require('./../../server/boot/util.js');
// var debug = require('debug')('loopback:user');

var from_email = 'startupweekly@naver.com';

var html_reset_password = '<!DOCTYPE html><meta content="width=device-width"name=viewport><meta content="text/html; charset=UTF-8"http-equiv=Content-Type><title>STARTUP WEEKLY</title><style>*{font-family:"Helvetica Neue",Helvetica,Helvetica,Arial,sans-serif;font-size:100%;line-height:1.6em;margin:0;padding:0}img{max-width:600px;width:100%}body{-webkit-font-smoothing:antialiased;height:100%;-webkit-text-size-adjust:none;width:100%!important}a{color:#348eda}.btn-primary{display:initial;Margin-bottom:10px;width:auto!important}.btn-primary td{background-color:#62cb31;border-radius:3px;font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;font-size:14px;text-align:center;vertical-align:top}.btn-primary td a{background-color:#62cb31;border:solid 1px #62cb31;border-radius:3px;border-width:4px 20px;display:inline-block;color:#fff;cursor:pointer;font-weight:700;line-height:2;text-decoration:none}.last{margin-bottom:0}.first{margin-top:0}.padding{padding:10px 0}table.body-wrap{padding:20px;width:100%}table.body-wrap .container{border:1px solid #e4e5e7}table.footer-wrap{clear:both!important;width:100%}.footer-wrap .container p{color:#666;font-size:12px}table.footer-wrap a{color:#999}h1,h2,h3{color:#111;font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;font-weight:200;line-height:1.2em;margin:40px 0 10px}h1{font-size:36px}h2{font-size:28px}h3{font-size:22px}ol,p,ul{font-size:14px;font-weight:400;margin-bottom:10px}ol li,ul li{margin-left:5px;list-style-position:inside}.container{clear:both!important;display:block!important;Margin:0 auto!important;max-width:600px!important}.body-wrap .container{padding:40px}.content{display:block;margin:0 auto;max-width:600px}.content table{width:100%}</style><body bgcolor=#f7f9fa><table class=body-wrap bgcolor=#f7f9fa><tr><td><td class=container bgcolor=#FFFFFF><div class=content><table style=text-align:center><tr><td><strong>패스워드를 재설정 하십시오.</strong><br><br><p>아래 링크를 클릭하셔서 패스워드를 재설정하여 주시기 바랍니다.</p><br><table class=btn-primary border=0 cellpadding=0 cellspacing=0 style=width:100%><tbody style=text-align:center><tr><td><a href=http://startupweekly.net/password_change/{{userId}}/{{access_token}}>패스워드 재설정하기.</a></table><br><br><br><p>실수로 이 메일을 받으셨다면 삭제해 주시기 바랍니다.<p>위 링크를 클릭하시지 않으면 아무 일도 발생하지 않습니다.<p>문의사항이 있으신 경우 hello@startupweekly.net 으로 메일을 보내주시기 바랍니다.</p><br><br><p style=text-align:center><a href=http://startupweekly.net/ ></a>STARTUP WEEKLY</table></div><td></table><table class=footer-wrap><tr><td><td class=container><td></table>';
var html_block = '<!DOCTYPE html><meta content="width=device-width"name=viewport><meta content="text/html; charset=UTF-8"http-equiv=Content-Type><title>STARTUP WEEKLY</title><style>*{font-family:"Helvetica Neue",Helvetica,Helvetica,Arial,sans-serif;font-size:100%;line-height:1.6em;margin:0;padding:0}img{max-width:600px;width:100%}body{-webkit-font-smoothing:antialiased;height:100%;-webkit-text-size-adjust:none;width:100%!important}a{color:#348eda}.btn-primary{display:initial;Margin-bottom:10px;width:auto!important}.btn-primary td{background-color:#62cb31;border-radius:3px;font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;font-size:14px;text-align:center;vertical-align:top}.btn-primary td a{background-color:#62cb31;border:solid 1px #62cb31;border-radius:3px;border-width:4px 20px;display:inline-block;color:#fff;cursor:pointer;font-weight:700;line-height:2;text-decoration:none}.last{margin-bottom:0}.first{margin-top:0}.padding{padding:10px 0}table.body-wrap{padding:20px;width:100%}table.body-wrap .container{border:1px solid #e4e5e7}table.footer-wrap{clear:both!important;width:100%}.footer-wrap .container p{color:#666;font-size:12px}table.footer-wrap a{color:#999}h1,h2,h3{color:#111;font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;font-weight:200;line-height:1.2em;margin:40px 0 10px}h1{font-size:36px}h2{font-size:28px}h3{font-size:22px}ol,p,ul{font-size:14px;font-weight:400;margin-bottom:10px}ol li,ul li{margin-left:5px;list-style-position:inside}.container{clear:both!important;display:block!important;Margin:0 auto!important;max-width:600px!important}.body-wrap .container{padding:40px}.content{display:block;margin:0 auto;max-width:600px}.content table{width:100%}</style><body bgcolor=#f7f9fa><table class=body-wrap bgcolor=#f7f9fa><tr><td><td class=container bgcolor=#FFFFFF><div class=content><table style=text-align:center><tr><td><strong>계정 정지</strong><br><br><p>귀하의 계정이 관리자에 의해 정지되어 사용이 일시 중지된 상태입니다.<p>help@startupweekly.net으로 문의해 주시기 바랍니다.</p><br><br><br><br><p>실수로 이 메일을 받으셨다면 삭제해 주시기 바랍니다.<p>위 링크를 클릭하시지 않으면 아무 일도 발생하지 않습니다.<p>문의사항이 있으신 경우 hello@startupweekly.net 으로 메일을 보내주시기 바랍니다.</p><br><br><p style=text-align:center><a href=http://startupweekly.net/ ></a>STARTUP WEEKLY</table></div><td></table><table class=footer-wrap><tr><td><td class=container><td></table>';
var html_member_wait = '<!DOCTYPE html><meta content="width=device-width"name=viewport><meta content="text/html; charset=UTF-8"http-equiv=Content-Type><title>STARTUP WEEKLY</title><style>*{font-family:"Helvetica Neue",Helvetica,Helvetica,Arial,sans-serif;font-size:100%;line-height:1.6em;margin:0;padding:0}img{max-width:600px;width:100%}body{-webkit-font-smoothing:antialiased;height:100%;-webkit-text-size-adjust:none;width:100%!important}a{color:#348eda}.btn-primary{display:initial;Margin-bottom:10px;width:auto!important}.btn-primary td{background-color:#62cb31;border-radius:3px;font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;font-size:14px;text-align:center;vertical-align:top}.btn-primary td a{background-color:#62cb31;border:solid 1px #62cb31;border-radius:3px;border-width:4px 20px;display:inline-block;color:#fff;cursor:pointer;font-weight:700;line-height:2;text-decoration:none}.last{margin-bottom:0}.first{margin-top:0}.padding{padding:10px 0}table.body-wrap{padding:20px;width:100%}table.body-wrap .container{border:1px solid #e4e5e7}table.footer-wrap{clear:both!important;width:100%}.footer-wrap .container p{color:#666;font-size:12px}table.footer-wrap a{color:#999}h1,h2,h3{color:#111;font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;font-weight:200;line-height:1.2em;margin:40px 0 10px}h1{font-size:36px}h2{font-size:28px}h3{font-size:22px}ol,p,ul{font-size:14px;font-weight:400;margin-bottom:10px}ol li,ul li{margin-left:5px;list-style-position:inside}.container{clear:both!important;display:block!important;Margin:0 auto!important;max-width:600px!important}.body-wrap .container{padding:40px}.content{display:block;margin:0 auto;max-width:600px}.content table{width:100%}</style><body bgcolor=#f7f9fa><table class=body-wrap bgcolor=#f7f9fa><tr><td><td class=container bgcolor=#FFFFFF><div class=content><table style=text-align:center><tr><td><strong>승인 대기 중인 구성원이 있습니다</strong><br><br><p>귀사의 코드를 입력하여 구독 신청한 1명의 구성원이 현재 귀사의 승인을 대기 중입니다.<p>아래 링크를 클릭하여 승인 여부를 결정해 주시면 감사하겠습니다.</p><br><table class=btn-primary border=0 cellpadding=0 cellspacing=0 style=width:100%><tbody style=text-align:center><tr><td><a href=http://startupweekly.net/member/wait>승인 대기 페이지로 가기</a></table><br><br><br><p>실수로 이 메일을 받으셨다면 삭제해 주시기 바랍니다.<p>위 링크를 클릭하시지 않으면 아무 일도 발생하지 않습니다.<p>문의사항이 있으신 경우 hello@startupweekly.net 으로 메일을 보내주시기 바랍니다.</p><br><br><p style=text-align:center><a href=http://startupweekly.net/ ></a>STARTUP WEEKLY</table></div><td></table><table class=footer-wrap><tr><td><td class=container><td></table>';
var html_confirm = '<!DOCTYPE html><meta content="width=device-width"name=viewport><meta content="text/html; charset=UTF-8"http-equiv=Content-Type><title>STARTUP WEEKLY</title><style>*{font-family:"Helvetica Neue",Helvetica,Helvetica,Arial,sans-serif;font-size:100%;line-height:1.6em;margin:0;padding:0}img{max-width:600px;width:100%}body{-webkit-font-smoothing:antialiased;height:100%;-webkit-text-size-adjust:none;width:100%!important}a{color:#348eda}.btn-primary{display:initial;Margin-bottom:10px;width:auto!important}.btn-primary td{background-color:#62cb31;border-radius:3px;font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;font-size:14px;text-align:center;vertical-align:top}.btn-primary td a{background-color:#62cb31;border:solid 1px #62cb31;border-radius:3px;border-width:4px 20px;display:inline-block;color:#fff;cursor:pointer;font-weight:700;line-height:2;text-decoration:none}.last{margin-bottom:0}.first{margin-top:0}.padding{padding:10px 0}table.body-wrap{padding:20px;width:100%}table.body-wrap .container{border:1px solid #e4e5e7}table.footer-wrap{clear:both!important;width:100%}.footer-wrap .container p{color:#666;font-size:12px}table.footer-wrap a{color:#999}h1,h2,h3{color:#111;font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;font-weight:200;line-height:1.2em;margin:40px 0 10px}h1{font-size:36px}h2{font-size:28px}h3{font-size:22px}ol,p,ul{font-size:14px;font-weight:400;margin-bottom:10px}ol li,ul li{margin-left:5px;list-style-position:inside}.container{clear:both!important;display:block!important;Margin:0 auto!important;max-width:600px!important}.body-wrap .container{padding:40px}.content{display:block;margin:0 auto;max-width:600px}.content table{width:100%}</style><body bgcolor=#f7f9fa><table class=body-wrap bgcolor=#f7f9fa><tr><td><td class=container bgcolor=#FFFFFF><div class=content><table style=text-align:center><tr><td><strong>PRO 멤버십 승인 완료</strong><br><br><p>귀하의 PRO 멤버십 등록이 승인되었습니다. 지금부터 PRO 모든 정보와 기능을 열람하실 수 있습니다.<p>추진하시는 일에 미력이나마 보탬이 될 수 있도록 최선을 다하겠습니다.</p><br><table class=btn-primary border=0 cellpadding=0 cellspacing=0 style=width:100%><tbody style=text-align:center><tr><td><a href="http://startupweekly.net/login">로그인 하기</a></table><br><br><br><p>실수로 이 메일을 받으셨다면 삭제해 주시기 바랍니다.<p>위 링크를 클릭하시지 않으면 아무 일도 발생하지 않습니다.<p>문의사항이 있으신 경우 hello@startupweekly.net 으로 메일을 보내주시기 바랍니다.</p><br><br><p style=text-align:center><a href=http://startupweekly.net/ ></a>STARTUP WEEKLY</table></div><td></table><table class=footer-wrap><tr><td><td class=container><td></table>';

module.exports = function(User) {

	// Remove existing validations for email
	delete User.validations.username;

	User.validatesUniquenessOf('userId', { message: 'userId already exists' });


	/**
	 *  Custom Login.
	 **/
	User.singUp = function(credentials, res, fn) {



		// 구독 유료 기간 설정, default 값 오늘 날짜기준 + 1month, (관리자가 시각으로 확인하는 용도이며 날짜가 지났다고 하여 권한 삭제 안됨)
		var today = new Date();		
		var dueDate = today.setMonth(today.getMonth() + 1);
		var code = credentials.code;

		// 그룹 멤버 생성 가능 수 설정, default 값 1명
		var limit = 1; 

		if(null != credentials.dueDate) dueDate = credentials.dueDate; 
		if(null != credentials.limit) limit = credentials.limit; 
		if(null == code || code == '') code = 'false';

		delete credentials.dueDate;
		delete credentials.limit;
		delete credentials.code;

		User.app.models.group.findOne({where:{id: code}}, function(err, group) {
			// err 처리
			if(err){
				console.log('err', err);	
				return fn(err);  
			}

			// console.log('그룹 코드가 ', code, group);

			// 그룹 코드를 입력했는데 그룹이 존재하지 않을 시.
			if(code != 'false' && null == group ) return fn('code');   
			else{

				// User type이 널일 경우
				if(credentials.type == null){
					if(code == 'false') credentials.type = 'private'; 	
					else credentials.type = 'member';
				}
								
				// User model 생성
				User.create(credentials, function (err, user) {	     
					// email, user validation 에러시, err message 리턴	
					if(err){
						console.log('err', err);	
						return fn(err);  
					} 		

					// User group 생성	
					if(credentials.type === 'member')
					{	
						// 승인 대기 이메일을 그룹장에게 발송한다.
						sendEmail(group.userId);
						
						// user type이 member 이면, group code를 가지고 group 맵핑한다.
						createGroupMapping(user, code)
						.then(function(res){							
							return fn();
						}); 	                
					}
					else
					{				
						// user type이 group 또는 private 일시 그룹 생성을 한다.
						// duedate가 null일시 default는 현재날짜+한달이다.
						// limit(그룹멤버 생성가능 인원)은 null일시, default 한명이다.
						createGroup(user, dueDate, limit)
						.then(function(res){							
							return fn();
						}); 	                				
					} // end if 

			    });
			}
		});


		return fn.promise;
  	};

  	/**
	 *  send waiting email to group leader 
	**/  	
  	function sendEmail(userId){
  		User.findById(userId, function(err, user) {
  			
  			if(err){
				console.log('sendEmail err', err);					
			}
			else{
				User.email(user.email, 'wait', null);
			}

  		});
  	};

	/**
	 *  create User group and group mapping
	**/  	
  	function createGroup(user, dueDate, limit){

  		return new Promise(function(resolve, reject){            	  	
			user.group.create({dueDate:dueDate, limit:limit}, function(err, group) {
				// err 처리
				if (err) return fn(err);   

				// User group 맵핑
				group.members.create({
					available: true, 
					principalType: 'ADMIN', 
					principalId: group.userId
				}, function(err, members) {
					// err 처리
					if (err) return reject(err);   

					// User subscription role 권한 부여
					User.app.models.roleMapping.create({						
			            principalType: 'USER',
			            principalId: members.principalId,
			            roleId: 'subscription'
					}, function(err, roleMapping) {
						// err 처리
						if (err) return reject(err);   
						return resolve(roleMapping);    
					});
				}); // end group member created
			});
	    }); // end promise
  	};

  	/**
	 *  create User group mapping
	**/  	
  	function createGroupMapping(user, code){

  		return new Promise(function(resolve, reject){            	  	
			// User group 맵핑
			User.app.models.groupMapping.create({
				available: false, 
				principalType: 'USER', 
				principalId: user.userId,
				groupId: code
			}, function(err, members) {
				// err 처리
				if (err) return reject(err);   
				return resolve(members);    

				// User subscription role 권한 부여
				// User.app.models.roleMapping.create({						
		  //           principalType: 'USER',
		  //           principalId: members.principalId,
		  //           roleId: 'subscription'
				// }, function(err, roleMapping) {
				// 	// err 처리
				// 	if (err) return reject(err);   
				// 	return resolve(roleMapping);    
				// });

			}); // end group member created
	    }); // end promise
  	};


  	User.remoteMethod('singUp',{
        	description: 'user sing up',
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


	/**
	 *  Custom Login.
	 **/
	User.login = function(credentials, include, fn) {
    	var self = this;

    	// ttl이 널이면 default 값 1day 이다. 
		credentials.ttl =  60 * 60 * 24;
    	
    	if (typeof include === 'function') {
      		fn = include;
      		include = undefined;
    	}	

    	fn = fn || utils.createPromiseCallback();

    	include = (include || '');
    	
    	if (Array.isArray(include)) {
      		include = include.map(function(val) {
        		return val.toLowerCase();
      		});
    	} else {
      		include = include.toLowerCase();
    	}

	    var realmDelimiter;
	    // Check if realm is required
	    var realmRequired = !!(self.settings.realmRequired || self.settings.realmDelimiter);

	    if (realmRequired) {
	      	realmDelimiter = self.settings.realmDelimiter;
	    }

	    var query = self.normalizeCredentials(credentials, realmRequired, realmDelimiter);

	    if (realmRequired && !query.realm) {
	      	var err1 = new Error('{{realm}} is required');
	      	err1.statusCode = 400;
	      	err1.code = 'REALM_REQUIRED';
	      	fn(err1);
	      	return fn.promise;
	    }
	    
	    if (!query.email && !query.userId) {
	      	var err2 = new Error('{{username}} or {{email}} is required');
	      	err2.statusCode = 400;
	      	err2.code = 'USERNAME_EMAIL_REQUIRED';
	      	fn(err2);
	      	return fn.promise;
	    }

    	self.findOne({ include:['group'], where: query }, function(err, user) {
      	
      	var defaultError = new Error('login failed');
      	defaultError.statusCode = 401;
      	defaultError.code = 'LOGIN_FAILED';

      	function tokenHandler(err, token) {
        	
        	if (err) return fn(err);

        	if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
          	
		          	// NOTE(bajtos) We can't set token.user here:
		          	//  1. token.user already exists, it's a function injected by
		          	//     "AccessToken belongsTo User" relation
		          	//  2. ModelBaseClass.toJSON() ignores own properties, thus
		          	//     the value won't be included in the HTTP response
		          	// See also loopback#161 and loopback#162
		          	token.__data.user = user;
	        	}
	        	fn(err, token);
	      	}

	      	if (err) {
	        	//debug'An error is reported from User.findOne: %j', err);
	        	fn(defaultError);
	      	} else if (user) {
	        	user.hasPassword(credentials.password, function(err, isMatch) {
	          	
		          	if (err) {
		            	//debug'An error is reported from User.hasPassword: %j', err);
		            	fn(defaultError);
		          	} else if (isMatch) {
		            	if (self.settings.emailVerificationRequired && !user.emailVerified) {
		              		// Fail to log in if email verification is not done yet
		              		//debug'User email has not been verified');
		              		err = new Error('login failed as the email has not been verified');
		              		err.statusCode = 401;
		              		err.code = 'LOGIN_FAILED_EMAIL_NOT_VERIFIED';
		              		fn(err);
		            	} else {    
		            		
		            		// ttl이 널이면 default 값 1day 이다. 
		            		if(!credentials.ttl) credentials.ttl =  60 * 60 * 24;

			              	if (user.createAccessToken.length === 2) {
			                	user.createAccessToken(credentials.ttl, tokenHandler);
			              	} else {
			                	user.createAccessToken(credentials.ttl, credentials, tokenHandler);
			              	}
		            	}
		          	} else {
		            	//debug'The password is invalid for user %s', query.email || query.userId);
		            	fn(defaultError);
		          	}
		        });

		    } else {
	        	//debug'No matching record is found for user %s', query.email || query.userId);
	        	fn(defaultError);
	      	}
    	});

    	return fn.promise;
  	};

  	/**
	   * Normalize the credentials
	   * @param {Object} credentials The credential object
	   * @param {Boolean} realmRequired
	   * @param {String} realmDelimiter The realm delimiter, if not set, no realm is needed
	   * @returns {Object} The normalized credential object
	   */
	User.normalizeCredentials = function(credentials, realmRequired, realmDelimiter) {
	    var query = {};

	    credentials = credentials || {};
	    if (!realmRequired) {

	      	if (credentials.email) {
	        	query.email = credentials.email;
	      	} else if (credentials.userId) {
	        	query.userId = credentials.userId;
	      	}

	    } else {
	      	
	      	if (credentials.realm) {
	        	query.realm = credentials.realm;
	      	}
	      	
	      	var parts;
	      	
	      	if (credentials.email) {
	        	parts = splitPrincipal(credentials.email, realmDelimiter);
	        	query.email = parts[1];
	        
		        if (parts[0]) {
		          	query.realm = parts[0];
		        }	        
      		} else if (credentials.userId) {
	        	parts = splitPrincipal(credentials.userId, realmDelimiter);
	        	query.userId = parts[1];
	        	
	        	if (parts[0]) {
	          		query.realm = parts[0];
	        	}
	      	}
	    }
	    return query;
	};


  	User.remoteMethod(
      	'login',
      	{
        	description: 'Custom Login a user with userId/email and password.',
        	accepts: [
          		{ arg: 'credentials', type: 'object', required: true, http: { source: 'body' }},
          		{ arg: 'include', type: ['string'], http: { source: 'query' },
            	description: 'Related objects to include in the response. ' +
            				 'See the description of return value for more details.' },
        ],
        returns: {
          	arg: 'accessToken', type: 'object', root: true,
          	description:
            	'The response body contains properties of the {{AccessToken}} created on login.\n' +
            	'Depending on the value of `include` parameter, the body may contain ' +
            	'additional properties:\n\n' +
            	'  - `user` - `U+007BUserU+007D` - Data of the currently logged in user. ' +
            	'{{(`include=user`)}}\n\n',
        	},
        	http: { verb: 'post' },
      	}
    );

    // Before User login 
	User.beforeRemote('login', function(ctx, user, next) {

	    // Check user available
	    // User.findOne({fields:{available:true}, where : { email: ctx.req.body.email }}, function (err, user) {	     
	    User.findOne({fields:{userId:true, type:true, available:true, leave:true}, where : { userId: ctx.req.body.userId }}, function (err, user) {	 
 			
	    	if(user.type == 'admin') next(); // 관리자 일 경우 allow login
	    	else
	    	{
		    	if(null != user && user.available && !user.leave){

		    		// 그룹 멤버 일 경우 그룹 허용 여부 체크
		    		User.app.models.groupMapping.findOne({
						where:{principalId: user.userId}
					}, function(err, group) {		

						// err 처리
						if (group.available) next(); // allow login
						else ctx.res.send({err:true, message:'승인 대기 중인 아이디입니다.'}); // refuse login return null
					}); // end group member created		
		    	} 
		    	else ctx.res.send({err:true, message:'차단 된 아이디입니다.'}); // refuse login return null
	    	}
	    });
	});

	// After User login 
	User.afterRemote('login', function(ctx, user, next) {

		// check  User role
	    User.app.models.RoleMapping.find({ where : { principalId: user.userId }}, function (err, roleMappings) {

	        var roleIds = roleMappings.map(function (roleMapping) {
	            return roleMapping.roleId;
	        });	     

	        if(roleIds.length === 0) ctx.res.send(user); 		          
	        else 
	        {	        	
		        var conditions = roleIds.map(function (roleId) {
		          	return { id: roleId };
		        });

		        if(conditions.length === 0) ctx.res.send(user); 
		      	else
		      	{		      		
			        User.app.models.Role.find({ where: { or: conditions}}, function (err, roles) {
			          	if (err) throw err;
			          	var roleNames = roles.map(function(role) {
			            	return role.name;
			          	});

			          	user.roles = roleNames;

			          	ctx.res.send(user);
			        });
		      	}
	        }
	    });
	});

	

	/**
	 * Get user roles object.
	 **/
	User.roles = function (id, cb) {
	    	    
	    var RoleMapping = User.app.models.RoleMapping;
	    var Role = User.app.models.Role;
	      
	    RoleMapping.find({ where : { principalId: id }}, function (err, roleMappings) {	     

	        var roleIds = roleMappings.map(function (roleMapping) {
	            return roleMapping.roleId;
	        });	     

	        if(roleIds.length === 0) cb(null, null);
	        else
	        {	        	
		        var conditions = roleIds.map(function (roleId) {
		          	return { id: roleId };
		        });

		        if(conditions.length === 0) cb(null, null);
		      	else
		      	{		      		
			        Role.find({ where: { or: conditions}}, function (err, roles) {
			          	if (err) throw err;
			          	var roleNames = roles.map(function(role) {
			            	return {id: role.id, name: role.name};
			          	});

			          	cb(null, roleNames);
			        });
		      	}
	        }

	      
	    });

	};

	User.remoteMethod('roles', {
		http: { path: '/:id/roles', verb: 'get' },
		accepts: {arg: 'id', type: 'string', required: true},
		returns: { arg: 'roles', type: 'Object' }
	});



	/**
	 * Get user role names array.
	 **/
	User.roleNames = function (id, cb) {
	    	    
	    var RoleMapping = User.app.models.RoleMapping;
	    var Role = User.app.models.Role;
	      
	    RoleMapping.find({ where : { principalId: id }}, function (err, roleMappings) {	     

	        var roleIds = roleMappings.map(function (roleMapping) {
	            return roleMapping.roleId;
	        });	     

	        if(roleIds.length === 0) cb(null, null);
	        else
	        {	        	
		        var conditions = roleIds.map(function (roleId) {
		          	return { id: roleId };
		        });

		        if(conditions.length === 0) cb(null, null);
		      	else
		      	{		      		
			        Role.find({ where: { or: conditions}}, function (err, roles) {
			          	if (err) throw err;
			          	var roleNames = roles.map(function(role) {
			            	return role.name;
			          	});

			          	cb(null, roleNames);
			        });
		      	}
	        }

	      
	    });

	};

	User.remoteMethod('roleNames', {
		http: { path: '/:id/roleNames', verb: 'get' },
		accepts: {arg: 'id', type: 'string', required: true},
		returns: { arg: 'roles', type: 'Object' }
	});



	/**
	 * Get user role names array.
	 **/
	User.email = function (email, type, cb) {
	   	
	   	var html, subject = null;

	   	if(type == 'block'){
	   		html = html_block;
	   		subject = '위클리 계정 정지 안내 이메일';
	   	}
	   	else if(type == 'wait'){
	   		html = html_member_wait;
	   		subject = '위클리 승인 대기중인 구성원이 있습니다.';
	   	}
	   	else if(type == 'confirm'){
	   		html = html_confirm;
	   		subject = '위클리 PRO 멤버쉽 승인 완료';
	   	};

	   	User.app.models.Email.send({
      		to: email,
      		from: from_email,
      		subject: subject,
      		html: html
    	}, function(err, mail) {
    		if (err) {
    			console.log('err', err);
    			throw err; 
    		};  
    		
    		if(null != cb) cb();
    	});

	};

	User.remoteMethod('email', {
		http: { path: '/email/:email/:type', verb: 'get' },
		accepts: [
            {arg: 'email', type: 'string', required: true},
            {arg: 'type', type: 'string', required: true}            
        ],
		returns: { arg: 'res', type: 'Object' }
	});

	/**
	 * send password reset link when requested.
	 **/
  	User.on('resetPasswordRequest', function(info) {

  		// console.log('info', info);

     	User.app.models.Email.send({
      		to: info.email,
      		from: from_email,
      		subject: '위클리 패스워드를 재설정 하세요.',
      		html: html_reset_password.replace('{{access_token}}', info.accessToken.id).replace('{{userId}}', info.accessToken.userId)
    	}, function(err, mail) {
    		if (err) {
    			console.log('err', err);
    			// throw err; 
    		}else{
    			console.log('mail', mail);
    		}	
    	});

  	});




};