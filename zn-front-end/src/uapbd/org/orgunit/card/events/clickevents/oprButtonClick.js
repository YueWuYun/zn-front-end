//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/
import {ajax, base, toast,cardCache,promptBox } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
export default  function(gridId,props,id){

    let _this = this;
    var pk_org = props.getUrlParam('pk_org')
    if(undefined == pk_org){
        pk_org = getDefData('orgunit_pk_org', _this.config.datasource);//cacheTools.get('orgunit_pk_org');
    }
    var status = props.getUrlParam('status')
    
    if(undefined == pk_org ){
        toast({content : _this.state.json['10100ORG-000000'],color : 'warning'});/* 国际化处理： 请先选择组织！*/
    }
    var orgtype = "";

    //用于获取选中的职能类型主键
    _this.config.orgtypearr.map((obj)=>{
        if(obj.subGrid === gridId){
            orgtype = obj.pk_orgtype;
        }
    })
    let buttonname = '' ;
    //以前是一个停启用控制所有职能，现在由于需要根据各个职能去单独控制职能显示停用或者启用，所以各个职能模块的停启用按钮名字都加了只能前缀，
    //由于不想修改后台方法，所以截取各个职能最后enable和disable控制
    if(id.indexOf("enable") != -1){
        buttonname = id.substring(0,id.indexOf("enable"));
        id = 'enable';
    }else{
        buttonname = id.substring(0,id.indexOf("disable"));
        id = 'disable';
    }
    //判断按钮可以用行，如果已经启用就不能再启用
    let enable = props.form.getFormItemsValue(gridId,'enablestate');
    switch (id) {
        // 表格操作按钮
        case 'enable':
            if(enable.value == 2){
                toast({content : _this.state.json['10100ORG-000031'],color : 'warning'});/* 国际化处理： 该职能已经启用！*/
                break;
            }
            promptBox({
                color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000032'],/* 国际化处理： 您确定要启用所选数据吗？*/
                beSureBtnClick: () =>{
                    ajax({
                        url:'/nccloud/uapbd/org/orgtypeenbale.do',
                        data:{pk_org:pk_org,orgtype:orgtype,enable:'2'},
                        success:(res)=>{
                            let {success,data} = res;
                            if(success){
                                _this.config.orgtypearr.map((obj)=>{
                                    props.form.setFormStatus(obj.subGrid,'browse');
                                })
                                toast({ color: 'success', title: _this.state.json['10100ORG-000018'] });/* 国际化处理： 启用成功！*/
                                props.form.setFormItemsValue(gridId,{'enablestate':{value:'2',display:_this.state.json['10100ORG-000017']}});/* 国际化处理： 已启用*/
                                //起用成功之后，需要更新按钮状态
                                toggleShow(props,'2',buttonname);
                            };
                        }
                    });
                }   
            })

            break;
        case 'disable':
            if(enable == 2){
                toast({content : _this.state.json['10100ORG-000033'],color : 'warning'});/* 国际化处理： 该职能已经停用！*/
                break;
            }
            promptBox({
                color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000034'],/* 国际化处理： 您确定要停用所选数据吗？*/
                beSureBtnClick: () =>{
                    ajax({
                        url:'/nccloud/uapbd/org/orgtypeenbale.do',
                        //data:formdata,
                        data:{pk_org:pk_org,orgtype:orgtype,enable:'3'},
                        success:(res)=>{
                            let {success,data} = res;
                            if(success){
                                _this.config.orgtypearr.map((obj)=>{
                                    props.form.setFormStatus(obj.subGrid,'browse');
                                })
                                toast({ color: 'success', title: _this.state.json['10100ORG-000014'] });/* 国际化处理： 停用成功！*/
                                //停用成功之后，需要把界面上停启用改变
                                props.form.setFormItemsValue(gridId,{'enablestate':{value:'3',display:_this.state.json['10100ORG-000013']}});/* 国际化处理： 已停用*/
                                //停用成功之后，需要更新按钮状态
                                toggleShow(props,'3',buttonname);
                            };
                        }
                    });
                }   
            })
            break;
        default:
            break;
    }
}

//切换页面状态--设置按钮显示和业务状态
function  toggleShow (props,enablestate,buttonname){
    if(enablestate ==='2'){//启用状态
        props.button.setButtonVisible([buttonname + 'disable'],true);
        props.button.setButtonVisible([buttonname + 'enable'],false);
    }else{
        props.button.setButtonVisible([buttonname + 'disable'],false);
        props.button.setButtonVisible([buttonname + 'enable'],true);
    }
}

//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/