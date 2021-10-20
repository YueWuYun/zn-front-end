/*r33qDQprUhlJR2oFdneby8RxXcySnosHSdjF/IaL94h3DZCXzNvdmg5G4TtFvk7h*/
import { ajax } from 'nc-lightapp-front';
const sagaCheck= '/nccloud/tmpub/pub/sagacheck.do'; 

export  function sagaApi(params) {
    let { name, data, success, error } = params;
    let path = sagaCheck;
    ajax({
        url: path,
        data,
        success: res => {
            success && success(res);
        }
    });
}
/*r33qDQprUhlJR2oFdneby8RxXcySnosHSdjF/IaL94h3DZCXzNvdmg5G4TtFvk7h*/