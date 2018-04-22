!(function($){
  $.fn.import = importFn;
  var optionDefault = {
    src : [],            // 読込むJSファイルの配列
    callback : [],
    immediate : true,
    orderKeys : [],
    exceuteOrder : [],
    globalBeforeCallback : function(e,data){return {};},
    globalBeforeCallbackArg : {},
    executeBeforeCallback : function(e,data){return {};},
    executeBeforeCallbackArg : {},
    executeAfterCallback : function(e,data){return {};},
    executeAfterCallbackArg : {},
  };
  var importFn = function(opt){
    if(typeof opt.immediate == 'undefined'){
      opt.immediate = optionDefault.immediate;
    }
    if(typeof $.fn.importCtl == 'undefined'){
      $.fn.importCtl = new importObj(opt,$);
    }else{
      $.fn.importCtl.addSetting(opt);
    }
    return $.fn.importCtl.execute();
  }
  var importObj = (function(){
    var importObj = function(opt,$){
      this.executeCnt = 0;
      this.preOptions = {};
      this.exeOptions = optionDefault;
      mergeObj(opt,this.exeOptions);
    };
    importObj.prototype = {
      addSetting : function(opt){

      },
      execute : function(){

      },
      getCallback :function(category,key){

      },
      setCallback : function(category,key,func){

      },
      preCheck : function(callback){

      }
    };
    var mergeObj(src,dest){
      Object.keys(src).forEach(function (k) {
        dest[k] = src[k];
      });
    }
    return importObj;
  })();
})(jQuery)
