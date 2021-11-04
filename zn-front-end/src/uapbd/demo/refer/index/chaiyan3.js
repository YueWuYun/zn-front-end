//brFOjgoETquAclPfvVvZtPKkKSC6LSOdDU9xR94iEj2xOeWJjeD+14qc2uxcNe4o
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;

/*条件过滤器*/
import RefFilterGridRef from '../../../refer/other/RefFilterGridRef/index'
/*公司*/
import CorpDefaultTreeRef from '../../../refer/org/CorpDefaultTreeRef/index';
/* 部门（所有）*/
import DeptAllDataTreeRef from '../../../refer/org/DeptAllDataTreeRef/index'
/* 职务*/
import JobGridRef from '../../../refer/org/JobGridRef/index'
/* 职务（所有）*/
import JobAllDataGridRef from '../../../refer/org/JobAllDataGridRef/index'
/* 资产统计体系*/
import AssetStatStruGridRef from '../../../refer/org/AssetStatStruGridRef/index'
/* 资产统计体系（所有）*/
import AssetStatStruAllDataGridRef from '../../../refer/org/AssetStatStruAllDataGridRef/index'
/* 资产统计体系成员*/
import AssetStatStruMemberTreeRef from '../../../refer/org/AssetStatStruMemberTreeRef/index'
/* 资产组织（包括集团）：*/
import AssetOrgWithGroupGridRef from '../../../refer/org/AssetOrgWithGroupGridRef/index'
/* 资产组织（所有）：*/
import AssetOrgAllDataGridRef from '../../../refer/org/AssetOrgAllDataGridRef/index'
/* 账簿合并体系成员：*/
import BookCombineStruMemberTreeRef from '../../../refer/org/BookCombineStruMemberTreeRef/index'
/*公司版本(所有)*/
import CorpVersionTreeRef from '../../../refer/orgv/CorpVersionTreeRef/index'
/*部门版本（所有）*/
import DeptVersionAllDataTreeRef from '../../../refer/orgv/DeptVersionAllDataTreeRef/index'
/* 部门版本*/
import DeptVersionTreeRef from '../../../refer/orgv/DeptVersionTreeRef/index'
/* 账簿合并体系成员多版本*/
import BookCombineStruMemberVersionTreeRef from '../../../refer/orgv/BookCombineStruMemberVersionTreeRef/index'
/* 主组织参照*/
import AssignedOrgTreeRef from '../../../refer/org/AssignedOrgTreeRef/index'
/* 主组织参照*/
import AssignedOrgNCTreeRef from '../../../refer/org/AssignedOrgNCTreeRef/index'
/* 财务组织（包括集团）*/
import FinanceOrgWithGroupTreeRef from '../../../refer/org/FinanceOrgWithGroupTreeRef/index'



export default class Chaiyan3 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configs: {}
        }
    }

    createCfg(id, param) {
        var obj = {
            value: this.state.configs[id] ? this.state.configs[id].value : [],
            onChange: function (val) {
                var temp = Object.assign(this.state.configs[id], { value: val });
                this.setState(Object.assign(this.state.configs, temp));
            }.bind(this)
        }
        this.state.configs[id] = obj;
        var result_param = Object.assign(obj, param)
        return result_param;
    }


    render() {
        return (
            <Col md={12} xs={12} sm={12}>
                <Row>
                    <Col md={12} xs={12} sm={12}>
                        <h2>柴燕</h2>
                    </Col>
                </Row>
                <Row>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                公司:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CorpDefaultTreeRef({} = this.createCfg("CorpDefaultTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                部门（所有）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DeptAllDataTreeRef({} = this.createCfg("DeptAllDataTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "0001HR10000000002MD5"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                职务：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {JobGridRef({} = this.createCfg("JobGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "GLOBLE00000000000000"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                职务（所有）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {JobAllDataGridRef({} = this.createCfg("JobAllDataGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "GLOBLE00000000000000"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产统计体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetStatStruGridRef({} = this.createCfg("AssetStatStruGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "GLOBLE00000000000000"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产统计体系（所有）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetStatStruAllDataGridRef({} = this.createCfg("AssetStatStruAllDataGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "GLOBLE00000000000000"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产统计体系成员：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetStatStruMemberTreeRef({} = this.createCfg("AssetStatStruMemberTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            //此处需要重新赋值
                                            pk_ass: "1002AD100000000001K0"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                账簿合并体系成员：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BookCombineStruMemberTreeRef({} = this.createCfg("BookCombineStruMemberTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            //此处需要赋值
                                            pk_bcs: "1002AD1000000000029W"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产组织（包括集团）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetOrgWithGroupGridRef({} = this.createCfg("AssetOrgWithGroupGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            //此处需要赋值
                                            //pk_org:"0001HR1000000000033B"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产组织（所有）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetOrgAllDataGridRef({} = this.createCfg("AssetOrgAllDataGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            //此处需要赋值
                                            //pk_org:"0001HR1000000000033B"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                公司版本（所有）:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CorpVersionTreeRef({} = this.createCfg("CorpVersionTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                部门版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DeptVersionTreeRef({} = this.createCfg("DeptVersionTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "0001HR10000000002MD5"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                部门版本（所有）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DeptVersionAllDataTreeRef({} = this.createCfg("DeptVersionAllDataTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "0001HR10000000002MD5"
                                        };
                                    }
                                }))}

                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                账簿合并体系成员多版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BookCombineStruMemberVersionTreeRef({} = this.createCfg("BookCombineStruMemberVersionTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {

                                            //此处需要重新赋值
                                            pk_svid: "0001AD10000000000D5C"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                主组织参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssignedOrgTreeRef({} = this.createCfg("AssignedOrgTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                主组织参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssignedOrgNCTreeRef({} = this.createCfg("AssignedOrgNCTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织（包括集团）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgWithGroupTreeRef({} = this.createCfg("FinanceOrgWithGroupTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    {/* <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                            财务组织（包括集团）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgWithGroupTreeRef(
                                    {}=this.createCfg("FinanceOrgWithGroupTreeRef",{
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col> */}
                </Row>
            </Col>
        )
    }
};
//brFOjgoETquAclPfvVvZtPKkKSC6LSOdDU9xR94iEj2xOeWJjeD+14qc2uxcNe4o