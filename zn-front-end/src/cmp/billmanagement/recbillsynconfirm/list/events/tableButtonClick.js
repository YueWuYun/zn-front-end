/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { toast } from 'nc-lightapp-front';
import { edittableBtn } from '../tableButtonClick/edittableBtn.js';
import { deletetableBtn } from '../tableButtonClick/deletetableBtn.js';
import { confirmBtn } from '../tableButtonClick/confirmBtn.js';
import { unconfirmBtn } from '../tableButtonClick/unconfirmBtn.js';

export default function tableButtonClick(props, key, text, record, index) {
    switch (key) {
        //编辑
        case 'edittableBtn':
            edittableBtn.call(this, record, index);
            break;
        //list操作类删除
        case 'deletetableBtn':
            deletetableBtn.call(this, record, index);
            break;
        case 'makebilltableBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
            break;
        case 'approvetableBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
            break;
        case 'submittableBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
            break;
        case 'unsubmittableBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
            break;
        //确认
        case 'confirmBtn':
            confirmBtn.call(this, record, index);
            break;
        //取消确认
        case 'unconfirmBtn':
            unconfirmBtn.call(this, record, index);
            break;

    }

}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/