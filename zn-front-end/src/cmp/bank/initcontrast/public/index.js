/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { HeaderList, sum, Num, showMoney, setProp } from '../../commom';
const { NCButton, NCTable,NCDiv } = base;

//按钮状态
export function listOperation (start, end, type= 'list', signal) {
    let isList= type=== 'list';
    let isAdd= !this.props.getUrlParam('m_pk_corp');
    let isBrowse= this.props.getUrlParam('status')=== 'browse';
    let list= [
        {content: this.lang('0021'), path: 'add', show: !isList && isAdd && isBrowse},
        {content: this.lang('0014'), path: 'edit', show: !start && !end && (isList || (!isList && !signal && !isAdd))},
        {content: this.lang('0015'), msg: this.lang('0015') + this.lang('0071'), path: 'delete.do', show: !start && !end && (isList || (!isList && !signal && !isAdd))},
        {content: this.lang('0023'), msg: this.lang('0023') + this.lang('0071'), path: 'start.do', show: !start && !end && (isList || (!isList && !signal && !isAdd))},
        {content: this.lang('0068'), msg: this.lang('0068') + this.lang('0071'), path: 'change', show: start && (isList || (!isList && !signal && !isAdd))},
        {content: this.lang('0022'), msg: this.lang('0022') + this.lang('0071'), path: 'cancelstart.do', show: start && !end && (isList || (!isList && !signal && !isAdd))},
        {content: this.lang('0069'), msg: this.lang('0069') + this.lang('0071'), path: 'stop.do', show: start && !end && (isList || (!isList && !signal && !isAdd))},
        {content: this.lang('0025'), msg: this.lang('0025') + this.lang('0071'), path: 'settle.do', show: start && !end && (isList || (!isList && !signal && !isAdd))},
        {content: this.lang('0065'), msg: this.lang('0065') + this.lang('0071'), path: 'Unsettle.do', show: start && !end && (isList || (!isList && !signal && !isAdd))},
        {content: <i className="iconfont icon-shuaxin1" />, path: 'refresh', show: !isList && isBrowse && !isAdd},
        {content: this.lang('0033'), path: 'save', show: !isList && signal && ((isAdd && !isBrowse) || !isAdd)},
        {content: this.lang('0034'), path: 'cancel', show: !isList && signal && ((isAdd && !isBrowse) || !isAdd)},
    ];
    return list.filter((item, index) => item.show);
}

//启用按钮
export function startClick (record) {
    this.setState(
        {
            record: {
                actiontype: '1',
                m_startdate: null,
                m_pk_corp: record.m_pk_corp,
                m_pk_contrastaccount: record.m_pk_contrastaccount,
                m_contrastaspect: record.m_contrastaspect,
                m_source: record.m_source,
                m_pk_accountstart: record.m_pk_accountstart,
                m_pk_currtype: record.m_pk_currtype,
                m_isConTally: record.m_isConTally,
                accountLinks: record.accountLinks,
            }
        }, () => {
            getBusiDate.call(this, 'startModal', '0023');
        }
    );
}

//取消启用按钮
export function cancelstartClick (record) {
    this.setState({
        record: {
            m_startdate: record.m_startdate,
            actiontype: '2',
            m_pk_corp: record.m_pk_corp,
            m_pk_contrastaccount: record.m_pk_contrastaccount,
            m_pk_accountstart: record.m_pk_accountstart
        } 
    });
    this.props.modal.show('cancelStartModal', {title: this.lang('0022'), content: this.lang('0064')});
}

//停用按钮
export function stopClick (record) {
    this.setState({
        record: {
            m_pk_contrastaccount: record.m_pk_contrastaccount,
            m_years: record.m_years,
            m_pk_corp: record.m_pk_corp,
            m_startdate: record.m_startdate,
            m_source: record.m_source,
            m_pk_accountstart: record.m_pk_accountstart,
            m_stopdate: null
        } 
    }, () => {
        getBusiDate.call(this, 'stopModal', '0024');
    });
}

//结转下年按钮
export function settleClick (record) {
    this.setState(
        {
            record: {
                m_pk_contrastaccount: record.m_pk_contrastaccount, 
                m_pk_corp: record.m_pk_corp,
                m_contrastaccountname: record.m_contrastaccountname
            },
        }, () => {
            this.statusOperation('settle.do', {m_pk_contrastaccount: record.m_pk_contrastaccount, m_years: record.m_years, m_pk_corp: record.m_pk_corp, actiontype: '1'}, this.lang('0025') + this.lang('0071'));
        }
    );
}

//取消结转按钮
export function UnsettleClick (record) {
    this.setState({
        record: {
            m_pk_contrastaccount: record.m_pk_contrastaccount, 
            m_years: record.m_years, 
            m_pk_corp: record.m_pk_corp
        }
    });
    this.props.modal.show('unSettleModal', {title: this.lang('0065'), content: this.lang('0066')});
}

//启用取消启用确定
export function startConfirm (type) {
    this.statusOperation('start.do', this.state.record, (type=== 'cancel' ? this.lang('0034') : '') + this.lang('0023') + this.lang('0071'));
}

//启用弹框
export function startModalContent () {
    let { record }= this.state;
    let configList= [
        {
            label: this.lang('0009'),
            type: 'datepicker',
            config: {
                value: record.m_startdate,
                name: 'm_startdate',
            }
        },
    ];
    return (
        <div>
            <HeaderList
                configList={configList} 
                status="edit" 
                type="modal"
                onChange={(val, name) => {
                    record[name]= val;
                    this.setState({record});
                }}
            />
            <NCButton 
                fieldid="takebalance"
                className="button-primary get-balance"
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '240px'
                }}
                onClick={() => {
                    if (!record.m_startdate) {
                        toast({color: 'warning', content: this.lang('0074')});
                        return;
                    }
                    this.statusOperation('unclaim.do', record, '');
                }}
            >{this.lang('0016')}</NCButton>
            <NCDiv fieldid="start" areaCode={NCDiv.config.TableCom}>
            <NCTable 
                columns= {record.m_source=== '1' ? startColumn1.call(this) : startColumn2.call(this)}
                data= {record.accountLinks || []}
                scroll={{ x: true }}
				adaptionHeight={false}
				// otherAreaHeight={20}
            />
            </NCDiv>
            <span style={{display: 'block', marginTop: '10px'}} fieldid="balance">
                {this.lang('0075')}:<span style={{color: '#FF6100', paddingLeft: '10px'}}>{showMoney(record.accountLinks && sum(record.accountLinks.map(item => item.money || 0))) || 0}</span>
            </span>
        </div>
    );
}

//启用弹框table-1
export function startColumn1() {
    return [
        { 
            title: <div fieldid="index">{this.lang('0005')}</div>, 
            key: 'index', 
            dataIndex: 'index', 
            render: (text, record, index) => {
                return (<span>{index + 1}</span>);
            }
        },
        { 
            title: <div fieldid="accountorgname">{this.lang('0031')}</div>, 
            key: 'accountorgname', 
            dataIndex: 'accountorgname', 
            render: (text, record, index) => {
                return (<div fieldid="accountorgname">{text?text:<span>&nbsp;</span>}</div>);
            }
        },
        { 
            title: <div fieldid="projectname">{this.lang('0011')}</div>, 
            key: 'projectname', 
            dataIndex: 'projectname', 
            render: (text, record, index) => {
                return (<div fieldid="projectname">{text?text:<span>&nbsp;</span>}</div>);
            }
        },
        { 
            title: <div fieldid="m_memo">{this.lang('0012')}</div>, 
            key: 'm_memo', 
            dataIndex: 'm_memo', 
            render: (text, record, index) => {
                return (<div fieldid="m_memo">{text?text:<span>&nbsp;</span>}</div>);
            }
        },
        { 
            title: <div fieldid="money">{this.lang('0013')}</div>, 
            key: 'money', 
            dataIndex: 'money', 
            render: (text, record, index) => {
                return (
                    <Num
                        value={text}
                        scale={8}
                        onChange={startChange.bind(this, index)}
                    />
                );
            } 
        },
    ];
}

//启用弹框table-2
export function startColumn2() {
    let { searchMap, detail }= this.state;
    let obj= (searchMap && searchMap.m_pk_corpName) || (detail && detail.orgName);
    return [
        { 
            title: <div fieldid="index">{this.lang('0005')}</div>, 
            key: 'index', 
            dataIndex: 'index', 
            render: (text, record, index) => {
                return (<span>{index + 1}</span>);
            }
        },
        { 
            title: <div fieldid="accountorgname">{this.lang('0001')}</div>, 
            key: 'accountorgname', 
            dataIndex: 'accountorgname', 
            render: (text, record, index) => {
                return (<div fieldid="accountorgname">{text?text:<span>&nbsp;</span>}</div>);
            }
        },
        { 
            title: <div fieldid="bankaccname">{this.lang('0032')}</div>, 
            key: 'bankaccname', 
            dataIndex: 'bankaccname', 
            render: (text, record, index) => {
                return (<div fieldid="bankaccname">{text?text:<span>&nbsp;</span>}</div>);
            }
        },
        { 
            title: <div fieldid="money">{this.lang('0013')}</div>, 
            key: 'money', 
            dataIndex: 'money',
            render: (text, record, index) => {
                return (
                    <Num
                        value={text}
                        scale={8}
                        onChange={startChange.bind(this, index)}
                    />
                );
            } 
        },
    ];
}

//启用弹框state-change
export function startChange (key, val) {
    let { record }= this.state;
    record.accountLinks[key].money= val;
    this.setState({record});
}

//停用弹框
export function stopModalContent () {
    let { record }= this.state;
    let configList= [
        {
            fieldid:"m_stopdate",
            label: this.lang('0017'),
            type: 'datepicker',
            config: {
                value: record.m_stopdate || null,
                name: 'm_stopdate',
            }
        }
    ];
    return (
        <HeaderList
            configList={configList} 
            status="edit" 
            type="modal"
            showType="one-column"
            onChange={date => {
                record.m_stopdate= date;
                this.setState({
                    record
                });
            }}
        />
    );
}

//停用确定
export function stopConfirm () {
    let { record }= this.state;
    if (!record.m_stopdate) {
        toast({color: 'warning', content: this.lang('0073')});
        setProp.call(this, 'stopModal');
        return;
    }
    this.statusOperation('stop.do', record, this.lang('0069') + this.lang('0071'));
}

//结转下年弹框
export function settleModalContent () {
    let { record }= this.state;
    let configList= [
        {
            label: this.lang('0018'),
            value: record.m_contrastaccountname,
            config:{
                name:"m_contrastaccountname",
            }
        },
        {
            label: this.lang('0019'),
            value: record.m_years,
            config:{
                name:"m_years",
            }
        },
    ];
    return (
        <HeaderList
            configList={configList} 
            type="modal"
            showType
        />
    );
}

//结转下年确定
export function settleConfirm () {
    this.statusOperation('settle.do', this.state.record, this.lang('0025') + this.lang('0071'));
}

export function getBusiDate (modal, title) {
    let { record }= this.state;
    ajax({
        url: '/nccloud/cmp/initcontrast/getbusidate.do',
        success: (res) => {
            let { success, data } = res;
            if (success) {
                record[modal=== 'startModal' ? 'm_startdate' : 'm_stopdate']= data;
                this.setState(
                    {record}, () => {
                        modal!== 'AssidModal' && setProp.call(this, modal);
                    }
                );
            }
        },
        error: res => {
            modal!== 'AssidModal' && setProp.call(this, modal);
        }
    });
}

export function closeModal (path) {
    switch (path) {
        case 'start.do':
            setProp.call(this, 'startModal', false);
            break;
        case 'stop.do':
            setProp.call(this, 'stopModal', false);
            break;
        case 'settle.do':
            setProp.call(this, 'settleModal', false);
            break;
    }
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/