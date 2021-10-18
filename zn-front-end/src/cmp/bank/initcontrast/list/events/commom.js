/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/
import { base } from 'nc-lightapp-front';
import { listOperation, startClick, stopClick, settleClick } from '../../public';
import { showMoney, width, deepClone, setPageProp } from '../../../commom';
const { NCPopconfirm, NCDropdown, NCMenu } = base;

export function list (search) {
    return [
        {
            itemtype: 'refer',
            label: this.lang('0001'),
            code: 'm_pk_corp',
            required: true,
            config: {
                placeholder: this.lang('0001'),
                refName: this.lang('0001'),
                name: 'm_pk_corp',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgTreeRef.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgTreeRef',
                isMultiSelectedEnabled: false,
                isTreelazyLoad: false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true, 
                treeConfig: {name:[ this.lang('0003'),this.lang('0004')],code: [ 'refcode','refname']},
                rootNode: { refname: this.lang('0001'), refpk: 'root' },
                queryCondition: {
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgAllGroupBuilder'
                },
                value: {
                    refname: search.m_pk_corpName, 
                    refpk: search.m_pk_corp
                }
            }
        }
    ];
}

export function columns() {
    let { page, size }= this.state.pages;
    return [
        { 
            title:<div fieldid="numberindex">{this.lang('0005')}</div>,
            key: 'key', 
            dataIndex: 'key',
            className: 'pleft20', 
            width: '80px',
            render: (text, record, index) => {
                return (
                    <div fieldid="numberindex">{(page - 1) * size + index + 1}</div>
                );
            } 
        },
        { 
            title: <div fieldid="orgName">{this.lang('0001')}</div>, 
            key: 'orgName', 
            dataIndex: 'orgName', 
            width,
            render: (text, record) => {
                return (
                    <div fieldid="orgName">{text?text:<span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_contrastaccountname">{ this.lang('0002')}</div>,
            key: 'm_contrastaccountname', 
            dataIndex: 'm_contrastaccountname', 
            width,
            render: (text, record) => {
                return (
                    <div
                        fieldid="m_contrastaccountname"
                        style={{color: '#007ace', cursor: 'pointer'}}
                        onClick= {() => {
                            setPageProp.call(this, 'initcontrastSearch', this.state.searchMap);
                            this.props.pushTo('/card', {
                                status: 'browse',
                                m_pk_corp: record.m_pk_corp,
                                m_pk_contrastaccount: record.m_pk_contrastaccount,
                                pagecode: '3607ACAS_C01',
                            });
                        }}
                    >{text?text:<span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title:<div fieldid="currnetname">{ this.lang('0026')}</div>,
            key: 'currnetname', 
            dataIndex: 'currnetname',
            width: '100px',  
            render: (text, record) => {
                return (
                    <div fieldid="currnetname">{text?text:<span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_source">{this.lang('0027')}</div>,
            key: 'm_source', 
            dataIndex: 'm_source', 
            width: '100px',  
            render: (text, record) => {
                return (
                    <div fieldid="m_source">{text?text== 1 ? this.lang('0028') : this.lang('0029'):<span>&nbsp;</span>}</div>
                );
            } 
        },
        { 
            title: <div fieldid="m_startdate">{this.lang('0009')}</div>,
            key: 'm_startdate', 
            dataIndex: 'm_startdate',
            width: '100px',  
            render: (text, record) => {
                return (
                    <div fieldid="m_startdate">{text?text:<span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="m_debitamount">{this.lang('0030')}</div>,
            key: 'm_debitamount', 
            dataIndex: 'm_debitamount', 
            className: 'money-right',
            width,
            render: (text, record)  => {
                return (
                    <div fieldid="m_debitamount">{ text ? showMoney(0==parseInt(text) ? record.m_creditamount : record.m_debitamount) :<span>&nbsp;</span> }</div>
                );
            }
        },
        { 
            title: <div fieldid="m_stopdate">{this.lang('0017')}</div>,
            key: 'm_stopdate', 
            dataIndex: 'm_stopdate',  
            width: '100px',  
            render: (text, record) => {
                return (
                    <div fieldid="m_stopdate">{text?text:<span>&nbsp;</span>}</div>
                );
            }
        },
        { 
            title: <div fieldid="operation">{this.lang('0008')}</div>,
            key: 'operation', 
            dataIndex: 'operation', 
            width: '200px',
            fixed: 'right',
            render: (text, record, index) => {
                let start= record.m_startdate;
                let end= record.m_stopdate;
                let showArr= listOperation.call(this, start, end);
                let dropArr= [];
                if (showArr.length > 3) {
                    dropArr= showArr.slice(2);
                    showArr= showArr.slice(0, 2);
                }
                return (
                    <div className="single-line-and-ellipsis"fieldid="operation">
                        <span className="opration-wrapper">
                        {
                            showArr.map((item, index) => {
                                return (
                                    <div className="nc-hotkeys-wrapper" style={{display: 'inline-block'}} >
                                        {
                                            ['delete.do', 'cancelstart.do', 'Unsettle.do'].includes(item.path) ?
                                                <NCPopconfirm
                                                    trigger="click"
                                                    placement="top"
                                                    content={this.lang(item.path=== 'delete.do' ? '0063' : item.path=== 'cancelstart.do' ? '0064' : '0066')}
                                                    onClose={btnClick.bind(this, item, record)}
                                                >
                                                    <a className="row-edit-option" fieldid={item.content==='取消启用'?'cancelenable':'del'}>
                                                        {item.content}
                                                    </a>
                                                </NCPopconfirm>
                                            :
                                                <a 
                                                    fieldid={item.content==="变更"?'change':"update"}
                                                    className="row-edit-option"
                                                    onClick={btnClick.bind(this, item, record)}
                                                >
                                                    {item.content}
                                                </a>
                                        }
                                    </div>
                                )
                            })
                        }
                        {dropArr.length ? <NCDropdown
                            fieldid="init"
                            trigger={['click']}
                            overlay={dropDownMenu.call(this, dropArr, record)}
                            animation="slide-up"
                            overlayClassName="dropdown-component-list"
                            // onVisibleChange={visible => this.setState({visible})}
                            >
                                <a  fieldid="more"
                                    href="javascript:void(0)"
                                    className="row-more"
                                >
                                    {this.lang('0076')}
                                    {/* {this.state.visible ? (
                                        <i className="iconfont icon-hangcaozuoxiangshang1" />
                                    ) : (
                                        <i className="iconfont icon-hangcaozuoxiala1" />
                                    )} */}
                                </a>
                        </NCDropdown> : null
                        }
                        </span>
                    </div>
                );
            } 
        },
    ];
}

function dropDownMenu (dropArr, record) {
    return <NCMenu
        className='apply-dropdown'
        onClick={items => {
            setTimeout(() => {
                btnClick.call(this, dropArr[items.key], record);
            }, 0)
        }}
    >
        {
            dropArr.map((item, index) => {
                if (['delete.do', 'cancelstart.do', 'Unsettle.do'].includes(item.path)) {
                    return (
                        <NCPopconfirm
                            trigger="click"
                            placement="top"
                            content={this.lang(item.path=== 'delete.do' ? '0063' : item.path=== 'cancelstart.do' ? '0064' : '0066')}
                            onClose={btnClick.bind(this, item, record)}
                        >
                            <span className="u-dropdown-menu-item" fieldid="cancelcarry">
                                {item.content}
                            </span>
                        </NCPopconfirm>
                    );
                } else {
                    return ( <NCMenu.Item key={index} fieldid={item.content==="停用"?'stop':'carrynextyear'}>{item.content}</NCMenu.Item>);
                }
            })	
        }
    </NCMenu>;
}

function btnClick (item, record) {
    this.setState({
        listRecord: deepClone(record)
    });
    switch (item.path) {
        case 'edit':
            setPageProp.call(this, 'initcontrastSearch', this.state.searchMap);
            this.props.pushTo('/card', {
                status: item.path,
                m_pk_corp: record.m_pk_corp,
                m_pk_contrastaccount: record.m_pk_contrastaccount,
                pagecode: '3607ACAS_C01',
            });
            break;
        case 'change':
            setPageProp.call(this, 'initcontrastSearch', this.state.searchMap);
            this.props.pushTo('/card', {
                status: item.path,
                m_pk_corp: record.m_pk_corp,
                m_pk_contrastaccount: record.m_pk_contrastaccount,
                pagecode: '3607ACAS_C01',
            });
            break;
        case 'delete.do':
            this.statusOperation(item.path, {m_pk_contrastaccount: record.m_pk_contrastaccount}, item.msg);
            break;
        case 'start.do':
            startClick.call(this, record);
            break;
        case 'stop.do':
            stopClick.call(this, record);
            break;
        case 'settle.do':
            settleClick.call(this, record);
            break;
        case 'cancelstart.do':
            this.statusOperation('start.do', {
                m_startdate: record.m_startdate,
                actiontype: '2',
                m_pk_corp: record.m_pk_corp,
                m_pk_contrastaccount: record.m_pk_contrastaccount,
                m_pk_accountstart: record.m_pk_accountstart
            }, item.msg);
            break;
        case 'Unsettle.do':
            this.statusOperation(item.path, {
                m_pk_contrastaccount: record.m_pk_contrastaccount, 
                m_years: record.m_years, 
                m_pk_corp: record.m_pk_corp
            }, item.msg);
            break;
    }
}
/*ws2JyAMFMsx2yaqphjfkmfPF3rDYTVHv6tMvkrjDZ9olLwIjpsghSIheUUY60eUu*/