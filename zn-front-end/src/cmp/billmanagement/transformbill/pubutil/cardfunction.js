/*rm7LGieG3hAZMKYulH6TNRq7f0KV1pCBMSqDHhAaV34djck6AxVEhaj43w7oBk0J*/
import {
    createPage,
    ajax,
    base,
    toast,
    high,
    cardCache
} from 'nc-lightapp-front';
// 禁用字段
export function disablefield() {
    this.props.form.setFormItemsDisabled(this.formId, {'vbillno': true });
    this.props.form.setFormItemsDisabled(this.formId, {'busistatus': true});
    this.props.form.setFormItemsDisabled(this.formId, {
        'vbillstatus': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'settlesatus': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'olcamount': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'isrefused': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'returnreason': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'sourceflag': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'pk_srcbilltypeid': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'srcbillno': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'billmaker': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'billmakedate': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'submiter': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'submitdate': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'approver': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'approvedate': true
    });

}

// 从其他来源系统过来的单据编辑态禁用字段
export function editdiablefield() {
    this.props.form.setFormItemsDisabled(this.formId, {
        'pk_currtype': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'transformoutbank': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'transformoutaccount': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'transforminbank': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'transforminaccount': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'olcrate': true
    });
    this.props.form.setFormItemsDisabled(this.formId, {
        'amount': true
    });
}
// 更改组织清空输入数据
export function orgchangecleandata() {
    this.props.form.setFormItemsValue(this.formId, {
        'summary': {
            display: null,
            value: null
        }
    });
    this.props.form.setFormItemsValue(this.formId, {
        'transformoutbank': {
            display: null,
            value: null
        }
    });
    this.props.form.setFormItemsValue(this.formId, {
        'transformoutaccount': {
            display: null,
            value: null
        }
    });
    this.props.form.setFormItemsValue(this.formId, {
        'transforminbank': {
            display: null,
            value: null
        }
    });
    this.props.form.setFormItemsValue(this.formId, {
        'transforminaccount': {
            display: null,
            value: null
        }
    });
    this.props.form.setFormItemsValue(this.formId, {
        'amount': {
            display: null,
            value: null
        }
    });
    this.props.form.setFormItemsValue(this.formId, {
        'olcamount': {
            display: null,
            value: null
        }
    });
    this.props.form.setFormItemsValue(this.formId, {
        'pk_balatype': {
            display: null,
            value: null
        }
    });
    this.props.form.setFormItemsValue(this.formId, {
        'remark': {
            display: null,
            value: null
        }
    });
}
// 清空组织，清空其他数据
export function emptyorgcleandata() {
    // this.orgchangecleandata();
    // 摘要
    this.props.form.setFormItemsValue(this.formId, {'summary': {display: null,value: null}});
    // 币种
    this.props.form.setFormItemsValue(this.formId, {'pk_currtype': {display: null,value: null}});
    // 划出银行
    this.props.form.setFormItemsValue(this.formId, {
        'transformoutbank': {
            display: null,
            value: null
        }
    });
    // 划出银行账户
    this.props.form.setFormItemsValue(this.formId, {
        'transformoutaccount': {
            display: null,
            value: null
        }
    });
    // 划入银行
    this.props.form.setFormItemsValue(this.formId, {
        'transforminbank': {
            display: null,
            value: null
        }
    });
    // 划入账户
    this.props.form.setFormItemsValue(this.formId, {
        'transforminaccount': {
            display: null,
            value: null
        }
    });
    // 金额
    this.props.form.setFormItemsValue(this.formId, {
        'amount': {
            display: null,
            value: null
        }
    });
    // 本币汇率
    this.props.form.setFormItemsValue(this.formId, {
        'olcrate': {
            display: null,
            value: null
        }
    });
    // 组织本币金额
    this.props.form.setFormItemsValue(this.formId, {
        'olcamount': {
            display: null,
            value: null
        }
    });
    // 结算方式
    this.props.form.setFormItemsValue(this.formId, {
        'pk_balatype': {
            display: null,
            value: null
        }
    });
    // 备注
    this.props.form.setFormItemsValue(this.formId, {
        'remark': {
            display: null,
            value: null
        }
    });
}
// 根据结算方式判断是否是网银
export function isnetbank(balatypepk) {
    if (balatypepk) {
        balatypepk = null;
    }
    let isnetbank
    let balatypedata = {
        balatypepk: balatypepk
    }
    ajax({
        url: requesturl.isnetbank,
        data: balatypedata,
        async: false,
        success: (res) => {
            isnetbank = res.data;
        }
    });
    return isnetbank;
}

// 处理来源系统显示值
export function sourceflagtranslate(sourceflag) {
    if (sourceflag == '2') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000051'],
                value: sourceflag
            }
        }); /* 国际化处理： 现金管理*/
    } else if (sourceflag == '5') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000052'],
                value: sourceflag
            }
        }); /* 国际化处理： 资金结算*/
    } else if (sourceflag == '6') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000053'],
                value: sourceflag
            }
        }); /* 国际化处理： 网上银行*/
    } else if (sourceflag == '8') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000054'],
                value: sourceflag
            }
        }); /* 国际化处理： 票据管理*/
    } else if (sourceflag == '9') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000055'],
                value: sourceflag
            }
        }); /* 国际化处理： 协同单据*/
    } else if (sourceflag == '104') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000056'],
                value: sourceflag
            }
        }); /* 国际化处理： 资产管理*/
    } else if (sourceflag == '105') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000057'],
                value: sourceflag
            }
        }); /* 国际化处理： 网上报销*/
    } else if (sourceflag == '0') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000058'],
                value: sourceflag
            }
        }); /* 国际化处理： 应收系统*/
    } else if (sourceflag == '1') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000059'],
                value: sourceflag
            }
        }); /* 国际化处理： 应付系统*/
    } else if (sourceflag == '10') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000060'],
                value: sourceflag
            }
        }); /* 国际化处理： 信贷系统*/
    } else if (sourceflag == '107') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000061'],
                value: sourceflag
            }
        }); /* 国际化处理： 费用管理*/
    } else if (sourceflag == '20') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000062'],
                value: sourceflag
            }
        }); /* 国际化处理： 合同*/
    } else if (sourceflag == '3') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000063'],
                value: sourceflag
            }
        }); /* 国际化处理： 销售系统*/
    } else if (sourceflag == '4') {
        this.props.form.setFormItemsValue(this.formId, {
            'sourceflag': {
                display: this.state.json['36070TBR-000064'],
                value: sourceflag
            }
        }); /* 国际化处理： 采购系统*/
    }

    // 	if (sourceflag == '2') {
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '现金管理', value: sourceflag } });/* 国际化处理： 现金管理*/
    // 	} else if (sourceflag == '5') {                                               
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '资金结算', value: sourceflag } });/* 国际化处理： 资金结算*/
    // 	} else if (sourceflag == '6') {                                               
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '网上银行', value: sourceflag } });/* 国际化处理： 网上银行*/
    // 	} else if (sourceflag == '8') {                                               
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '票据管理', value: sourceflag } });/* 国际化处理： 票据管理*/
    // 	} else if (sourceflag == '9') {                                               
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '协同单据', value: sourceflag } });/* 国际化处理： 协同单据*/
    // 	} else if (sourceflag == '104') {                                             
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '资产管理', value: sourceflag } });/* 国际化处理： 资产管理*/
    // 	} else if (sourceflag == '105') {                                             
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '网上报销', value: sourceflag } });/* 国际化处理： 网上报销*/
    // 	} else if (sourceflag == '0') {                                               
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '应收系统', value: sourceflag } });/* 国际化处理： 应收系统*/
    // 	} else if (sourceflag == '1') {                                               
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '应付系统', value: sourceflag } });/* 国际化处理： 应付系统*/
    // 	} else if (sourceflag == '10') {                                              
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '信贷系统', value: sourceflag } });/* 国际化处理： 信贷系统*/
    // 	} else if (sourceflag == '107') {                                             
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '费用管理', value: sourceflag } });/* 国际化处理： 费用管理*/
    // 	} else if (sourceflag == '20') {                                              
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '合同', value: sourceflag } });/* 国际化处理： 合同*/
    // 	} else if (sourceflag == '3') {                                               
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '销售系统', value: sourceflag } });/* 国际化处理： 销售系统*/
    // 	} else if (sourceflag == '4') {                                               
    // 		this.props.form.setFormItemsValue(this.formId, { 'sourceflag': { display: '采购系统', value: sourceflag } });/* 国际化处理： 采购系统*/
    // 	}

}

//初始化财务组织[新增其他字段不可编辑，有值其他可以编辑]
export function initBillByPKorg() {
    let status = this.props.getUrlParam('status');
    //组织之外的字段不可以编辑
    if (status === 'add') {
        this.props.resMetaAfterPkorgEdit();
        this.props.initMetaByPkorg(); //此方法不可以调用2次，不然rest失败
        this.props.form.setFormItemsDisabled(this.formId, {
            'pk_org': false
        }); //财务组织
    }
    if (status === 'edit') {
        this.props.resMetaAfterPkorgEdit();
    }
    if (status === 'copy') {
        this.props.resMetaAfterPkorgEdit();
    }

}
/*rm7LGieG3hAZMKYulH6TNRq7f0KV1pCBMSqDHhAaV34djck6AxVEhaj43w7oBk0J*/