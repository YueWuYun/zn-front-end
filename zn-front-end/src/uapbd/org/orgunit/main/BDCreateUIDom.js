//cPb1BQxEZ8c0dGZlqiLjACdcX18RTSjTDvGEelrAZ1nBTDjJ/sFtoAPDQkAIIvou
import { toast,ajax} from 'nc-lightapp-front';
export default function(props){
     return ( pageCfg = {} , langCfg = {}, callback ) => {

         var count = 0;
         var result = {};

         var hander = () => {
             if(count == 3){
                 callback && callback(result.templateData || {} , result.langData || {},result.inlt||{},result.root ||{});
             }
         }
         if(langCfg.callback){
             console.log('咱们自己createUIDom会同时获取多语和单据模板,并通过一个回调函数返回, langCfg中的回调函数将被忽略');
         }

         var newLangCfg = { ...langCfg, callback: (data, success,inlt) => {
                    count = count + 1;
                 if(!success){
                     toast({content:'load muti lang error',color:'warning'});
                 }
                 result.langData = data || {};
                 result.inlt = inlt || {};
                 hander();
         }};
         props.MultiInit.getMultiLang(newLangCfg);

         let reqData = [
            {
                rqUrl: '/uapbd/org/haverootorgunit.do',
                rqCode: 'haverootorgunit'
            },
            {
                rqUrl: '/uapbd/org/haveadminrootorgunit.do',
                rqCode: 'haveadminrootorgunit'
            },
            {
                rqUrl: '/uapbd/org/isgroupadmin.do',
                rqCode: 'usertype'
            },
            {
                rqUrl: '/uapbd/org/havecorprootorgunit.do',
                rqCode: 'havecorprootorgunit'
            }
        ];
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqData,
            success : (res) => {
                var rootdata = {
                    adminroot:{},
                    corproot:{},
                    orgroot:{},
                    usertype:''
                }
                rootdata.adminroot = res.data.haveadminrootorgunit;
                rootdata.corproot = res.data.havecorprootorgunit;
                rootdata.orgroot = res.data.haverootorgunit;
                rootdata.usertype = res.data.usertype;
                result.root = rootdata
                count = count + 1;
                hander();
                // this.state.adminroot = res.data.haveadminrootorgunit;
                // this.state.corproot = res.data.havecorprootorgunit;
                // this.state.orgroot = res.data.haverootorgunit;
                // this.state.usertype = res.data.usertype;
            }
        });


         props.createUIDom(pageCfg, (data) => {
             count = count + 1;
             result.templateData = data || {};
             hander();
         });
    };
};
//cPb1BQxEZ8c0dGZlqiLjACdcX18RTSjTDvGEelrAZ1nBTDjJ/sFtoAPDQkAIIvou