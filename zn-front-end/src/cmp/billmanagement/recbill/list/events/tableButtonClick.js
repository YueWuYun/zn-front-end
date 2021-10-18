/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { toast } from 'nc-lightapp-front';
import { submitAssginBtn } from '../tableButtonClick/submitAssginBtn.js';
import { cachepagecode } from '../buttonClick/cachepagecode.js';
import { edittableBtn } from '../tableButtonClick/edittableBtn.js';
import { deletetableBtn } from '../tableButtonClick/deletetableBtn.js';
import { makebilltableBtn } from '../tableButtonClick/makebilltableBtn.js';
import { submittableBtn } from '../tableButtonClick/submittableBtn.js';
import { unsubmittableBtn } from '../tableButtonClick/unsubmittableBtn.js';
import { redbillBtn } from '../tableButtonClick/redbillBtn.js';
import { checkEditRight } from '../../util/checkEditRight.js';
/**
 * 列表-操作列按钮
 * @param {*} props 
 * @param {*} key 
 * @param {*} text 
 * @param {*} record 
 * @param {*} index 
 */
export default function tableButtonClick(props, key, text, record, index) {
    //所选交易类型，pagecode
    cachepagecode.call(this);
    switch (key) {
        //list总操作列中动作
        case 'edittableBtn':
            checkEditRight.call(this, record.pk_recbill.value).then((res) => {
                edittableBtn.call(this, record, index);
            });
            break;
        //删除
        case 'deletetableBtn':
            deletetableBtn.call(this, record, index);
            break;
        //制单
        case 'makebilltableBtn':
            makebilltableBtn.call(this, record, index);
            break;
        case 'approvetableBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
            break;
        //提交
        case 'submittableBtn':
            submittableBtn.call(this, record, index);
            break;
        //提交指派
        case 'submitAssginBtn':
            submitAssginBtn.call(this, record, index);
            break;
        //收回
        case 'unsubmittableBtn':
            unsubmittableBtn.call(this, record, index);
            break;
        //红冲
        case 'redbillBtn':
            redbillBtn.call(this, record, index);
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/