/*rcJmjASCkbDKyMWrzuM4e4SMNXAKkmpQ3Tk0Ptiu99g=*/
import { base } from 'nc-lightapp-front';
import { compareOperation, unCompareOperation } from './compare';
import { autoSearchData } from './auto';
import { cancelContrastData } from './cancel';
import { quickSearchData, contrastSearchData } from './quick';
import { saveOperation } from './save';
import { toSearch } from './search';
import { deepClone, width, setProp, resolveColumn,showMoney } from '../../../commom';
const { NCMenu } = base;

export function bankColumns () {
    let { pages }= this.state;
    let list= [
        { 
            title: <div fieldid="numberindex">{ this.lang('0084')}</div>, 
            key: 'index', 
            dataIndex: 'index',  
            fixed: true,
            width: '60px',
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{(pages.bankPageNum - 1) * pages.bankPageSize + index + 1}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_checkdate">{this.lang('0040')}</div>, 
            key: 'm_vo.m_checkdate', 
            dataIndex: 'm_vo.m_checkdate',
            width,
            render: (text) => {
                return (
                    <div fieldid="m_checkdate">{text ? text && text.substr(0, 10) :<span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="m_explanation">{this.lang('0041')}</div>,
            key: 'm_vo.m_explanation', 
            dataIndex: 'm_vo.m_explanation', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_explanation">{text ? text : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="m_checkstyle">{this.lang('0028')}</div>,
            key: 'm_vo.m_checkstyle', 
            dataIndex: 'm_vo.m_checkstyle', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_checkstyle">{text ? text : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="m_pk_check">{this.lang('0029')}</div>,
            key: 'm_vo.m_pk_check', 
            dataIndex: 'm_vo.m_pk_check', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_pk_check">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="oppunitname">{this.lang('0042')}</div>,
            key: 'oppunitname', 
            dataIndex: 'oppunitname',  
            width,
            render: (text) => {
                return (
                    <div fieldid="oppunitname">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="nusage">{this.lang('0043')}</div>,
            key: 'm_vo.nusage', 
            dataIndex: 'm_vo.nusage', 
            width,
            render: (text) => {
                return (
                    <div fieldid="nusage">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_debitamount">{this.lang('0032')}</div>, 
            key: 'm_vo.m_debitamount', 
            dataIndex: 'm_vo.m_debitamount',  
            className: 'money-right', 
            width,
            render: text => {
                return (
                    <div fieldid="m_debitamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="m_creditamount">{this.lang('0033')}</div>,
            key: 'm_vo.m_creditamount', 
            dataIndex: 'm_vo.m_creditamount',   
            className: 'money-right',
            width, 
            render: text => {
                return (
                    <div fieldid="m_creditamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="m_caved">{this.lang('0044')}</div>, 
            key: 'm_caved', 
            dataIndex: 'm_caved', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_caved">{text ? this.lang('0045') : text=== false ? this.lang('0046') : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="batchNumber">{this.lang('0039')}</div>,
            key: 'm_vo.batchNumber', 
            dataIndex: 'm_vo.batchNumber', 
            width,
            render: (text) => {
                return (
                    <div fieldid="batchNumber">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="netbanknumber">{this.lang('0047')}</div>,
            key: 'm_vo.netbanknumber', 
            dataIndex: 'm_vo.netbanknumber',
            width,
            render: (text) => {
                return (
                    <div fieldid="netbanknumber">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="transerial">{this.lang('0108')}</div>,
            key: 'm_vo.transerial', 
            dataIndex: 'm_vo.transerial',
            width,
            render: (text) => {
                return (
                    <div fieldid="transerial">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
    ];
    return resolveColumn(list);
}

export function corpColumns () {
    let { pages }= this.state;
    let list= [
        { 
            title: <div fieldid="numberindex">{this.lang('0084')}</div> ,
            key: 'index', 
            dataIndex: 'index',  
            width: '60px',
            fixed: true,
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{(pages.corpPageNum - 1) * pages.corpPageSize + index + 1}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_prepareddate">{this.lang('0048')}</div>,
            key: 'm_vo.m_prepareddate', 
            dataIndex: 'm_vo.m_prepareddate', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_prepareddate">{text ? text && text.substr(0, 10) : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_pk_corp">{this.lang('0019')}</div>,
            key: 'm_pk_corp', 
            dataIndex: 'm_pk_corp', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_pk_corp">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_pk_glorgbook">{this.lang('0049')}</div>,
            key: 'm_vo.m_pk_glorgbook', 
            dataIndex: 'm_vo.m_pk_glorgbook', 
            width: '200px',
            render: (text) => {
                return (
                    <div fieldid="m_pk_glorgbook">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_pk_subject">{this.lang('0050')}</div>,
            key: 'm_vo.m_pk_subject', 
            dataIndex: 'm_vo.m_pk_subject', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_pk_subject">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_pk_ass">{this.lang('0051')}</div>,
            key: 'm_vo.m_pk_ass', 
            dataIndex: 'm_vo.m_pk_ass', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_pk_ass">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_vouchno">{this.lang('0038')}</div>,
            key: 'm_vo.m_vouchno', 
            dataIndex: 'm_vo.m_vouchno',
            width,
            render: (text) => {
                return (
                    <div fieldid="m_vouchno">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_explanation">{this.lang('0041')}</div>,
            key: 'm_vo.m_explanation', 
            dataIndex: 'm_vo.m_explanation',
            width,
            render: (text) => {
                return (
                    <div fieldid="m_explanation">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_pk_checkstyle">{this.lang('0028')}</div>,
            key: 'm_vo.m_pk_checkstyle', 
            dataIndex: 'm_vo.m_pk_checkstyle',
            width,
            render: (text) => {
                return (
                    <div fieldid="m_pk_checkstyle">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_checkno">{this.lang('0029')}</div>,
            key: 'm_vo.m_checkno', 
            dataIndex: 'm_vo.m_checkno', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_checkno">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="oppunitname">{this.lang('0042')}</div>, 
            key: 'oppunitname', 
            dataIndex: 'oppunitname',
            width,
            render: (text) => {
                return (
                    <div fieldid="oppunitname">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_checkdate">{this.lang('0030')}</div>,
            key: 'm_vo.m_checkdate', 
            dataIndex: 'm_vo.m_checkdate',
            width,
            render: (text) => {
                return (
                    <div fieldid="m_checkdate">{text ? text.substr(0, 10): <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_debitamount">{this.lang('0032')}</div>,
            key: 'm_vo.m_debitamount', 
            dataIndex: 'm_vo.m_debitamount',   
            className: 'money-right', 
            width,
            render: text => {
                return (
                    <div fieldid="m_debitamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_creditamount">{this.lang('0033')}</div>,
            key: 'm_vo.m_creditamount', 
            dataIndex: 'm_vo.m_creditamount',   
            className: 'money-right', 
            width,
            render: text => {
                return (
                    <div fieldid="m_creditamount">{text ? showMoney(text) : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_caved">{this.lang('0044')}</div>, 
            key: 'm_caved', 
            dataIndex: 'm_caved', 
            width,
            render: (text) => {
                return (
                    <div fieldid="m_caved">{text ? this.lang('0045') : text=== false ? this.lang('0046') : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="batchNumber">{this.lang('0039')}</div>, 
            key: 'm_vo.batchNumber', 
            dataIndex: 'm_vo.batchNumber',
            width,
            render: (text) => {
                return (
                    <div fieldid="batchNumber">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="netbanknumber">{this.lang('0047')}</div>, 
            key: 'm_vo.netbanknumber', 
            dataIndex: 'm_vo.netbanknumber',
            width, 
            render: (text) => {
                return (
                    <div fieldid="netbanknumber">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="transerial">{this.lang('0108')}</div>,
            key: 'm_vo.transerial', 
            dataIndex: 'm_vo.transerial',
            width,
            render: (text) => {
                return (
                    <div fieldid="transerial">{text ? text : <span>&nbsp;</span>}</div>
                );
            }
        },
    ];
    return resolveColumn(list);
}

export function getFooter (type) {
    let { bankSelect, corpSelect, isContrast, compareFlag, contrastaspect }= this.state;
    let isAspect= (type=== 'corp') || (type=== 'bank' && contrastaspect=== '0');
    let selectArr= [];
    let bank= (this.props.ViewModel.getData('bankSelect') || []).slice(1);
    let corp= (this.props.ViewModel.getData('corpSelect') || []).slice(1);
    let bankShow= this.props.ViewModel.getData('bankShow');
    let corpShow= this.props.ViewModel.getData('corpShow');
    
    if (isContrast) {
        if (type=== 'corp') {
            for (let item2 of corp) {
                selectArr= selectArr.concat(item2);
            }
        } else if (type=== 'bank') {
            for (let item1 of bank) {
                selectArr= selectArr.concat(item1);
            }
        }
    } else {
        if (type=== 'corp' && compareFlag=== '1') {
            for (let item2 of corp) {
                selectArr= selectArr.concat(item2);
            }
        } else if (type=== 'corp' && compareFlag=== '2') {
            selectArr= corpSelect;
        } else if (type=== 'bank' && compareFlag=== '1') {
            selectArr= bankSelect;
        } else if (type=== 'bank' && compareFlag=== '2') {
            for (let item1 of bank) {
                selectArr= selectArr.concat(item1);
            }
        }
    }
    let data= sumShow(selectArr);
    this.props.ViewModel.setData(type=== 'corp' ? 'corpShow' : 'bankShow', data)
    return (
        <div className="table-footer" fieldid="bottom-area">
            <span>{this.lang(isAspect ? '0052' : '0053')}: <span className="footer-money">{(data.m || data.c) ? Number(isAspect ? data.m : data.c).formatMoney() : 0}</span></span>
            <span>{this.lang(isAspect ? '0053' : '0052')}: <span className="footer-money">{(data.m || data.c) ? Number(isAspect ? data.c : data.m).formatMoney() : 0}</span></span>
            <span>{this.lang('0054')}: <span className="footer-money">{data.mc ? ((isAspect ? 1 : -1) * Number(data.mc)).formatMoney() : 0}</span></span>
        </div>
    );
}

const sumShow = selectArr => {
    let obj= {
        m: 0,
        c: 0,
        mc: 0
    };
    let mon=0;
    let con=0;
    let mcon=0; 
    for (let item of selectArr) {
        mon+=Number(item.m_vo.m_debitamount);
        con+=Number(item.m_vo.m_creditamount);
    }
    obj.m = mon.toFixed(2);
    obj.c=con.toFixed(2);
    mcon=Number(obj.m) - Number(obj.c);
    obj.mc= mcon.toFixed(2);
    //obj.mc= Number(obj.m) - Number(obj.c);
    return obj;
}

export function dropDownMenu (dropArr, path) {
    return <NCMenu
        className='apply-dropdown'
        onClick={items => {
            setTimeout(() => {
                btnClick.call(this, dropArr[items.key]);
            }, 0)
        }}
    >
        {
            dropArr.map((item, index) => {
                return <NCMenu.Item fieldid="review" key={index}>{item.content}</NCMenu.Item>
            })	
        }
    </NCMenu>;
}

export function onChangePageIndex (type, val) {
    let { pages, isBlnChecked, isManual }= this.state;
    let key1, key2, key3;
    switch (type) {
        case 'corp':
            pages.corpPageNum= val;
            key1= 'corpData';
            key2= 'corpSelect';
            key3= 'corpBool';
            break;
        case 'bank':
            pages.bankPageNum= val;
            key1= 'bankData';
            key2= 'bankSelect';
            key3= 'bankBool';
            break;
    }
    this.setState(
        {pages}, () => {
            let data= getProps.call(this, key1, val);
            if (data && data.length) {
                this.setState({
                    [key1]: isBlnChecked && !isManual ? data.filter(item => !item.m_caved) : data,
                    [key2]: getProps.call(this, key2, val),
                    [key3]: getProps.call(this, key3, val),
                });
            } else {
                this.getList(type);
            }
        }
    );
}

export function getProps (key, index) {
    let data= this.props.ViewModel.getData(key);
    if (!index) {
        return data;
    }
    if (data && data.length) {
        return data[index] || [];
    }
    return [];
}

export function setProps (key, val, index) {
    let data= this.props.ViewModel.getData(key);
    if (data && data.length) {
        data[index]= val || [];
        this.props.ViewModel.setData(key, data);
    } else { 
        this.props.ViewModel.setData(key, [null, val]);
    }
}

export function clearProps (keys) {
    for (let key of keys) {
        this.props.ViewModel.setData(key, null);
    }
}

export function btnClick (item) {
    let { bankData, corpData, isManual, isContrast, cancelContrast, searchMap, isSwitch, pages, isBlnChecked, isFullScreen }= this.state;
    let { bankPageNum, corpPageNum }= pages;
    
    switch (item.path) {
        case 'switch':  	//切换
            this.setState({
                isSwitch: !isSwitch,
            });
            break;
        case 'full':  	//切换
            this.setState({isFullScreen: !isFullScreen})
            break;
        case 'select':  	//全选
            let banks= bankData.filter(item => !item.m_caved);
            let corps= corpData.filter(item => !item.m_caved);
            this.setState({
                bankSelect: deepClone(banks),
                corpSelect: deepClone(corps),
                bankBool: Array(banks.length).fill(true),
                corpBool: Array(corps.length).fill(true),
            });
            setProps.call(this, 'bankSelect', deepClone(banks), bankPageNum);
            setProps.call(this, 'bankBool', Array(banks.length).fill(true), bankPageNum);
            setProps.call(this, 'corpSelect', deepClone(corps), corpPageNum);
            setProps.call(this, 'corpBool', Array(corps.length).fill(true), corpPageNum);
            break;
        case 'cancel':  	//全消
            this.setState({
                bankSelect: [],
                corpSelect: [],
                bankBool: [], 
                corpBool: [],
            });
            setProps.call(this, 'bankSelect', [], bankPageNum);
            setProps.call(this, 'bankBool', [], bankPageNum);
            setProps.call(this, 'corpSelect', [], corpPageNum);
            setProps.call(this, 'corpBool', [], corpPageNum);
            break;
        case 'cancelcontrast.do':  	//取消勾对
            cancelContrast.contrastVo.m_pk_contrastaccount= searchMap.m_Pk_Account;
            cancelContrast.glContrastVo.m_pk_contrastaccount= searchMap.m_Pk_Account;
            cancelContrast.glContrastVo.m_pk_corp= searchMap.m_Pk_Corp;
            setProp.call(this, 'cancelContrastModal');
            this.setState(
                {cancelContrast}, () => {
                    this.setState({cancelContrast: deepClone(cancelContrastData)});
                }
            );
            break;
        case 'manual':  	//手动勾对
            this.setState({
                isManual: !isManual,
                bankData: isBlnChecked ? bankData.filter(item => !item.m_caved) : bankData,
                corpData: isBlnChecked ? corpData.filter(item => !item.m_caved) : corpData,
            });
            break;
        case 'unmanual': 	//取消手动勾对
            this.setState({
                isManual: !isManual,
                bankSelect: [], 
                bankBool: [], 
                corpSelect: [], 
                corpBool: [],
                isContrast: true,
                bankData: getProps.call(this, 'bankData', 1),
                corpData: getProps.call(this, 'corpData', 1),
            });
            clearProps.call(this, ['bankSelect', 'bankBool', 'corpSelect', 'corpBool']);
            break;
        case 'check': 	//检查
            setProp.call(this, 'checkModal');
            break;
        case 'compare.do': 	//对照
            this.setState(
                {
                    isContrast: !isContrast,
                }, () => {
                    compareOperation.call(this);
                }
            );
            break;
        case 'uncompare': 	//取消对照
            unCompareOperation.call(this);
            break;
        case 'save.do-0': 	//保存
            this.setState(
                {
                    adjustFlag: '0'	
                }, () => {
                    saveOperation.call(this);
                }
            );
            break;
        case 'save.do-1': 	//保存
            this.setState(
                {
                    adjustFlag: '1'	
                }, () => {
                    saveOperation.call(this);
                }
            );
            break;
        case 'autocontrastbg.do': 	//快速对账
            setProp.call(this, 'quickModal');
            this.setState({
                contrastSearch: deepClone(contrastSearchData),
                quickSearch: deepClone(quickSearchData),
            });
            break;
        case 'autocontrast.do': 	//自动勾对
            this.setState({autoSearch: deepClone(autoSearchData)});
            setProp.call(this, 'autoModal');
            break;
        case 'refresh': 	//刷新
            toSearch.call(this);
            break;
    }
}
/*rcJmjASCkbDKyMWrzuM4e4SMNXAKkmpQ3Tk0Ptiu99g=*/