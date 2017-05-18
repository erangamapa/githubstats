
var app = angular.module('app', []);

app.value('oAuthSuffix', '?client_id=e70074e5feb7490e70ce&client_secret=242676b6eb91b2e52dce2ca59ec88c53a95fd0da');

app.service('repoService', ['$q','$http', 'oAuthSuffix', RepoService]);

app.controller('gitHubDataController', ['$scope','$http', 'oAuthSuffix','repoService', function($scope, $http, oAuthSuffix, repoService) {

        var oAuthSuffix = "?client_id=e70074e5feb7490e70ce&client_secret=242676b6eb91b2e52dce2ca59ec88c53a95fd0da";
        $scope.reposLoaded = true;

        $scope.userLoaded = true;

        $scope.repoToContributorsMap = {};

        $scope.repoToLanguagesMap = {};

        $scope.username = "";

        $scope.globalContributors = [];

        $scope.globalLanguages = [];

        //user search click event handler
        $scope.searchUser = function(keyEvent) {
            if (keyEvent.which === 13){
                $scope.searchStatus = "Loading...";
                $scope.userLoaded = false;
                $http.get("https://api.github.com/users/" + $scope.username + oAuthSuffix)
                    .then(function (res) {
                        $scope.userData = res.data;
                        loadRepos(repoService);
                    },
                    function(err){
                        $scope.searchStatus = "Failed...";
                    });
            }
        }


        //load repos related to user
        var loadRepos = function (repoService) {
            $http.get($scope.userData.repos_url + oAuthSuffix)
                .then(function (res) {
                    repoService.getRepostats(res.data, 'contributors_url', $scope).then(function(contributorsMap){
                        $scope.repoToContributorsMap = contributorsMap;
                        repoService.getRepostats(res.data, 'languages_url', $scope).then(function(languagesMap){
                            $scope.repoToLanguagesMap = languagesMap;
                            $scope.repoData = res.data;
                            $scope.userLoaded = true;
                            $scope.reposLoaded = false;
                        });
                    });
                }, function(err){
                    $scope.searchStatus = "Failed...";
                });
        };

}]);


function RepoService($q, $http, oAuthSuffix){
    this.getRepostats = function(repos, type, $scope){
        var deferred = $q.defer();
        var noOfCalls = repos.length;
        var results = {};
        var called = 0;
        angular.forEach(repos, function(item, key) {
            results[item.name] = [];
            $http.get(item[type] + oAuthSuffix).then(function(result){
                angular.forEach(result.data, function(item2, key2){
                    if(type == 'contributors_url' && results[item.name].indexOf(item2.login) == -1){
                        results[item.name].push(item2.login);
                        if($scope.globalContributors.indexOf(item2.login) == -1){
                            $scope.globalContributors.push(item2.login);
                        }
                    }else if(type == 'languages_url' && results[item.name].indexOf(key2) == -1){
                        results[item.name].push(key2);
                        if($scope.globalLanguages.indexOf(key2) == -1){
                            $scope.globalLanguages.push(key2);
                        }
                    }
                });
                called++;
                if(called == noOfCalls){
                    deferred.resolve(results);
                }     
            }, function(data){
                $scope.searchStatus = "Failed...";
            })
        });
        return deferred.promise;
    }
}
