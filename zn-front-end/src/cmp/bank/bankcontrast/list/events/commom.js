/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/

import { sum, formatMoney } from '../../../commom/utils';

import { getProps } from './main';

//按钮
export function buttonConfig () {
    let { isShow, isManual= true, isContrast, noCheck, isFullScreen }= this.state;
    return [
        {content: this.lang('0004'), path: 'switch', show: true, isMain: true},
        {content: this.lang('0005'), path: 'manual', show: isManual && noCheck && isShow, isMain: true},
        {content: this.lang('0006'), path: 'unmanual', show: !isManual && noCheck && isShow, isMain: true},
        {content: this.lang('0007'), path: 'autocontrast.do', msg: this.lang('0007') + this.lang('0092'), show: isManual && noCheck && isShow, isMain: true},
        {content: this.lang('0008'), path: 'cancelcontrast.do', show: isManual && isShow, isMain: true},
        {content: this.lang('0017'), path: 'save.do-0', msg: this.lang('0017') + this.lang('0082'), show: !isManual && noCheck && isShow, isMain: true},
        {content: this.lang('0018'), path: 'save.do-1', msg: this.lang('0018') + this.lang('0082'), show: !isManual && noCheck && isShow, isMain: true},
        {content: this.lang('0010'), path: 'select', show: !isManual && noCheck && isShow, isMain: false},
        {content: this.lang('0011'), path: 'cancel', show: !isManual && noCheck && isShow, isMain: false},
        {content: this.lang('0012'), path: 'autocontrastbg.do', msg: this.lang('0012') + this.lang('0082'), show: isManual, isMain: true},
        {content: this.lang('0013'), path: 'more', show: noCheck && isShow, isMain: false},
        {content: <i className={`iconfont icon-zui${isFullScreen ? 'xiao' : 'da'}hua`} />, path: 'full', show: true},
        {content: <i className="iconfont icon-shuaxin1" />, path: 'refresh', show: true},
    ];
    // return list.filter(item => item.show);
}

//更多按钮
export function moreButton (isManual= true, isContrast= true) {
    let list= [
        {content: this.lang('0014'), path: 'check', show: true},
        {content: this.lang('0015'), path: 'compare.do', show: !isManual && isContrast},
        {content: this.lang('0016'), path: 'uncompare', show: !isManual && !isContrast},
    ];
    return list.filter(item => item.show);
}

export function checkColumns () {
    return [
        {
            title: <div fieldid="name">{this.lang('0055')}</div>,
            key: 'name', 
            dataIndex: 'name',
        },
        {
            title: <div fieldid="corp">{this.lang('0056')}</div>,
            key: 'corp', 
            dataIndex: 'corp',
        },
        {
            title: <div fieldid="bank">{this.lang('0057')}</div>,
            key: 'bank', 
            dataIndex: 'bank',
        },
    ];
}

export function checkData() {
    let bank= getProps.call(this, 'bankShow') || {};
    let corp= getProps.call(this, 'corpShow') || {};
    
    return [
        {
            name: <div fieldid="totalincome">{this.lang('0058')}</div>,
            corp: <div fieldid="corp">{corp.m ? Number(corp.m).formatMoney() : 0}</div>,
            bank: <div fieldid="bank">{bank.m ? Number(bank.m).formatMoney() : 0}</div>
        },
        {
            name: <div fieldid="totalexpenditure">{this.lang('0059')}</div>,
            corp: <div fieldid="corp">{corp.c ? Number(corp.c).formatMoney() : 0}</div>,
            bank: <div fieldid="bank">{bank.c ? Number(bank.c).formatMoney() : 0}</div>
        }
    ];
}
/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/