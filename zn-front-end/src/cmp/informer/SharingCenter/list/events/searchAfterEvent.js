/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAnBoRQn1JlIHIOB02i+1jyU*/
import { ajax } from 'nc-lightapp-front';
import * as CONSTANTS from '../constants';
let { searchId } = CONSTANTS;
export default function searchAfterEvent(key, value, moduleId) {
    //查询模板编辑后，事件
    if (key === 'pk_org' && moduleId === searchId) {
        this.props.search.setSearchValByField(moduleId, 'pk_acc_sub', { value: null } );
    }
}

/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAnBoRQn1JlIHIOB02i+1jyU*/