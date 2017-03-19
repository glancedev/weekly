
// module.exports = function(app) {
	
// 	var Company = app.models.company;
// 	var Business = app.models.business;

// 	var arr = ['스타트업', '벤쳐캐피탈', '엑셀레이터', '기타'];
// 	var arr_2 = ['운영중', '상장', '피인수', '폐업'];
// 	var arr_3 = [true, false];

// 	var index = 0;
// 	var index_2 = 0;
// 	var index_3 = 0;



// 	for (var i = 0; i < 10000; i++) {

// 		index = Math.floor((Math.random() * 4));
// 		index_2 = Math.floor((Math.random() * 4));
// 		index_3 = Math.floor((Math.random() * 2));

// 		Company.create([
// 			{
// 				userId: 'weekly',
// 				name: 'company-test'+i, 
// 				type: arr[index], 
// 				state: arr_2[index_2], 
// 				display: arr_3[index_3]
// 			}	
// 		], function(err, company) {

// 			Business.create(
// 			{
// 				userId: 'weekly', 
// 				organization: [{id: company[0].id, name: company[0].name}],
// 				title: '사업-test'+i, 
// 				ordinary: arr_3[index_3], 
// 				supportMoney : arr_3[index_3],
//     			supportPlace : arr_3[index_3],
//     			link : 'www.my-music-channel.com',
// 				display: arr_3[index_3] 
// 			}	
// 			, function(err, business) {

// 				if(err) console.log(err);

// 				console.log('business', business)
// 			});
// 		});

// 	}

// };