//Th56z9Tsz9zJfL38VvSrEvHETwYFONkYgQ8ofSOBtaugQlN9FV3wucV1cKp5Y4dLpz0FyQ+pE98Y
//6WJMNmHz8w==
import {ajax,toast} from 'nc-lightapp-front';
export default function(custName){
    // ajax({
    //     url:'/nccloud/uapbd/customer/baseAction.do',
    //     data:{
    //         actionName: 'oprCustinfo'
    //     },
    //     success:(res)=>{
    //         let{data} = res;
    //         if(data){
    //             let{BDcloundParam} = data;
    //             window.open("/iuapmdm_fr/enterprise.html#/"+custName)
    //         }else {
    //             toast({
    //                 color:'warning',
    //                 content:this.state.json['bdcloundParam']
    //             });
    //         }
    //     }
    // });

    // window.open("/iuapmdm_fr/enterprise.html#/"+custName)
    //下面调用diwork的接口
    // window.open("https://cmdm.diwork.com/csmdm/iuapmdm_fr/enterprise.html?serviceCode=CSMDM_Enterprise#/"+custName)
    // let enterpriseUrl = "https://cmdm.diwork.com/csmdm/iuapmdm_fr/enterprise.html?serviceCode=CSMDM_Enterprise#/"+custName;
    ajax({
        url:'/nccloud/uapbd/customer/CustomerLoginContextAction.do',
        data:{
            custName:custName
        },
        success:(res)=>{
            let{data} = res;
            if(data){
                window.open(data)
            }else {
                toast({
                    color:'warning',
                    content:this.state.json['bdcloundParam']
                });
            }
        }
    });
}
//Th56z9Tsz9zJfL38VvSrEvHETwYFONkYgQ8ofSOBtaugQlN9FV3wucV1cKp5Y4dLpz0FyQ+pE98Y
//6WJMNmHz8w==