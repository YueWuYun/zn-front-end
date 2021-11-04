//xbBNZdDFBeHR0NxHIc8oEDkBV4w+8uTzHTkEzXIGZXDwaVZztAZVmT8VChrpJM0G
import {cardCache} from 'nc-lightapp-front';
const {setDefData} = cardCache;
/**
 * 银行账户列表双击行事件
 * @param record
 * @param index
 * @param props
 */
export default function (record, index, props) {

    setDefData('id', this.config.datasource, record['pk_bankaccbas'].value);
    let editurl = '/card';
    props.pushTo(editurl, {
        status: 'browse',
        pagecode:props.config.pagecode_card,
        id: record.pk_bankaccbas.value,
        appcode: props.config.appcode

    });
}

//xbBNZdDFBeHR0NxHIc8oEDkBV4w+8uTzHTkEzXIGZXDwaVZztAZVmT8VChrpJM0G