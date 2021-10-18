/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, toast } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
import clickSearchBtn from './searchBtnClick';
export default function buttonClick(props, id) {
    switch (id) {
        //刷新
        case 'Refresh':
            let queryInfo = props.search.getQueryInfo(jsoncode.searchcode, true);
            clickSearchBtn.call(this, props, queryInfo.querycondition, null,null, true);
            break;

    }
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/