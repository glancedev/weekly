'use strict';

angular.module('testApp')
  .controller('PersonDetailCtrl', function ($rootScope, $scope, $state, $stateParams, $location, $window, $timeout, $log, $http, $localStorage, NewsFactory, News, Company, Person, Category, Investment) {

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
     *  Person 리스트 가져오기
     **/

    Person
      .findById({
        id: $stateParams.id,
        filter: {
          include:[
            {relation:'thumbnail'},     // 썸네일
            {relation:'employee',       // 경력
              scope:{
                include:[
                  {
                    relation:'company',
                    scope:{fields: ['id', 'name']}
                  }
                ]
              }
            },
            { "relation": "newsPerson", // 인물 관련 뉴스 내용
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
          console.log(res);

          $scope.model = res;
          $scope.model.modified = new Date();

          // setting products array
          // if(res.product.length !== 0) $scope.products = res.product;

          // setting products array
          if(null != res.incubation) {

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
          $scope.inserted_tag = $scope.model.field;
        },
        function (err) {
          console.log('err', err);
          alert(err.data.error.message);
          $scope.cancel();
        });


    /**
     *  투자 리스트 가져오기
     **/

    Investment
      .find({
        filter:{
          include:[
            {
              relation:'investee',    //투자한 회사
              scope: {'fields':['id', 'name']}
            }
          ],
          where: {
            personIds: $stateParams.id   // 인물 아이디
          }
        }
      })
      .$promise
      .then(
        function (res) {
          $scope.invModel = res;
          $scope.invModel.modified = new Date();
          console.log('inv ', res)
        },
        function (err) {
          console.log('err', err);
          alert(err.data.error.message);
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
            alert(err.data.error.message);
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
            alert(err.data.error.message);
          });

    };

    // $scope.title = '뉴스';
    moment.locale('ko');
    $scope.today = moment().format('MM/DD (dddd)');
    $scope.yesterday = moment().add(-1, 'days').format('MM/DD (dddd)');

    /* sub menu start */
    $scope.sub_menu1 = [
      { title: '즐겨찾는 페이지', icon: 'fa-star-o', link: '#' },
      { title: '뉴스 보관함', icon: 'fa-bookmark-o', link: '#' }
    ];

    $scope.sub_menu2 = [
    ];

    $scope.sub_menu3 = [

    ];

    /* sub menu end */

    // $scope.addItem = function() {
    //   var newItemNo = $scope.items.length + 1;
    //   $scope.items.push('Item ' + newItemNo);
    // };
    //
    // $scope.status = {
    //   isCustomHeaderOpen: false,
    //   isFirstOpen: true,
    //   isFirstDisabled: false
    // };

  });

