//eXMjcfkCPYk1Pd9CRjm7LcLkCa1M3socLF/7wlRjI3emn7C8HrnBHOEi2TP/OYo+
import { toast} from 'nc-lightapp-front';

//包装平台加载单据模板
var loadTempateWapper = function(cfg = {}){
    cfg.props.createUIDom(cfg, (data) => {
        cfg.callback && cfg.callback(data);
    });
};

//包装平台加载多语配置
var loadMultiLangWapper = function(cfg = {}){
    var callback = (data, success,inlt) =>{
        if(!success)
            toast({content:'加载语言包失败',color:'warning'});
       cfg.callback && cfg.callback(data);
    };
    cfg.props.MultiInit.getMultiLang({...cfg,callback: callback});
};

//并发加载单据模板和语言包
// 必须参数 props, pagecode, callback
var loadTemplateAndLang = function(cfg){
    var targetCallback = cfg.callback,
        langLoad = false,
        templateLoad = false,
        result = {},
        langCallback = function(lang){
           result = {...result, lang: lang};
            langLoad = true;
            finishFn();
        },
        templateCallback = function(data){
           result = {...result, ...data};
           templateLoad = true;
           finishFn();
        },
        finishFn = function(){
            langLoad && templateLoad && targetCallback && targetCallback(result);
        };
    loadTempateWapper({...cfg, callback:templateCallback});
    loadMultiLangWapper({...cfg, callback:langCallback});


};
export default loadTemplateAndLang;

// export default function(props){
//      return ( pageCfg = {} , langCfg = {}, callback ) => {

//          var count = 0;
//          var result = {};

//          var hander = () => {
//              if(count == 2){
//                  callback && callback(result.templateData || {} , result.langData || {},result.inlt||{});
//              }
//          }
//          if(langCfg.callback){
//              console.log('咱们自己createUIDom会同时获取多语和单据模板,并通过一个回调函数返回, langCfg中的回调函数将被忽略');
//          }

//          var newLangCfg = { ...langCfg, callback: (data, success,inlt) => {
//                     count = count + 1;
//                  if(!success){
//                      toast({content:'load muti lang error',color:'warning'});
//                  }
//                  result.langData = data || {};
//                  result.inlt = inlt || {};
//                  hander();
//          }};
//          props.MultiInit.getMultiLang(newLangCfg);

//          props.createUIDom(pageCfg, (data) => {
//              count = count + 1;
//              result.templateData = data || {};
//              hander();
//          });
//     };
// };
//eXMjcfkCPYk1Pd9CRjm7LcLkCa1M3socLF/7wlRjI3emn7C8HrnBHOEi2TP/OYo+