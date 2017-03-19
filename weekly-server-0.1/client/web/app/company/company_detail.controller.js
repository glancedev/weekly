'use strict';

angular.module('testApp')
  .controller('CompanyDetailCtrl', function ($rootScope, $scope, $state, $stateParams, $location, $window, $timeout, $log, $http, $localStorage, NewsFactory, News, Company, Person, Category, Ipo, Mna, Incubation, Investment, timeFactory) {

    // NEWS Loopback Start
    // $scope.filter = {
    //   and: [
    //     {'state': {inq: $scope.searchTools.type['state']}}, // 상태 검색
    //     {'field': {inq: $scope.searchTools.type['field']}}, // 분야 검색
    //     {'totalMoney': {inq: $scope.searchTools.type['totalMoney']}}, // 누적 투자액 검색
    //     {'founder': {inq: $scope.searchTools.type['founder']}}, // 대표 검색
    //     {'foundationDate': {inq: $scope.searchTools.type['foundationDate']}}, // 설립일 검색
    //     {'location': {inq: $scope.searchTools.type['location']}},  // 소재지 검색
    //     {or:[   // 회사 이름 검색 
    //         {'name': {inq: $scope.searchTools.type['keywords']}},
    //         {'nameEng': {inq: $scope.searchTools.type['keywords']}},
    //         {'nameTag': {inq: $scope.searchTools.type['keywords']}}
    //       ]
    //     }
    //   ],
    //   order: 'created DESC',
    //   limit: '15',
    //   skip: null,
    // };

    
    // and: [
      // state: {inq: $scope.where.state}, // 상태 검색
      // {'field': {inq: $scope.where.field}}, // 분야 검색
      // {'totalMoney': {inq: $scope.where.totalMoney}}, // 누적 투자액 검색
      // {'founder': {inq: $scope.where.founder}}, // 대표 검색
      // {'foundationDate': {inq: $scope.where.foundationDate}}, // 설립일 검색
      // {'location': {inq: $scope.where.location}},  // 소재지 검색
      // {or:[   // 회사 이름 검색 
      //     {'name': {inq: $scope.where.name}},
      //     {'nameEng': {inq: $scope.where.nameEng}},
      //     {'nameTag': {inq: $scope.where.nameTag}},
      //   ]
      // }
    // ],

    // $scope.filter = {
    //   filter:{ 
    //     include: [
    //       { relation: "thumbnail", scope: {fields:{id:true}}},
    //       { relation: "product", scope: {fields:{id:true}}}
    //     ],
    //     where: {          
    //       // and: [
    //       //   {or: [
    //       //       {founder : '585532a96baf3597030732bc'},
    //       //       {founder : '585532a96baf3597030732bc'},
    //       //       {founder : '585532a96baf3597030732bc'}
    //       //     ]
    //       //   }
    //       // ]
    //     }
    //     ,
    //     order: 'created DESC',
    //     limit: '15',
    //     skip: null
    //   }
    // };


    /**
     *  검색 조건 array 설정
    **/ 
    $scope.where = {
      state : [],   // 상태
      field : [],  // 분야 태그
      totalMoney : [], //누적 투자액
      founderIds : [], // 대표이름
      foundationDate : [], //설립일
      location : [], // 소재지
      keywords : []  // 회사 한글, 영문명, 기타 태그명
    };   

    // input 설정
    $rootScope.input = $scope.input = {};

    // 검색 바 설정
    $scope.searchTools ={
      list : [] 
    };
    
    // or 조건으로 검색 되는 fields 리스트
    $scope.generateWhereOrList = ['founderIds'];

    /**
     *  검색 필터 init
    **/ 
    $scope.filter = {
      filter:{ 
        include: [
          { relation: "thumbnail", scope: {fields:['id', 'medium']}},
          { relation: "product", scope: {fields:['id', 'name']}}
        ],
        where: {},
        order: 'created DESC',
        limit: '15',
        skip: null
      }
    };


    ////////////////////////////// 검색 쿼리 생성 로직 start ////////////////////////////// 
    /**
     *  OR 조건 생성
    **/ 
    $scope.generateWhereOr = function(key){
      
      var value = {
        or: []
      };

      angular.forEach($scope.where[key], function (values, i) {           
        
        var temp = {};        
        temp[key] = values;

        value.or.push(temp);
      }); 

      return value;
    };

    /**
     *  inq 조건 생성
    **/ 
    $scope.generateWhereInq = function(key){
      var value = {}; 
      value[key] = {inq: $scope.where[key]};
      
      return value;
    };

    /**
     *  keywords 조건 생성
    **/ 
    $scope.generateWhereKeywords = function(key){      
      
      var value = {
        or: []
      };

      angular.forEach($scope.where[key], function (values, i) {           
       
        // 한글명 검색
        value.or.push({name: {like: values}});

        // 영문명 검색
        value.or.push({nameEng: {like: values}});
      }); 

      // 기타 태그 검색 추가
      value.or.push({nameTag: {inq: $scope.where[key]}})
      
      return value;
    };


    /**
     *  where 조건 생성
    **/
    $scope.generateWhere = function(){
        return new Promise(function(resolve, reject){            
          
          // 이전 검색 초기화
          //검색 배열을 생성한다. 
          var where = {
            and : []
          };

          // 검색 조건이 있는지를 체크한다.
          for(var key in $scope.where){

            // null이 아닌 것은 검색 조건을 만든다. 
            if($scope.where[key].length !== 0){    
        
              // 필드별 검색 조건 생성
              // Company, Person 객체 아이디 검색 일시 
              if($scope.generateWhereOrList.includes(key)) where.and.push($scope.generateWhereOr(key));
              // 이름 키워드 태그 검색 일시
              else if(key === 'keywords') where.and.push($scope.generateWhereKeywords(key));              
              // 일반 필드 텍스트 검색 일시 
              else where.and.push($scope.generateWhereInq(key));                                          

            } 
          } 

          // 검색 조건이 있으면 추가한다.
          if(where.and.length > 0) $scope.filter.filter.where = where;
          // 검색 조건이 없으면 이전 검색조건 삭제
          else $scope.filter.filter.where = {};
          
          return resolve($scope.filter);            
      });
    };

    ////////////////////////////// 검색 쿼리 생성 로직 end ////////////////////////////// 



    /**
     *  Company 리스트 가져오기
    **/

    Company
      .findById({
        id: $stateParams.id,
        filter: {
          "include": [
            { "relation": "thumbnail", "scope": {} },  // 썸네일 로고

            { "relation": "product"},       // (type이 스타트업 경우) 스타트업 제품/서비스 내역

            { "relation": "founders", "scope": {"fields": ["id", "name"]} },      // 대표 복수 가능.

            { "relation": "incubation",   // 보육 기관(type이 엑셀러레이터인경우)  보육해준 내역, 보육 받은 내역은 별도 API 호출
              "scope": {
                "include":[{
                  "relation":"companies",
                  "scope":{"fields": ["id", "name"]}
                }],
                "order": "deadline DESC"  // 보육기관 마감일자 순  (마감일자가 현재 기준으로 미래이면 보육진행중인것,  과거이면 과거 보육 내역이다.
              }
            },

            { "relation": "employee",   // 주요 구성원 회사 직원 내역
              "scope": {
                "include" : [{
                  "relation": "person",
                  "scope": {"fields": ["id", "name"]}
                }],
                "fields": ["id","employeeId", "position"],
                "where": {
                  "current": true   // 현재 재직중인
                }
              }
            },

            { "relation": "takeover",  // 인수한 회사
              "scope": {"include":[{
                "relation": "handover",
                "scope": {"fields": ["id", "name"]}
              }]}
            },

            { "relation": "ipos",  // 기업공개 내역
              "include" : [{
                "relation": "company",
                "scope": {"fields": ["id", "name"]}
              }]
            },

            { "relation": "newsCompany", // 회사 관련 뉴스 내용
              "scope": {"include":[{
                "relation": "news",
                "scope": {"fields": ["title", "link", "datetime"]}
              }]
              }
            }
          ]
        }
      })
      .$promise
      .then(
        function (res) {
          console.log('company ', res);

          $scope.company = res;
          $scope.company.modified = new Date();

          // setting products array
          if(res.product.length !== 0) $scope.products = res.product;

          // setting products array
          if(res.incubation.length !== 0) {

            $scope.incubations = res.incubation;

            angular.forEach($scope.incubations, function (item, i) {
              item.company = [];

              angular.forEach(item.compaines, function (value, i) {
                item.company.push({
                  id: value.id,
                  name: value.name
                })
              })
            });
          }

          // Setting tags
          $scope.inserted_tag = $scope.company.field;
        },
        function (err) {
          console.log('err', err);
        });

    /**
     *  Investment 투자 받은 리스트 가져오기
     **/
    Investment
      .find({
        filter:{
          "include" : [
            {
              "relation": "investee",  //피투자사
              "scope": {"fields": ["id", "name"]}
            },
            {
              "relation": "investorCompany",  //투자사 리스트
              "scope": {"fields": ["id", "name"]}
            },
            {
              "relation": "investorPerson",    // 투자자 리스트
              "scope": {"fields": ["id", "name"]}
            }
          ],
          where: {
            investeeId: $stateParams.id   // 회사 아이디
          },
          "order": "announcementDate DESC"
        }
      })
      .$promise
      .then(
        function (res) {
          console.log('invests ', res);
          $scope.invest_total_money = 0;
          for( var i=0; i < res.length; i++) {
            $scope.invest_total_money += res[i].money;
          }
          $scope.invests = res;
          $scope.invests.modified = new Date();
        },
        function (err) {
          console.log('err', err);
        });

    /**
     *  MNA 인수 합병 리스트 가져오기
     **/
    Mna
      .find({
        filter:{
          "include" : [
            {
              "relation": "takeover",    // 인수사
              "scope": {"fields": ["id", "name"]}
            },
            {
              "relation": "handover",    //  피인수사
              "scope": {"fields": ["id", "name"]}
            }
          ],
          where: {
            companyIds: $stateParams.id   // 회사 아이디
          },
          "order": "announcementDate DESC"
        }
      })
      .$promise
      .then(
        function (res) {
          console.log('mna ', res)
          $scope.mnas = res;
          $scope.mnas.modified = new Date();
        },
        function (err) {
          console.log('err', err);
        });

    /**
     *  Investment2 투자한 리스트 가져오기
     **/
    Investment
      .find({
        filter:{
          include:[
            {
              relation:'investee',    //투자한 회사
              scope: {'fields':['id', 'name', 'description', 'state']}
            }
          ],
          where: {
            companyIds: $stateParams.id   // 인물 아이디
          }
        }
      })
      .$promise
      .then(
        function (res) {
          $scope.inv2Model = res;
          $scope.inv2Model.modified = new Date();
          $scope.inv3Model = $scope.removeDuplicates(res, 'investeeId');
          console.log('####inv2 ', res)
        },
        function (err) {
          console.log('err', err);
        });

    /**
     *  remove Duplicates item
     **/
    $scope.removeDuplicates = function(originalArray, objKey) {

      var trimmedArray = [];
      var values = [];
      var value;

      for(var i = 0; i < originalArray.length; i++) {
        value = originalArray[i][objKey];

        if(values.indexOf(value) === -1) {
          trimmedArray.push(originalArray[i]);
          values.push(value);
        }
      }

      return trimmedArray;
    };


    /**
     *  Incubation 투자 받은 리스트 가져오기
     **/
    Incubation
      .find({
        filter:{
          "include" : [
            {
              relation:'company',      // 보육 기관
              scope:{fields: ['id', 'name']}
            }
          ],
          where: {
            companyIds: $stateParams.id   // 피투자사
          }
        }
      })
      .$promise
      .then(
        function (res) {
          $scope.icbModel = res;
          $scope.icbModel.modified = new Date();
          console.log('incubation ', res)
        },
        function (err) {
          console.log('err', err);
        });


    /**
     *  검색어 태그 넣기
    **/
    $rootScope.putTags = $scope.putTags = function(group, item){      
      
      if($scope.generateWhereOrList.includes(group)) // 검색 조건이 text가 아닌 id일 경우 아이디를 검색 조건에 넣고 text는 화면단에 표시한다.
      {        
        // item에 ID가 없을 시, 중복일시 이력시키지 않는다.
        if(null == item.id || $scope.where[group].includes(item.id)){
          $scope.input[group] = ''; // input값 초기화 
          return; 
        } 

        // group list에 item 검색 조건 추가
        $scope.searchTools.list.push({group:group, name:item.name, id:item.id});  //검색바화면 표시용
        $scope.where[group].push(item.id);  // 실제 검색 필터 적용
      } 
      else
      {
        // item이 중복일시 이력시키지 않는다.
        if($scope.where[group].includes(item)) return; 

        // group list에 item 검색 조건 추가
        $scope.searchTools.list.push({group:group, name:item}); //검색바화면 표시용
        $scope.where[group].push(item); // 실제 검색 필터 적용
      } 

      // input값 초기화 
      $scope.input[group] = '';

      // 검색 시작
      $scope.loadMore();
    };    

    /**
     *  검색어 태그 삭제
    **/
    $rootScope.removeTags = $scope.removeTags = function(group, id, name){    

      //id null 체크 
      var val = (null == id) ? name : id;

      // 태그 삭제
      $scope.where[group].splice($scope.where[group].indexOf(val), 1);  

      // 검색 시작
      $scope.loadMore();
    };    





    ////////////////////// 카테고리 로직 추가 ////////////////////// 

    /**
     *   검색어 자동 완성 함수
     *   model : API 모델명
     *   action :API 함수 명
     *   val : 검색어  
    **/
    $scope.searchAutoComplete = function(model, action, val) {             

        if(model === 'Company') var model = Company;      
        if(model === 'Person') var model = Person;      

        return model[action]({
          filter: {
            where: {
              name: {like: val}
            },
            order: 'name ASC', 
            limit: 10
          }
        })
        .$promise
        .then(
        function (res) {               
          return res.map(function(item){
            return item;
          }); 
        },
        function (err) {                
            console.log('err', err);
        });     
    };


    /**
     *   model, 또는 category item을 가져오는 함수.
     *   model : API 모델명
     *   action :API 함수 명 
     *   id : API  findById, id가 null일시 모두 가져온다.
     *   fields : 가지고 올 fileds array
     *   limit : 데이터 가지고 올 갯수
     *   order : 정렬
     *   type : true = name만 anrray 입력, false= object를 array입력
    **/
    $scope.getCategory = function(model, action, id, fields, limit, order, type) {              
      
      var name = 'items_'+ id; // 배열 이름 설정 
      $scope[name] = [];  // result item 담을 배열 설정

      if(model === 'Company') var model = Company;      
      if(model === 'Person') var model = Person;      
      if(model === 'Category') var model = Category;      

      model[action]({
        id: id,
        filter: {           
            fields: fields.split(','),   //가지고 올 필트만 array로 설정
            limit: limit,   // 가지고올 데이터 갯수 설정
            order: order   // order 설정
          }        
      })      
      .$promise
      .then(
      function (res) {
          // object array push
          if(type) $scope[name] = $scope[name].concat(res); 
          // name array push
          else {
            angular.forEach(res, function(value){    
              $scope[name].push(value.name);
            });       
          }          
      },
      function (err) {                
          console.log('err', err);
      });

    };
    
    // moment.locale('ko');
    $scope.today = timeFactory.getToday();
    $scope.yesterday = timeFactory.getYesterday();

    /* sub menu start */
    $scope.sub_menu1 = [
      { title: '즐겨찾는 페이지', icon: 'fa-star-o', link: '#' },
      { title: '뉴스 보관함', icon: 'fa-bookmark-o', link: '#' }
    ];

    $scope.sub_menu2 = [
      { title: '스타트업', icon: '', link: 'startup' },
      { title: '벤처캐피탈', icon: '', link: 'vc' },
      { title: '엑셀러레이터', icon: '', link: 'ac' }
    ];

    $scope.sub_menu3 = [

    ];

    /* sub menu end */


  });

