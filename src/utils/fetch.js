import project from "../../config/project/project.env";
import urls from "./../utils/urls";

import axios from "axios";
// axios.defaults.withCredentials = true;
axios.defaults.headers["x-requested-with"] = "XMLHttpRequest";
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

let fetch = function(method, baseURL, url, data, options, noLoading, noToast, vue) {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("$token");
        let o = options || {
            headers: {}
        };
        o.method = method;
        o.baseURL = baseURL;
        o.url = url;
        o.data = data;
        o.headers = o.headers || {};
        o.headers["x-token"] = token;
        if (!noLoading) {
            // vue && vue.$$loading();
        }
        axios(o)
            .then(data => {
                let res = data.data;
                if (!noLoading) {
                    // vue && vue.$loaded();
                }
                if (res.meta.code == 200) {
                    if (res.data === null || res.data === undefined) {
                        resolve({});
                    } else {
                        resolve(res.data);
                    }
                } else {
                    if (res.meta.code == 400 && vue.$route.name != "index") {
                        // vue && vue.$to({ name: "login", query: { path: vue.$route.fullPath }, });
                        vue && vue.$to({ name: "login", query: { path: "main" }, });
                        vue && vue.$message({ message: "请重新登陆", type: "success", center: true });
                    } else {
                        if (!noToast) {
                            vue && vue.$message({
                                    showClose: true,
                                    message: res.meta.msg,
                                    type: "error",
                                    center: true
                                });
                        }
                    }
                    reject();
                }
            })
            .catch(error => {
                if (!noToast) {
                    if (error.response && error.response.status) {
                        switch (error.response.status) {
                            case 404:
                                vue &&
                                    vue.$message.error({
                                        showClose: true,
                                        message: "错误代码404",
                                        type: error,
                                        center: true
                                    });
                                break;
                            case 502:
                                vue &&
                                    vue.$message.error({
                                        showClose: true,
                                        message: "服务器正在升级,请稍后再试",
                                        type: error,
                                        center: true
                                    });
                                break;
                            case 504:
                                vue &&
                                    vue.$message.error({
                                        showClose: true,
                                        message: "网络已断开",
                                        type: error,
                                        center: true
                                    });
                                break;
                            default:
                                vue &&
                                    vue.$message.error({
                                        showClose: true,
                                        message: `请求服务异常,请稍后再试（${error.response.status}）`,
                                        type: error,
                                        center: true
                                    });
                                break;
                        }
                    }
                }
                if (!noLoading) {
                    // vue && vue.$loaded();
                }
                reject();
            });
    });
};

let $get = function(restKey, join, options, noLoading, noToast, vue) {
    if (typeof restKey === "string") {
        restKey = ["default", restKey];
    }
    return fetch("get", project.projectConfig[restKey[0]].baseURL + "/" + project.projectConfig[restKey[0]].rootPath, join ? urls[restKey[1]].url + "/" + join : urls[restKey[1]].url, null, options, noLoading, noToast, vue);
};

let $post = function(restKey, params, join, options, noLoading, noToast, vue) {
    if (typeof restKey === "string") {
        restKey = ["default", restKey];
    }
    return fetch("post", project.projectConfig[restKey[0]].baseURL + "/" + project.projectConfig[restKey[0]].rootPath, join ? urls[restKey[1]].url + "/" + join : urls[restKey[1]].url, params, options, noLoading, noToast, vue);
};
export { fetch, $get, $post };
