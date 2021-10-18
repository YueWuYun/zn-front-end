/*uEYRH3Y+GHKjzacVCFbVJWss2TzOfLxK1QhB3bkCNHqwT85y+jNJB437Mey5cCaf*/
import {
    ajax,
    toast
} from 'nc-lightapp-front';
export const CMPIVPara = function () {
    let req;
    let elecFlag = false;
    debugger;
    ajax({
        url: '/nccloud/cmp/pub/cmpIVPara.do',
        data: req,
        async: false,
        success: (res) => {
            if (res.data.IV0001) {
                elecFlag = true;
            }

        }
    });
    return elecFlag;
}
export const CMPEableSscivm = function () {
   let imageBtn=false;
    let req;
    if (this.state.sscivmMessage) {
        toast({
            color: 'error',
            content: this.state.sscivmMessage
        }); /* 国际化处理： 请选择单条数据进行复制操作*/
        imageBtn=true
        return  imageBtn;
    }
    ajax({
        url: '/nccloud/cmp/pub/cmpIVPara.do',
        data: req,
        async: false,
        success: (res) => {
            if (res.data.MESSAGE) {
                imageBtn=true;
                this.setState({
                        sscivmMessage: res.data.MESSAGE //单据pk
                    },
                    () => {
                        toast({
                            color: 'error',
                            content: this.state.sscivmMessage
                        }); 

                      
                    }
                );
            } 

        }
    });
    return imageBtn;
}
/*uEYRH3Y+GHKjzacVCFbVJWss2TzOfLxK1QhB3bkCNHqwT85y+jNJB437Mey5cCaf*/