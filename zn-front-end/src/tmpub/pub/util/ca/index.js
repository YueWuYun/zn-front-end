/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import {
    ajax,
    base,
    getBusinessInfo,
    toast,
    viewModel
} from "nc-lightapp-front";
import ReactDOM from "react-dom";

let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
const { NCLoading } = base;

export default async function Sign({
    data = {},
    encryptVOClassName = "",
    isSign = true,
    isKey = true,
    head = "head",
    isSave = false, //判断是否是保存接口
    primaryId = null //支付时使用
}) {
    primaryId = primaryId
        ? Array.isArray(primaryId)
            ? primaryId
            : [primaryId]
        : primaryId;
    data = primaryId ? { text: primaryId.join(""), signText: null } : data;
    if (!(isSign || isKey)) {
        //不加签不弹框直接返回data
        return {
            data,
            isStop: false
        };
    }
    if (isSave) {
        //保存操作，已弹过框，就不弹第二次
        let isSignKey = getGlobalStorage("localStorage", "isSignKey");
        if (isSignKey === "1") {
            isKey = false;
        } else {
            setGlobalStorage(
                "localStorage",
                "isSignKey",
                isKey ? 1 : 2,
                () => {}
            );
        }
    }

    let businessInfo = getBusinessInfo();
    if (!businessInfo || !businessInfo.userCode) {
        toast({
            color: "warning",
            content: "无法获取当前登录用户信息, 请重新登录!"
        });
        return {
            data,
            isStop: true
        };
    }
    let div,
        returnData = {},
        signStr = "",
        encryptkey = {};
    div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(<NCLoading show={true} fullScreen />, div);

    //执行Ajax请求
    if (isSign) {
        //加签弹框、加签不弹框
        if (!primaryId) {
            //非支付时使用
            returnData = await getSignStr(data, head, encryptVOClassName, div);
            if (JSON.stringify(returnData) === "{}") {
                div && ReactDOM.unmountComponentAtNode(div);
                return {
                    data,
                    isStop: true
                };
            }
            signStr = returnData.signStr;
            encryptkey = returnData.encryptkey;
        } else {
            //支付时使用
            signStr = data.text;
        }
    }
    //console.log(signStr, "signStr--明文");
    let isca = await getIsca();
    if (!isca) {
        isKey = false;
    }
    let signVal = superSign(signStr, businessInfo.userCode, isKey, isca);
    if (signVal.status !== 0) {
        toast({
            color: "warning",
            content: signVal.msg || "系统异常错误, 请重新尝试!"
        });
        div && ReactDOM.unmountComponentAtNode(div);
        return {
            data,
            isStop: true
        };
    }
    if (isSign) {
        //加签弹框、加签不弹框
        if (!primaryId) {
            //非支付时使用
            signStr = signVal.signStr;
            let tablerelation = returnData.tablerelation;
            for (let key in encryptkey) {
                let datas = (key === "head"
                    ? data[head]
                    : data["body"] || data["bodys"])[tablerelation[key]][
                    "rows"
                ];
                for (let item of datas) {
                    item["values"][encryptkey[key]] = { value: signStr };
                }
            }
            data.userjson = signVal.sn;
        } else {
            //支付时使用
            data.signText = signVal.signStr;
            data.userjson = signVal.sn;
        }
    }
    //console.log(data, "data");
    //console.log(signStr, "signStr--暗文");
    div && ReactDOM.unmountComponentAtNode(div);
    return {
        data,
        isStop: false
    };
}

// 获取签名字段信息
async function getSignStr(data, head, encryptVOClassName, div) {
    let signStr = "";
    let returnData = await getSignDetail(encryptVOClassName, div);
    let {
        order,
        tabledata,
        tableinfo,
        encryptkey,
        tablerelation,
        scale = { scale: 8 }
    } = returnData;
    if (JSON.stringify(returnData) === "{}") {
        return {};
    }
    for (let name of tableinfo) {
        let signObj = tabledata[name];
        let list = (name === "head"
            ? data[head]
            : data["body"] || data["bodys"])[tablerelation[name]]["rows"].sort(
            (a, b) => a["values"][order]["value"] - b["values"][order]["value"]
        );

        for (let item of list) {
            if (item.status === "3") {
                //删除态的数据不签名
                continue;
            }
            if (!Object.keys(signObj).length) {
                //某表内无需要签名字段时，拼接null
                signStr += "null";
            }
            for (let key in signObj) {
                switch (Number(signObj[key])) {
                    case 0:
                        signStr += item["values"][key]
                            ? item["values"][key]["value"] || ""
                            : "";
                        break;
                    case 1:
                        signStr += item["values"][key]
                            ? item["values"][key]["display"] || ""
                            : "";
                        break;
                    case 2:
                        signStr +=
                            item["values"][key] && item["values"][key]["value"]
                                ? (
                                      Number(item["values"][key]["value"]) || 0
                                  ).toFixed(scale.scale)
                                : "";
                        break;
                }
            }
        }
    }
    return {
        signStr,
        encryptkey,
        tablerelation
    };
}

function getSignDetail(encryptVOClassName, div) {
    return new Promise(resolve =>
        ajax({
            type: "post",
            url: "/nccloud/tmpub/pub/qryencryptinfo.do", //添加自己的接口链接
            data: { encryptVOClassName },
            loading: false,
            async: false,
            success: res => {
                if (res.success) {
                    resolve(res.data);
                }
            },
            error: res => {
                div && ReactDOM.unmountComponentAtNode(div);
                toast({ color: "warning", content: res.message });
                resolve({});
            }
        })
    );
}

function getIsca() {
    return new Promise(resolve =>
        ajax({
            type: "post",
            url: "/nccloud/tmpub/pub/iscauser.do",
            loading: false,
            async: false,
            success: res => {
                if (res.success) {
                    resolve(res.data);
                }
            },
            error: res => {
                resolve(false);
            }
        })
    );
}

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/