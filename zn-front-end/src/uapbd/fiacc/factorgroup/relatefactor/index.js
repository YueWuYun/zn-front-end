//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, print, high, promptBox, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
const { NCDiv } = base;

const { NCCheckbox, NCMessage: Message, NCModal, NCButton, NCRow, NCCol } = base;
const { Header, Body } = NCModal;
const pageCode = "10140ETSFG_factorgroup";

class Factor extends Component {

    /**
     * 构造函数
     * @param props
     */
    constructor(props) {

        super(props)
        this.config = props.config
        this.getRelateFactor = props.getRelateFactor

        this.initTemplate(this.props)

    }

    initTemplate = (props) => {

        props.createUIDom({
            pagecode: pageCode
        },
            (data) => {
                props.meta.setMeta(data.template);
            });

        this.loadTableData(props, this.config)

    }

    loadTableData(props, pks) {
        let pageInfo = props.table.getTablePageInfo();
        let requestparam = {
            existpks: pks,
            pageInfo: pageInfo,
            pagecode: pageCode
        }
        ajax({
            url: '/nccloud/uapbd/factorgroup/relatefactor.do',
            data: requestparam,
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData('relatefactor', data['factorlist']);
                    } else {
                        props.table.setAllTableData('relatefactor', { rows: [] });
                    }
                }
            }
        });

    }

    onSelectedFn(){
        let data = this.props.table.getCheckedRows('relatefactor')
        if(!!data){
            this.getRelateFactor(data)
        }else{
            this.getRelateFactor([])
        }
        
    }




    render() {

        const { table } = this.props

        const { createSimpleTable } = table

        return (
            <div className="nc-single-table">
                {/* 列表区 */}
                <div className='nc-singleTable-table-area"'>
                    {createSimpleTable('relatefactor', {
                        onSelected: this.onSelectedFn.bind(this),  
                        onSelectedAll: this.onSelectedFn.bind(this),    
                        showIndex: true,
                        showCheck: true
                    })}


                </div>
            </div>

        )
    }
}

export default Factor = createPage({
})(Factor)












//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65