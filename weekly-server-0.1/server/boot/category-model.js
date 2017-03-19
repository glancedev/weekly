
// module.exports = function(app) {
	
// 	var Category = app.models.category;
// 	var CategoryChild = app.models.categoryChild;	


// 	Category.create({
// 		id:'newsType', name:' 뉴스 유형', depth:1, essential:true, description:'뉴스 유형 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '기업공개'},
// 			{categoryId: category.id, order:1, name: '인수합병'},
// 			{categoryId: category.id, order:2, name: '투자유치'},
// 			{categoryId: category.id, order:3, name: '펀드조성'},
// 			{categoryId: category.id, order:4, name: '성과/지표'},
// 			{categoryId: category.id, order:5, name: '출시/업데이트'},
// 			{categoryId: category.id, order:6, name: '보육/지원'},
// 			{categoryId: category.id, order:7, name: '정책/제도'},
// 			{categoryId: category.id, order:8, name: '업계 동향'},
// 			{categoryId: category.id, order:9, name: '제휴/협력'},
// 			{categoryId: category.id, order:10, name: '지식/오피니언'},
// 			{categoryId: category.id, order:11, name: '인터뷰/리뷰'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'eventType', name:'이벤트 유형', depth:1, essential:true, description:'이벤트 유형 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '컨퍼런스/포럼'},
// 			{categoryId: category.id, order:1, name: '강연/세미나/워크샾'},
// 			{categoryId: category.id, order:2, name: '교육/멘토링'},
// 			{categoryId: category.id, order:3, name: '데모데이/피칭대회'},
// 			{categoryId: category.id, order:4, name: '해커톤/메이커톤'},
// 			{categoryId: category.id, order:5, name: '네트워킹/파티'},
// 			{categoryId: category.id, order:6, name: '소모임/스터디'},
// 			{categoryId: category.id, order:7, name: '기타'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'companyType', name:'회사/기관 유형', depth:1, essential:true, description:'회사/기관 유형 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '스타트업'},
// 			{categoryId: category.id, order:1, name: '투자기관'},
// 			{categoryId: category.id, order:2, name: '보육기관'},			
// 			{categoryId: category.id, order:3, name: '기타'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'companyVcStep', name:'회사/기관 투자 단계', depth:1, essential:true, description:'회사/기관 투자 단계 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '시드/엔젤'},
// 			{categoryId: category.id, order:1, name: '시리즈A'},
// 			{categoryId: category.id, order:2, name: '시리즈B'},			
// 			{categoryId: category.id, order:3, name: '시리즈C'},
// 			{categoryId: category.id, order:4, name: '시리즈D 이상'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'personType', name:'인물 유형', depth:1, essential:true, description:'인물 유형 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '창업자'},
// 			{categoryId: category.id, order:1, name: 'CEO'},
// 			{categoryId: category.id, order:2, name: 'CTO'},			
// 			{categoryId: category.id, order:3, name: '회사 임직원'},
// 			{categoryId: category.id, order:4, name: '벤쳐투자자'},
// 			{categoryId: category.id, order:5, name: '엔젤투자자'},
// 			{categoryId: category.id, order:6, name: '보육/지원 관계자'},			
// 			{categoryId: category.id, order:7, name: '정부 공무원'},
// 			{categoryId: category.id, order:8, name: '언론인'},
// 			{categoryId: category.id, order:9, name: '변호사'},
// 			{categoryId: category.id, order:10, name: '회계사'},			
// 			{categoryId: category.id, order:11, name: '변리사'},
// 			{categoryId: category.id, order:12, name: '기타'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'province', name:'지역', depth:1, essential:true, description:'지역 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '서울'},
// 			{categoryId: category.id, order:1, name: '경기'},
// 			{categoryId: category.id, order:2, name: '인천'},
// 			{categoryId: category.id, order:3, name: '부산'},
// 			{categoryId: category.id, order:4, name: '울산'},
// 			{categoryId: category.id, order:5, name: '경남'},
// 			{categoryId: category.id, order:6, name: '대전'},
// 			{categoryId: category.id, order:7, name: '충청'},
// 			{categoryId: category.id, order:8, name: '세종'},
// 			{categoryId: category.id, order:9, name: '대구'},
// 			{categoryId: category.id, order:10, name: '경북'},
// 			{categoryId: category.id, order:11, name: '광주'},
// 			{categoryId: category.id, order:12, name: '전라'},
// 			{categoryId: category.id, order:13, name: '강원'},
// 			{categoryId: category.id, order:14, name: '제주'},
// 			{categoryId: category.id, order:15, name: '미국(서부)'},
// 			{categoryId: category.id, order:16, name: '미국(동부)'},
// 			{categoryId: category.id, order:17, name: '중국'},
// 			{categoryId: category.id, order:18, name: '일본'},
// 			{categoryId: category.id, order:19, name: '동남아'},
// 			{categoryId: category.id, order:20, name: '유럽'},
// 			{categoryId: category.id, order:21, name: '기타 지역'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'degree', name:'학위', depth:1, essential:true, description:'학위 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '초등학교'},
// 			{categoryId: category.id, order:1, name: '중학교'},
// 			{categoryId: category.id, order:2, name: '고등학교'},
// 			{categoryId: category.id, order:3, name: '대학(2,3년)'},
// 			{categoryId: category.id, order:4, name: '대학교(4년)'},
// 			{categoryId: category.id, order:5, name: '대학원'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'position', name:'직책', depth:1, essential:true, description:'직책 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '대표'},
// 			{categoryId: category.id, order:1, name: '이사'},
// 			{categoryId: category.id, order:2, name: '부장'},
// 			{categoryId: category.id, order:3, name: '과장'},
// 			{categoryId: category.id, order:4, name: '차장'},
// 			{categoryId: category.id, order:5, name: '대리'},
// 			{categoryId: category.id, order:6, name: '사원'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'school', name:'학교', depth:1, essential:true, description:'학교 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '서울대학교'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});

// 	Category.create({
// 		id:'major', name:'전공', depth:1, essential:true, description:'전공 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '컴퓨터공학'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});


// 	Category.create({
// 		id:'market', name:'상장 시장', depth:1, essential:true, description:'상장 시장 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: 'KOSPI'},
// 			{categoryId: category.id, order:1, name: 'KOSDAQ'},
// 			{categoryId: category.id, order:2, name: 'KONEX'},
// 			{categoryId: category.id, order:3, name: 'NYSE'},
// 			{categoryId: category.id, order:4, name: 'NASDAQ'},
// 			{categoryId: category.id, order:5, name: 'Tokoy SE'},
// 			{categoryId: category.id, order:6, name: 'Hong Kong SE'},
// 			{categoryId: category.id, order:7, name: 'Shanghai SE'},
// 			{categoryId: category.id, order:8, name: 'Shenzen SE'},
// 			{categoryId: category.id, order:9, name: 'Singapore SE'}			
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});


// 	Category.create({
// 		id:'money', name:'금액', depth:1, essential:true, description:'금액 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: 'KRW'},
// 			{categoryId: category.id, order:1, name: 'USD'},
// 			{categoryId: category.id, order:2, name: 'CNY'},
// 			{categoryId: category.id, order:3, name: 'JPY'},
// 			{categoryId: category.id, order:4, name: 'EUR'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});
// 	});


// 	Category.create({
// 		id:'field', name:'분야', depth:2, essential:true, description:'분야 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		// category.categoryChild.create([
// 		// 	{categoryId: category.id, depth:1, name: '컨퍼런스/포럼'}
// 		// ], function(err, principal) {
// 		// 	if (err) throw err;
// 		// });
// 	});

// 	Category.create({
// 		id:'topic', name:'주제', depth:1, essential:true, description:'주제 카테고리'
// 	}, function(err, category) {
// 		if (err) throw err;

// 		category.categoryChild.create([
// 			{categoryId: category.id, order:0, name: '개발/프로그래밍'},
// 			{categoryId: category.id, order:1, name: '디자인/사용자경험'},
// 			{categoryId: category.id, order:2, name: '전략기획/사업모델'},
// 			{categoryId: category.id, order:3, name: '투자유치'},
// 			{categoryId: category.id, order:4, name: '재무회계'},
// 			{categoryId: category.id, order:5, name: '법률/특허'},
// 			{categoryId: category.id, order:6, name: '인사관리/조직문화'},
// 			{categoryId: category.id, order:7, name: 'PR'},
// 			{categoryId: category.id, order:8, name: '마케팅'},
// 			{categoryId: category.id, order:9, name: '영업'},
// 			{categoryId: category.id, order:10, name: '해외진출'},		
// 			{categoryId: category.id, order:11, name: '기타'}
// 		], function(err, principal) {
// 			if (err) throw err;
// 		});

// 	});



// };