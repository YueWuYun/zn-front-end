//UD71kt2pH/4LuKORQHZxF9WcEAjTyr59vzmJisUpZqhuuUbvx4QJzMRsPXMwPGYV
import React, { Component } from 'react';
import './Common.less'
/**
 * 向导批改、向导分配中高级过滤组件
 * liupzhc
 */
class AssignFilter extends Component {
    constructor(props) {
        super(props);
        this.state ={
            searchcfg:{
                clickSearchBtn:this.clickSearchBtn.bind(this),
                oid:this.props.oid || '0001Z81000000000CWIB',
                showAdvBtn:false,
                hideBtnArea:true,
                onlyShowAdvArea:true
            }
        }
    }

    componentDidMount(){
        this.setSearchDefaultValue();
    }
    /**
     * 设置查询区默认值
     */
    setSearchDefaultValue = ()=>{
        //获得初始时给出的环境参数
        let envParam = this.props.envParam;
        //获得分配查询区模板
        this.props.meta.getMeta()['assignsupplierquery'].items.filter(item=>{
            if(item.attrcode.endsWith("pk_org_assign") || item.attrcode.endsWith("pk_org")){
                let data = {value:envParam.pk_org,display:envParam.org_Name};
                this.props.search.setSearchValByField('assignsupplierquery',item.attrcode, data);
            }
        })
    }
    clickSearchBtn=()=>{}
    render() {
        const{search} = this.props;
        const {NCCreateSearch} = search;
        let {searchcfg} = this.state;
        return (
            <div>
                <div className="nc-singleTable-search-area nc-singleTable-search-area-assign-self-style"> {
                    NCCreateSearch('assignsupplierquery', {...searchcfg})}
                </div>
            </div>
        )
    }
}
export default AssignFilter;

//UD71kt2pH/4LuKORQHZxF9WcEAjTyr59vzmJisUpZqhuuUbvx4QJzMRsPXMwPGYV