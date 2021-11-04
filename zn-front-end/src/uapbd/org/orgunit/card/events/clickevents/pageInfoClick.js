//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1
import {ajax,cardCache} from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;

export default  function(props, pk){

    let btnopr = getDefData('orgunit_btnopr', props.config.datasource);//cacheTools.get('orgunit_btnopr');
        let data = {
            pk_org:pk,btnopr:btnopr
        };
 
    let status = props.getUrlParam('status');
    let that = this;
    ajax({
        url: queryorgunitUrl,
        data:data,
        success: (res) => {
            if(res.data){
                res.data.map((obj) =>{
                    that.config.orgtypearr.map((enb)=>{
                        if(obj.hasOwnProperty('org')){
                            if(!(status == 'add' ||  status == 'edit')){
                                //控制表头的停用启用
                                that.props.toggleShow(that.props,obj.org.rows[0].values.enablestate.value)
                            }
                            setDefData('orgunit_name',props.config.datasource,obj.org.rows[0].values.name.value);
                            //cacheTools.set('orgunit_name',obj.org.rows[0].values.name.value)
                        }
                        if(obj.hasOwnProperty(enb.subGrid)){
                            that.props.toggleButtonShow(that.props,obj[enb.subGrid].rows[0].values.enablestate.value,enb.subGrid);
                            that.props.form.setAllFormValue({[enb.subGrid]:obj[enb.subGrid]});
                        }
                    })
                })
                if(status != 'browse'){
                    that.props.form.setFormStatus('org','edit');
                }
            }
        }
    }); 
}

//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1