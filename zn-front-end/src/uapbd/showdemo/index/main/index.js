//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax ,NCCreateSearch} from 'nc-lightapp-front';
const {NCCol:Col,NCRow:Row,NCButton:Button} = base;
import './index.less';

/**
 * 演示主页
 */
class ShowDemo extends Component {
    constructor(props){
        super(props)
    }

    wanglinw ={
        goTotranstypetype:()=>{
            window.open("/uapbd/busiinfo/transtype/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToSetofbook:()=>{
            window.open("/uapbd/org/setofbook/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }

    mazheng = {
        goToTreeTable:()=>{
            window.open("/uapbd/psninfo/psndoc/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToSysParamGlb:()=>{
            window.open("/uapbd/param/sysparam-glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToSysParamGrp:()=>{
            window.open("/uapbd/param/sysparam-grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToSysParamOrg:()=>{
            window.open("/uapbd/param/sysparam-org/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    };

    liupzhc={
        goToEpsGrp:()=>{
            window.open("/uapbd/pmbase/eps_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToEpsGlb:()=>{
            window.open("/uapbd/pmbase/eps_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToProjectTypeGlb:()=>{
            window.open("/uapbd/pmbase/projecttype_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
            // alert("开发中……");
        },
        goToProjectTypeGrp:()=>{
            window.open("/uapbd/pmbase/projecttype_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
        
    }

    zhenmingxing={
        goToTableCardglb:()=>{
            window.open("/uapbd/org/job_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToTableCardgrp:()=>{
            window.open("/uapbd/org/job_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        psnclGlbTreeCard:()=>{
            window.open("/uapbd/psninfo/psncl_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        psnclGrpTreeCard:()=>{
            window.open("/uapbd/psninfo/psncl_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        postCardTable:()=>{
            window.open("/uapbd/org/post/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        customerGlb:()=>{
            window.open("/uapbd/customer/customer_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        customerGrp:()=>{
            window.open("/uapbd/customer/customer_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        customerBus:()=>{
            window.open("/uapbd/customer/customer_bsunit/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        bankAccountGrp:()=>{
            window.open("/uapbd/sminfo/bankAccount_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        bankAccountForg:()=>{
            window.open("/uapbd/sminfo/bankAccount_forg/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }
    yinshuangbin={
        goToEditTable:()=>{
            window.open("/uapbd/userdef/defdoclist/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }

    zhouchunxing={
        goToTaxKindGlobeTable:()=>{
            window.open("/uapbd/taxinfo/taxkind-glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToTaxKindOrgTable:()=>{
            window.open("/uapbd/taxinfo/taxkind-org/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToProdlineGlobeTable:()=>{
            window.open("/uapbd/material/prodline-glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToProdlineGroupTable:()=>{
            window.open("/uapbd/material/prodline-grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToStatusTable:()=>{
            window.open("/uapbd/ambase/status/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },       
    }

    xuewen={
        goToPostseries_glb:()=>{
            window.open("/uapbd/org/postseries_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToPostseries_grp:()=>{
            window.open("/uapbd/org/postseries_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToVouchertype_glb:()=>{
            window.open("/uapbd/fiacc/vouchertype_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToVouchertype_grp:()=>{
            window.open("/uapbd/fiacc/vouchertype_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToVouchertype_org:()=>{
            window.open("/uapbd/fiacc/vouchertype_org/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }
    zoujinga={
        goToIncotermTable:()=>{
            window.open("/uapbd/busiinfo/incoterm/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToCashAccountTable:()=>{
            window.open("/uapbd/sminfo/cashaccount/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToNoteTyepTable:()=>{
            window.open("/uapbd/sminfo/notetype/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToBalaTypeTable:()=>{
            window.open("/uapbd/sminfo/balatype/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }

    wangdca={
        goToCreditctlregion:()=>{
            window.open("/uapbd/org/creditctlregion/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToFundmanasys_glb:()=>{
            window.open("/uapbd/org/fundmanasys_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToFundmanasys_grp:()=>{
            window.open("/uapbd/org/fundmanasys_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToAreaclass_glb:()=>{
            window.open("/uapbd/address/areacalss_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToAreaclass_grp:()=>{
            window.open("/uapbd/address/areacalss_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToReportcbs_glb:()=>{
            window.open("/uapbd/address/reportcbs_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToReportcbs_grp:()=>{
            window.open("/uapbd/address/reportcbs_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToBudgetorgstru_glb:()=>{
            window.open("/uapbd/address/budgetorgstru_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToBudgetorgstru_grp:()=>{
            window.open("/uapbd/address/budgetorgstru_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }

    chaiyan3={
        goToCustaxes:()=>{
            window.open("/uapbd/customer/custaxes/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToSuptaxes:()=>{
            window.open("/uapbd/supplier/suptaxes/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToAsslinenum:()=>{
            window.open("/uapbd/sminfo/asslinenum/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToMaterialcostmode:()=>{
            window.open("/uapbd/material/materialcostmode/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }

    wangqchf={
        goToIncomePeriodGrp:()=>{
            window.open("/uapbd/sminfo/incomeperiod-grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToIncomePeriodOrg:()=>{
            window.open("/uapbd/sminfo/incomeperiod-org/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToPayPeriodGrp:()=>{
            window.open("/uapbd/sminfo/payperiod-grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToPayPeriodOrg:()=>{
            window.open("/uapbd/sminfo/payperiod-org/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }
    zhangwxf={
        goToRecpaytype:()=>{
            window.open("/uapbd/sminfo/recpaytype/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToExpset:()=>{
            window.open("/uapbd/ctbasedoc/expset/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }
    liusenc={
        goToMsclGrp:()=>{
            window.open("/uapbd/material/mscl_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToMsclOrg:()=>{
            window.open("/uapbd/material/mscl_org/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },	
        goToMcclGrp:()=>{
            window.open("/uapbd/material/mcclg_grp/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToMcclOrg:()=>{
            window.open("/uapbd/material/mcclg_org/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToMeas:()=>{
            window.open("/uapbd/material/meas/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },		
    }
    zhaochxs={
        goToPsnidtype:()=>{
            window.open("/uapbd/psninfo/psnidtype/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }
    wanglqh={
        goToBankaccUsepowerGrp:()=>{
            window.open("/uapbd/sminfo/bankaccusepower_glb/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        },
        goToBankaccUsepowerOrg:()=>{
            window.open("/uapbd/sminfo/bankaccusepower_org/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }	
    }
    tangcht={
        goToBankaccUsepowerGrp:()=>{
            window.open("/uapbd/pubinfo/countryzone/main/index.html","target=_blank, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        }
    }
    render(){

        return(
            <Row>
                <Col md={12} xs={12} sm={12}>
                   <span>组织信息+基础数据页面测试入口</span>
                </Col>
                <Col md={12} xs={12} sm={12}>
                    &nbsp;
                </Col>
                <Col md={12} xs={12} sm={12}>
                    <span className="title">周春星：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhouchunxing.goToTaxKindGlobeTable }>税种-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhouchunxing.goToTaxKindOrgTable }>税种-组织</Button>
                    </div>
                </Col>

                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhouchunxing.goToProdlineGlobeTable }>产品线-全局</Button>
                    </div>
                </Col>

                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhouchunxing.goToProdlineGroupTable }>产品线-集团</Button>
                    </div>
                </Col>

                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhouchunxing.goToStatusTable }>资产状态</Button>
                    </div>
                </Col>

                <Col md={12} xs={12} sm={12}>
                    <span className="title">马征：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.mazheng.goToTreeTable }>人员（树表-字段多-侧边栏范例）</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.mazheng.goToSysParamGlb }>业务参数设置-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.mazheng.goToSysParamGrp }>业务参数设置-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.mazheng.goToSysParamOrg }>业务参数设置-组织</Button>
                    </div>
                </Col>

                <Col md={12} xs={12} sm={12}>
                    <span className="title">甄明星：</span>
                </Col>

                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.goToTableCardglb }>职务-全局(单表-字段多-侧边栏范例</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.goToTableCardgrp}>职务-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.psnclGlbTreeCard }>人员类别-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.psnclGrpTreeCard }>人员类别-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.postCardTable }>岗位</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.customerGlb}>客户-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.customerGrp}>客户-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.customerBus}>客户-业务单元</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.bankAccountGrp }>银行账户-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhenmingxing.bankAccountForg }>银行账户-财务组织</Button>
                    </div>
                </Col>
                <Col md={12} xs={12} sm={12}>
                    <span className="title">殷双斌：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.yinshuangbin.goToEditTable }>自定义档案定义(单表-字段少)范例</Button>
                    </div>
                </Col>
                <Col md={12} xs={12} sm={12}>
                    <span className="title">刘平章：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liupzhc.goToEpsGrp }>企业项目结构（EPS）-集团(树卡)范例</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liupzhc.goToEpsGlb }>企业项目结构（EPS）-全局</Button>
                    </div>
                </Col>
                
                
				<Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liupzhc.goToProjectTypeGlb }>项目类型-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liupzhc.goToProjectTypeGrp }>项目类型-集团</Button>
                    </div>
                </Col>
                <Col md={12} xs={12} sm={12}>
                    <span className="title">薛文：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.xuewen.goToPostseries_glb }>岗位序列-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.xuewen.goToPostseries_grp }>岗位序列-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.xuewen.goToVouchertype_glb }>凭证类别-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.xuewen.goToVouchertype_grp }>凭证类别-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.xuewen.goToVouchertype_org }>凭证类别-核算账簿</Button>
                    </div>
                </Col>
                <Col md={12} xs={12} sm={12}>
                    <span className="title">邹静：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zoujinga.goToIncotermTable }>贸易术语</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zoujinga.goToCashAccountTable }>现金账户</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zoujinga.goToNoteTyepTable }>票据类型</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zoujinga.goToBalaTypeTable }>结算方式</Button>
                    </div>
                </Col>

                <Col md={12} xs={12} sm={12}>
                    <span className="title">王德臣：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToCreditctlregion }>信用控制域</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToFundmanasys_glb }>资金管理体系-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToFundmanasys_grp }>资金管理体系-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToAreaclass_glb }>地区分类-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToAreaclass_grp }>地区分类-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToReportcbs_glb }>报表合并体系-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToReportcbs_grp }>报表合并体系-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToBudgetorgstru_glb }>预算组织体系-全局</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangdca.goToBudgetorgstru_grp }>预算组织体系-集团</Button>
                    </div>
                </Col>
                
                <Col md={12} xs={12} sm={12}>
                    <span className="title">柴燕：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.chaiyan3.goToCustaxes }>客户税类</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.chaiyan3.goToSuptaxes }>供应商税类</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.chaiyan3.goToAsslinenum }>人行联行信息</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.chaiyan3.goToMaterialcostmode }>物料计价方式初始设置</Button>
                    </div>
                </Col>

                <Col md={12} xs={12} sm={12}>
                    <span className="title">王庆春：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangqchf.goToIncomePeriodGrp }>收款时点-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangqchf.goToIncomePeriodOrg }>收款时点-业务单元</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangqchf.goToPayPeriodGrp }>付款时点-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wangqchf.goToPayPeriodOrg }>付款时点-业务单元</Button>
                    </div>
                </Col>

                <Col md={12} xs={12} sm={12}>
                    <span className="title">张炜雪：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhangwxf.goToRecpaytype }>收付款类型</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhangwxf.goToExpset }>合同费用-集团</Button>
                    </div>
                </Col>

                <Col md={12} xs={12} sm={12}>
                    <span className="title">刘森：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liusenc.goToMsclGrp }>物料销售分类-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liusenc.goToMsclOrg }>物料销售分类-销售组织</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liusenc.goToMcclGrp }>物料成本分类-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liusenc.goToMcclOrg }>物料成本分类-业务单元</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.liusenc.goToMeas }>计量单位</Button>
                    </div>
                </Col>						

                <Col md={12} xs={12} sm={12}>
                    <span className="title">赵成晓：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.zhaochxs.goToPsnidtype }>人员证件类型注册</Button>
                    </div>
                </Col>

                <Col md={12} xs={12} sm={12}>
                    <span className="title">王立奇：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wanglqh.goToBankaccUsepowerGrp }>银行账户授权情况查询-集团</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wanglqh.goToBankaccUsepowerOrg }>银行账户授权情况查询-财务组织</Button>
                    </div>
                </Col>

                <Col md={12} xs={12} sm={12}>
                    <span className="title">王林：</span>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wanglinw.goTotranstypetype }>运输方式</Button>
                    </div>
                </Col>
                <Col md={3} xs={3} sm={3}>
                    <div className='container'>
                        <Button colors="primary" size='lg' onClick={ this.wanglinw.goToSetofbook }>账簿类型</Button>
                    </div>
                </Col>
            </Row>
        )
    }
}





ReactDOM.render(<ShowDemo/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65