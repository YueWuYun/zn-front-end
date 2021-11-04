//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/
import {ajax, base, toast ,cardCache} from 'nc-lightapp-front';
import Utils from '../../../../../public/utils';
let {setDefData, getDefData } = cardCache;
export default  function(record, index, props, key){

    debugger
    let gridId = props.config.gridId;

    let pagecode = props.config.pagecode;

    let recordVal = record.values;

    let pk_org = recordVal['pk_org'].value;

    let code = recordVal['code'].value;

    let name = recordVal['name'].value;

    let shortname = recordVal['shortname'].value;

    //缓存相关信息主键，名字等
    setDefData('orgunit_pk_org',props.config.datasource,pk_org);
    setDefData('orgunit_code',props.config.datasource,code);
    setDefData('orgunit_name',props.config.datasource,name);
    setDefData('orgunit_shortname',props.config.datasource,shortname);
    setDefData('orgunit_btnopr',props.config.datasource,'edit');

    switch (key) {
        // 表格操作按钮
        case 'opredit':
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        props.pushTo('/card', {
                            status: 'edit',
                            pagecode:props.config.cardpagecode,
                            pk_org: pk_org
                        })
                        //不需要强制查询数据库，如果有缓存就走缓存
                        setDefData('orgunit_needquerydata_'+pk_org,props.config.datasource,false);
                    }
                }
            });
            
            //cacheTools.set('orgunit_pk_org',recordVal['pk_org'].value);
            //cacheTools.set('orgunit_code',recordVal['code'].value);
            //cacheTools.set('orgunit_name',recordVal['name'].value);
            //cacheTools.set('orgunit_shortname',recordVal['shortname'].value);
            //cacheTools.set('orgunit_btnopr','edit');
            break;
        case 'oprdel':

            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        //编码回收
                        ajax({
                            url:'/nccloud/uapbd/org/rollbackcode.do',
                            data: {
                                code:code,
                                pk_org:pk_org,
                                nodetype:props.config.NODE_TYPE
                            }, 
                            success:(res)=>{
                                if(res.success){        
                                }
                            }
                        });
                        ajax({
                            url:'/nccloud/uapbd/org/delete.do',
                            data:{pk_org:[recordVal['pk_org'].value]},
                            success:(res)=>{
                                if(res.success){
                                    //删除完之后，需要把卡片翻页的主键删除掉
                                    props.cardPagination.setCardPaginationId({id:pk_org,status:3});
                                    props.modal.close('delete');
                                    props.treeTableManyCol.delRowByPk(props.config.gridId, record);
                                    toast({ color: 'success', title: this.state.json['10100ORG-000010'] });/* 国际化处理： 删除成功！*/
                                }
                            }
                        });
                    }
                }
            });
            
            // props.modal.show('delete', {
            //     title: "注意",
            //     content: '确认删除？',
            //     beSureBtnClick: ()=>{
            //         ajax({
            //             url:'/nccloud/uapbd/org/delete.do',
            //             data:{pk_org:[recordVal['pk_org'].value]},
            //             success:(res)=>{
            //                 if(res.success){
            //                     props.modal.close('delete');
            //                     props.treeTableManyCol.delRowByPk(props.config.gridId, record);
            //                     toast({ color: 'success', content: '删除成功！' });
            //                 }
            //             }
            //         });
            //     }
            // });
            break;
        case 'oprcopy':
            props.pushTo('/card', {
                status: 'edit',
                pagecode:props.config.cardpagecode,
                pk_org: pk_org
            });
            //强制查询数据库
            setDefData('orgunit_needquerydata_'+pk_org,props.config.datasource,true);
            setDefData('orgunit_btnopr',props.config.datasource,'copy');
            //cacheTools.set('orgunit_btnopr','copy');
            break;
        default:
            break;
    }
}

//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/