'use strict';

angular.module('testApp')
  .controller('CompanyAcCtrl', function ($rootScope, $scope, $state, $location, $window, $timeout, $log, $http,
                                              $localStorage, NewsFactory, News, Company, Person, Category, timeFactory) {

    // or 조건으로 검색 되는 fields 리스트
    $scope.generateWhereOrList = ['personIds', 'company'];
    // 비교 조건으로 검색 되는 fields 리스트
    $scope.generateWhereCompareList = ['foundationDate_gte', 'foundationDate_lte'];

    /**
     *  검색 필터 init
     **/
    $scope.filter = {
      filter:{
        include: [
          { relation: "thumbnail", scope: {fields:['id', 'medium']}},
          { "relation": "incubation",   // 보육 기관(type이 엑셀러레이터인경우)  보육해준 내역, 보육 받은 내역은 별도 API 호출 
            "scope": {              
              "order": "deadline DESC"  // 보육기관 마감일자 순  (마감일자가 현재 기준으로 미래이면 보육진행중인것,  과거이면 과거 보육 내역이다.
            }   
          }
        ],
        where: {},
        order: 'created DESC',
        limit: 20,
        skip: 0
      }
    };


    $scope.reset = function(){
      /**
       *  검색 조건 array 설정
       **/
      $scope.where = {
        isRecruiting : [],   // 현재 모집 여부
        isMoney : [],   // 투자 여부
        isPlace : [],   //  입주 여부 
        field : [],  // 분야 태그        
        foundationDate_gte : [], //설립시기
        foundationDate_lte : [], //설립시기
        location : [], // 소재지
        keywords : []  // 회사 한글, 영문명, 기타 태그명
      };

      // input 설정
      $rootScope.input = $scope.input = {};

      // 검색 바 설정
      $scope.searchTools = {
        list : [],
        save: ''
      };

    };

    $scope.reset();


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

      console.log('key', $scope.where[key]);

      var value = {};
      value[key] = {inq: $scope.where[key]};

      return value;
    };

    /**
     *  gt,lt  조건 생성
     *  type :  gt=이상, lt=이하
     **/
    $scope.generateWhereCompare = function(key){
      return $scope.where[key][0];
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
        value.or.push({name: {like: values, options: "i"}});

        // 영문명 검색
        value.or.push({nameEng: {like: values, options: "i"}});
      });

      // 기타 태그 검색 추가
      value.or.push({nameTag: {inq: $scope.where[key]}});

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
            // date, number 비교 일시 
            else if($scope.generateWhereCompareList.includes(key)) where.and.push($scope.generateWhereCompare(key));
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

    $scope.contents = [];

    /**
     *  News 리스트 가져오기
     **/
    $scope.loadMore = function(){

      // 검색 조건 생성
      $scope.generateWhere()
        .then(function(filter){

          if(null == filter.filter.where.and) filter.filter.where.and = [{type : "보육기관"}];
          else filter.filter.where.and.push({type : "보육기관"});                     
          
          console.log('filter: ', filter);

          Company
            .find(filter)
            .$promise
            .then(
              function (res) {
                console.log(res);
                // $scope.contents = [];
                $scope.contents = $scope.contents.concat(res);

                if (res.length == 0) {
                  $scope.infiniteBreak = true;
                } else {
                  $scope.infiniteBreak = false;
                }
                filter.filter.skip += 20;
                console.log(res.length);
              },
              function (err) {
                console.log('err', err);
                alert(err.data.error.message);
              });

        })

    };



    /**
     *  검색어 태그 넣기
     **/
    $rootScope.putTags = $scope.putTags = function(group, item, alias){

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
      else if($scope.generateWhereCompareList.includes(group))
      {
        var filed = group.split('_')[0];    // 필드명 
        var key = group.split('_')[1];     //증감 gt, lt
        var search = item.split('_')[0];  //검색바 들어갈 이름
        var value = item.split('_')[1];   // 증감 비교  값        
    
        // 초기화 중복제거 위해
        // 검색바 제거        
        angular.forEach($scope.searchTools.list, function(value, i){ return (value.id == group) ? $scope.searchTools.list.splice(i, 1) : null });
        // 검색 필터 값 제거 
        $scope.where[group] = [];
         
        // 검색 필터 적용  
        // 검색바화면 표시용
        $scope.searchTools.list.push({group:group, name:search, id:group}); 

        // 실제 검색 필터 적용
        var temp = {};
        temp[filed] = {};
        temp[filed][key] =  value;

        $scope.where[group].push(temp);
      }
      else
      {
        // item이 중복일시 이력시키지 않는다.
        if($scope.where[group].includes(item)) return;

        // var name = item;
        if(null != alias){
          $scope.searchTools.list.push({group:group, id:item, name:alias}); //검색바화면 표시용
          $scope.where[group].push(item); // 실제 검색 필터 적용
        } 
        else{
          $scope.searchTools.list.push({group:group, name:item}); //검색바화면 표시용
          $scope.where[group].push(item); // 실제 검색 필터 적용
        } 
      }

      // input값 초기화
      $scope.input[group] = '';

      // contents 초기화 
      $scope.contents = [];
      $scope.filter.filter.skip = 0;     

      // 검색 시작
      $scope.loadMore();
    };

    /**
     *  검색어 태그 삭제
     **/
    $rootScope.removeTags = $scope.removeTags = function(group, id, name){

      // contents 초기화 
      $scope.contents = [];
      $scope.filter.filter.skip = 0;   

      //id null 체크
      var val = (null == id) ? name : id;

      // 태그 삭제
      $scope.where[group].splice($scope.where[group].indexOf(val), 1);

      // 검색 시작
      $scope.loadMore();
    };


    /**
     *  인기 검색어 태그 검색
    **/
    $rootScope.hotTags = $scope.hotTags = function(group, id, name){      

      // 검색 리스트 조기화.
      $scope.reset();

      if(null != group) var group = group.split(',');
      if(null != id) var id = id.split(',');
      if(null != name) var name = name.split(',');

      angular.forEach(group, function(value,i){
        
        if(null === id) $scope.putTags(value, name[i]);
        else $scope.putTags(value, {id:id[i], name:name[i]});

      });

    };
  

    ////////////////////// 커스텀 필터 저장 로직 시작 //////////////////////

    $scope.status = {
      isopen: false
    };

    /**
     *  필터 저장
    **/
    $scope.saveFilter = function(name){

        if (!$scope.searchTools.save) {
          return;
        }
        if (!$scope.filter.filter.where) {
          alert("Sorry, you can't save an empty filter.");
          return;
        }
      
        var item = {
          name: $scope.searchTools.save,
          searchTools: $scope.searchTools.list,
          filter: $scope.where
        };

        if(null == $localStorage[name]) $localStorage[name] = [];

        $localStorage[name].push(item);

        // model 초기화, close dropbox
        // $scope.searchTools.save = null;
        $scope.status.isopen = false;
        
        $scope.reset();

        // alert("저장 되었습니다.");   
    }

    /**
     *  저장된 필터 가져오기
    **/
    $scope.getSavedFilter = function(name){        
        $scope.saved_filter = $localStorage[name];   
    }    

    /**
     *  저장된 필터 삭제
    **/
    $scope.removeSavedFilter = function($event, index){   
        $event.preventDefault();
        $event.stopPropagation();     
        $scope.saved_filter.splice(index, 1);
    }    

    /**
     *  저장된 필터 적용
    **/
    $scope.selectSavedFilter = function($event, index){        

        $scope.where = $scope.saved_filter[index].filter;  
        $scope.searchTools.list = $scope.saved_filter[index].searchTools;

        // contents 초기화 
        $scope.contents = [];
        $scope.filter.filter.skip = 0;   

        //검색 시작
        $scope.loadMore();
    }          
    ////////////////////// 커스텀 필터 저장 로직 끝 //////////////////////


    ////////////////////// 카테고리 로직 시작 //////////////////////

    /**
     *   검색어 자동 완성 함수
     *   model : API 모델명
     *   action :API 함수 명
     *   val : 검색어
     *   type : true = name만 anrray 입력, false= object를 array입력
     *   id :API  findById, id가 null일시 모두 가져온다.  (category 검색시 사용)
     **/
    $scope.searchAutoComplete = function(model, action, val, type, id) {

      if(model === 'Company') var model = Company;
      if(model === 'Person') var model = Person;
      if(model === 'Product') var model = Product;
      if(model === 'Category') var model = Category;

      console.log('id', id);

      return model[action]({
          id:id,
          filter: {
            where: {
              name: {like: val, options: "i"}
            },
            order: 'name ASC',
            limit: 30
          }
        })
        .$promise
        .then(
        function (res) {
          return res.map(function(item){
            // return item;
            console.log(item.name);
            if(type) return item.name;
            else return item;
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
     *   where : where 조건 입력
     **/
    $scope.getCategory = function(model, action, id, fields, limit, order, type, where) { 

      var name = 'items_'+ id; // 배열 이름 설정
      $scope[name] = [];  // result item 담을 배열 설정

      if(model === 'Company') var model = Company;
      if(model === 'Person') var model = Person;
      if(model === 'Product') var model = Product;
      if(model === 'Category') var model = Category;

      var filter = {
        fields: fields.split(','),   //가지고 올 필트만 array로 설정
        limit: limit,   // 가지고올 데이터 갯수 설정
        order: order   // order 설정
      };


      if(null != where) {
        filter.where = {};
        filter.where[where] = true;  
      }

      model[action]({
        id: id,
        filter: filter
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
    ////////////////////// 카테고리 로직 끝 //////////////////////


    // $scope.title = '뉴스';
    moment.locale('ko');
    $scope.today = moment().format('MM/DD (dddd)');
    $scope.yesterday = moment().add(-1, 'days').format('MM/DD (dddd)');

    $scope.beforemonth = timeFactory.getBeforeMonth();
    console.log($scope.beforemonth);

    $scope.before3month = timeFactory.getBefore3Month();
    console.log($scope.before3month);

    $scope.before6month = timeFactory.getBefore6Month();
    console.log($scope.before6month);

    $scope.beforeyear = timeFactory.getBeforeYear();
    console.log($scope.beforeyear);

    /* sub menu start */
    // $scope.sub_menu1 = [
    //   { title: '즐겨찾는 페이지', icon: 'fa-star-o', link: '#' },
    //   { title: '뉴스 보관함', icon: 'fa-bookmark-o', link: '#' }
    // ];

    $scope.sub_menu2 = [
      { title: '스타트업', icon: '', link: 'startup' },
      { title: '벤처캐피탈', icon: '', link: 'vc' },
      { title: '엑셀러레이터', icon: '', link: 'ac' }
    ];


  });

