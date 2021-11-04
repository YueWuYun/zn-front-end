//V7GymzTsSqFknEVJgzW6h5lwuWxsT5RBtf6cWH/Gqalf4VF6/suFCM0uaYuE4tXY
import {ajax, base, toast} from 'nc-lightapp-front';
/**
 *客户国家税类肩部按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export  default function (props,id) {
    switch (id){
        case 'subGrid3Add':
            props.cardTable.addRow(props.config.subGrid3);
            props.cardTable.setStatus(props.config.subGrid3,'edit');
            break;
    }

}

//V7GymzTsSqFknEVJgzW6h5lwuWxsT5RBtf6cWH/Gqalf4VF6/suFCM0uaYuE4tXY