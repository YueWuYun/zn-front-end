/*zTjtRMrfXkwpbiCYSAF0SJ4itYxxhU/wareT8LZrMh3xDhsc7zBrULY/3PlCkZxu*/

import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import {orgVersionView} from '../../../../tmpub/pub/util/version/index.js';//多版本视图

/**
 * [收款结算]-[多版本控制]
 * @param {*} props  
 * @param {*} formId  headcode
 */
export const orgVersionUtil = function (props,formId) {
    //console.log(props,'orgVersion');
    debugger
    orgVersionView(props,formId,'pk_org','pk_org_v');//组织版本显示
    // orgVersionView(props,formId,'pk_fiorg','pk_fiorg_v');//组织版本显示
    // orgVersionView(props,formId,'pk_pcorg','pk_pcorg_v');//组织版本显示
}

/*zTjtRMrfXkwpbiCYSAF0SJ4itYxxhU/wareT8LZrMh3xDhsc7zBrULY/3PlCkZxu*/