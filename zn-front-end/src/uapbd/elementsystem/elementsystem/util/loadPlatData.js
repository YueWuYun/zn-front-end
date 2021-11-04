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


//eXMjcfkCPYk1Pd9CRjm7LcLkCa1M3socLF/7wlRjI3emn7C8HrnBHOEi2TP/OYo+