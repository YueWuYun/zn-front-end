function init () {
	if(hasInited){
		return hasInited;
	}
  	var config = {"license" : license,
			      "certDateFmtMode":true,
				  "disableExeUrl":true};
  	try{
   		 TCA.config(config);
   		 hasInited = true;
   		 return hasInited;
  	}catch(e){
		// 16777220 "控件未安装" ;2952790019 "查询服务版本失败" ;
		// 4026531843 IE下"不匹配的CertKit版本"
  		if (e instanceof TCACErr && (e.number=="16777220"||e.number=="2952790019"||e.number=="4026531843")) {
  			window.location.href=exepath;
  			throw new Error("请安装下载的证书助手，刷新登录页面后重试。");
  		}	
  		if(e instanceof TCACErr){
			throw new Error("控件未知异常，请联系CA厂商。");
    	}
		console.log("初始化未知异常，请联系CA厂商。"+e.message);
  		throw new Error("初始化未知异常，请联系CA厂商。");
  	}
}

function initSoftCertList(){
	try{
		var keystore = CertStore.byName(softProv);
		var certs = keystore.listCerts();
		if(certs.size()>0){
			for(var i = 0;i<certs.size();i++){
				var cert = certs.get(i);
				var uid = getUIDFromSubject(cert);
				if(typeof(uid)!="undefined"&&uid!=""){
					softCertMap.set(uid,cert);
				}
			}
		}
	} catch (e) {
		throw e;
	}
}


function initUsbKeyCertList(){
	try{
		var keystore = CertStore.byName(csp);
		if(keystore==null){
			// throw 指定的驱动未安装
			throw new Error("指定的驱动未安装。");
		}
		var certs = keystore.listCerts();
		if(certs.size()>0){
			for(var i = 0;i<certs.size();i++){
				var cert = certs.get(i);
				var uid = getUIDFromSubject(cert);
				if(typeof(uid)!="undefined"&&uid!=""){
					map.set(uid,cert);
				}
			}
		}else{
			// throw 未插key或key内无证书
			throw new Error("没有插入key，或key内无证书。");
		}
	} catch (e) {
		throw e;
	}
}

// 返回Certificate对象
function getCertByUID(uid,enrollCertAble) {
  try {
	  var cer = isSoft?softCertMap.get(uid):map.get(uid);
	  if(cer==undefined){
		  if(isSoft){
			  if(enrollCertAble){
				  console.log("正在为用户"+uid+"安装软证书.")
				  genCSRWithRSASoftProv(uid,uid);
				  softCertMap = new Map();
				  initSoftCertList();
				  cer = softCertMap.get(uid);
			  }else{
				  //
				  if(logLevel)
					  console.log("请先执行getCertSN()！")
				  throw new Error("用户未安装软证书 。");
			  }
		  }else{
			  // throw 用户与证书不匹配
			  throw new Error("用户与证书不匹配。");
		  }
		  
	  }
	  return cer;
  } catch (e) {
	  throw e;
  }
}

// 从Certificate对象中获取UID
// cert : Certificate对象
function getUIDFromSubject(cert) {
  try {
    var t = cert.subject().replace(/\x00/g,"").match(/(S(?!N)|L|O(?!U)|OU|SN|CN|E)=([^=]+)(?=, |$)/g);
    for (var i = 0; i < t.length; i++) {
      if (t[i].indexOf("OU=UID:") === 0)
        return t[i].substr(7, t[i].length);
      }
      return null;
  } catch (e) {
	  return e;
  }
}

// get cert serialnumber *1
function getCertSN(uid,flag){
	init ();
	isSoft = eval(flag);
	if(isSoft){
		initSoftCertList();
	} else {
		initUsbKeyCertList();
	}	
	var cert = getCertByUID(uid,true);
	return cert.serialNumber();		
}	

// 签名方法 *2
function signMessage(toSign, uid, flag) {
	init();
	var P1;
	try {
		
		var cert = getCertByUID(uid,false);
		if(isSoft){
			// CSP "Microsoft Enhanced Cryptographic Provider v1.0"
			// 不支持SHA256，服务端CA接口做摘要算法兼容
			P1 = cert.signMessageRaw(toSign);
			return P1;
		}
		if (!isSoft && flag) {
			cert.clearPinCache();
		}
		if(cert.publicKeyAlg() == TCA.SM2){
			P1 = cert.signMessageRaw(toSign);
		}else{
			P1 = cert.signMessageRaw(toSign, TCA.SHA256);
		}

		return P1;
	} catch (e) {
		if (e instanceof TCACErr && e.number == "2684354561") {
			// throw key被拔出、用户取消操作
			throw new Error("key被拔出，或用户取消操作。");
		} else if (e instanceof TCACErr) {
			// throw 控件未知异常，请联系CA厂商
			throw new Error("控件未知异常，请联系CA厂商。");
		} else {
			console.log("初始化未知异常，请联系CA厂商。"+e.message);
	  		throw new Error("签名未知异常，请联系CA厂商。");
		}
	}
}
	

// 申请安装软证书*
function genCSRWithRSASoftProv(UserName, uid, UserEmail) {
	try {
		if (typeof (uid) == "undefined") {
			throw new Errow("用户登录名能为空，无法申请证书。");
		}
		if (typeof (UserEmail) == "undefined") {
			UserEmail = "";
		}
		if (typeof (UserName) == "undefined") {
			UserName = uid;
		}
		var certStore = CertStore.byName(softProv);
		var csr = certStore.genCsr(TCA.RSA2048).toBase64();
		var tse = {};
		tse.UserName = UserName;
		tse.UserUID = uid;
		tse.UserEmail = UserEmail;
		tse.txtCSR = encodeURIComponent(csr);// 处理base64的+传输问题
		getCertSignBuf(tse);
	} catch (e) {
		if (e instanceof TCACErr) {
			if(logLevel)
				console.log("证书申请错误:"+e.message);
			throw new Error("证书申请异常，请联系CA厂商");
		} else {
			if(logLevel)
				console.log("证书申请未知错误:"+e.message);
			throw new Error("证书申请未知异常，请联系CA厂商");
		}
	}
}


function getCertSignBuf (tse) {
	// 将json数据转成post字符串
	tse = (function(value){
		var oStr = "";
	　　for(var key in value){
	　　　　oStr += key+"="+value[key]+"&";
	　　};
	　　return oStr;
	}(tse));
    // 声明一个异步请求对象
    var xmlHttpReg  = window.XMLHttpRequest ? new XMLHttpRequest() : 
    	window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null;
    if (xmlHttpReg != null) {
        xmlHttpReg.open("post", enrollCerURL, false);
        xmlHttpReg.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded" );
        xmlHttpReg.send(tse);
        // 同步调用
        if(xmlHttpReg.readyState==4){
        	doResult(xmlHttpReg);
        }
    } else {
    	// XMLHttpRequest 实例化失败
    	if(logLevel)
    		console.log("XMLHttpRequest 实例化失败");
    	throw new Error("不支持的浏览器。");
    }
  
}
// 设定函数doResult()
function doResult(xmlHttpReg) {
	var flag = (xmlHttpReg.readyState == 4);
    if (xmlHttpReg.readyState == 4 && xmlHttpReg.status == 200) {// 4代表执行完成&&200代表执行成功
        data =  JSON.parse(xmlHttpReg.responseText);// xmlHttpReg.responseText;
        try{
        	if (data.IsOK) {
       			CertStore.installCert(data.certSignBufP7);
       			console.log("证书安装成功....");
       		} else {
       			console.log("data.IsOK:"+data.IsOK);
       			throw new Error("通信安全证书申请失败。");
       		}
        	
       	} catch (e) {
      		if (e instanceof TCACErr) {
      			if(logLevel)
      				console.log("证书安装失败！")
       			throw e;
       		}
       	}
    } else {
    	// 证书申请失败
    	if(flag){
    		console.log("安装失败！~");
        	throw new Error("证书安装失败！");
    	}
    }
}
