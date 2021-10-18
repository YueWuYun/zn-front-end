/*Y5ZbEH5TGr/JjDtd2fg+vFp0yHR9X3cLV8SmIrBMKf4zWdCMfV8dGRYREJTMw+rk*/
import { ajax } from 'nc-lightapp-front';
export const CMPIVPara = function () {
   let req;
   let elecFlag=false;
   debugger;
    ajax({
        url: '/nccloud/cmp/pub/cmpIVPara.do',
        data: req,
        async: false,
        success: (res) => {
            if (res.data.IV0001) {
                elecFlag= true;
            }
            
        }
    });
    return elecFlag;
}
/*Y5ZbEH5TGr/JjDtd2fg+vFp0yHR9X3cLV8SmIrBMKf4zWdCMfV8dGRYREJTMw+rk*/