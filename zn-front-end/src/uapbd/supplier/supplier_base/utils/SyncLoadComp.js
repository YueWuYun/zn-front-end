//WAXJPmZ2eY4vk3gcTcBavw4MAO8FXy/bi9z/508S0oe5PmatKZxfchIKKgLGvYH7
/*********************************************************************************
 * 
 * 动态加载组件的方法
 * liupzhc 2020-02-18
 * @param {
 *           urlsArr:组件路径组成的数组,例如：['uapbd/refer/org/BusinessUnitTreeRef/index']
 *           success:加载所有组件成功的回调
 *           fail:加载组件失败的回调
 *        }
 * 
 * 加载的组件挂在window对象下  对应的属性是url，
 *  即  window['uapbd/refer/org/BusinessUnitTreeRef/index']
 * 
 * 页面内使用时：window['uapbd/refer/org/BusinessUnitTreeRef/index'].default({参数对象})
 *********************************************************************************/
export default function({urlsArr,success=()=>{},fail=()=>{}} = {}){
    if(!urlsArr || urlsArr.length == 0){
        return;
    }
    let referNum = urlsArr.length;//需加载组件的个数
    let didNum = 0;//已完成异步加载的组件个数
    (urlsArr || []).forEach((url)=>{
        if(!url || url == ''){
            throw new Error('refer url is undefined!');
        }
        if(window[url]){
            didNum++;
        }else{
            var script = document.createElement("script");
            Object.assign(script,{
                src:"../../../../"+url+".js",
                type:"text/javascript",
                onload:()  => {
                    didNum++;
                    didNum == referNum && success.call(this);
                },
                onerror:()=>{
                    didNum++;
                    didNum == referNum && fail('please check your refer url!');
                }
            });
            document.body.appendChild(script);
        }
    });
    didNum == referNum && success.call(this);
}

//WAXJPmZ2eY4vk3gcTcBavw4MAO8FXy/bi9z/508S0oe5PmatKZxfchIKKgLGvYH7