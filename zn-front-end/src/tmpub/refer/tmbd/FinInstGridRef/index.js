/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
const { PopRefer,MultiLangWrapper } = high.Refer;// 引入PopRefer类
class Ref extends PopRefer { // 继承PopRefer类
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // 继承state
            flag: '0'
        };
    }

}
const Warrper = MultiLangWrapper(Ref);
export class RefofFininstitution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refValue: {},
            flag: '0'
        };
    }
    render() {
        return (
            <div style={{width: '100%'}}>
                <Warrper
                    {...this.props}
                    multiLang={{domainName: 'tmpub',
                    currentLocales: 'zh-CN',
                    moduleId: 'tmpubRefer'}}
                    refName = {'refer-0046'}
                    refCode = {'tmpub.refer.tmbd.FinInstGridRef'}
                    refType = {'gridTree'}
                    queryTreeUrl = {'/nccloud/tmpub/refer/financialtypetreeref.do'}
                    queryGridUrl = {'/nccloud/tmpub/refer/fininstgridref.do'}
                    rootNode = {{refname: 'refer-0046', refpk:'root'}}
                    columnConfig = {[
                        {
                            name: [ 'refer-0005', 'refer-0010' ],
                            code: [ 'code', 'name' ]
                        }
                    ]}
                    flag = {this.state.flag}
                />
            </div>
        );
    }
}

export default function(props) {
    return <RefofFininstitution {...props}/>;
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/