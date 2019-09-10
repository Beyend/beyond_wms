/**
 * Created by kuo zi on 2016/10/18.
 */
import Vue from "vue";
import store from "store";

import { fetch, $get, $post } from "../utils/fetch";

import UiLayout from "./../components/UiLayout.vue";
import UiContainer from "./../components/UiContainer.vue";
/**二维码生成插件 */
import QRCode from 'qrcode';
import project from "../../config/project/project.env";




//全局混合
Vue.mixin({
    components: { UiLayout, UiContainer },
    data() {
        return {
            PageSize: 15,
            Store: store,
            FileDown:project.projectConfig['default'].baseURL + "/" + project.projectConfig['default'].rootPath + '/file/download'
        };
    },
    methods: {
        /**
         *get请求
         * @param restKey [项目索引,url键]
         * @param join url拼接
         */
        $get(restKey, join, options, noLoading, noToast) {
            return $get(restKey, join, options, noLoading, noToast, this);
        },
        $viewPictue(options) {
            window.open(this.FileDown + '?name=' + options)
        },
        $getDirect(url, options, noLoading, noToast) {
            return fetch("get", "", url, null, options, noLoading, noToast, this);
        },
        /**
         *post请求
         * @param restKey [项目索引,url键]
         * @param params 请求参数
         */
        $post(restKey, params, join, options, noLoading, noToast) {
            return $post(restKey, params, join, options, noLoading, noToast, this);
        },
        $postDirect(url, params, options, noLoading, noToast) {
            return fetch("post", "", url, params, options, noLoading, noToast, this);
        },
        /**
         * [$back description]返回事件
         * @return {[type]} [description]
         */
        $back() {
            this.$store.commit("transition", false);
            window.history.back("-1");
        },
        $to(p) {
            this.$router.push(p);
        },
        $$loading() {
            this.$store.commit("loading");
        },
        $loaded() {
            this.$store.commit("loaded");
        },
        /**
         * [$encodeURI description] encode url 默认encode当前url
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
        $encodeURI(url) {
            return window.encodeURIComponent(url ? url : window.location);
        },
        /**
         * [$decodeURI description] decode url
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
        $decodeURI(url) {
            return window.decodeURIComponent(url);
        },
        $getParam(key, url) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
            var r = (url ? url : window.location).search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        $getCodeImg(parent,textCode,visibleText){
            let canvasCreate = document.createElement('canvas');
            QRCode.toCanvas(canvasCreate, textCode,(err)=>{
                if(err)console.log(err)
            })
            let imgSrc = canvasCreate.toDataURL("image/png"); 
            let image = new Image();
            image.src = imgSrc;
            image.style = 'width:105px;margin:12px auto;';
            let pCreate = document.createElement('p');
            // pCreate.style = 'font-style:normal;text-align:center;margin-top:-20px;position:relative;color:#979797;transform: scale(0.9);transform-origin:center 0;';
            pCreate.style = 'font-style:normal;text-align:center;margin-top:-15px;position:relative;color:#979797;transform: scale(0.9);transform-origin:center 0;';
            pCreate.innerHTML = visibleText;
            let divCreate = document.createElement('div');
            divCreate.style = 'width: 130px; height: 150px; border: none; margin - bottom: 20px; border - radius: 5px;text-align: center;';
            divCreate.appendChild(image)
            divCreate.appendChild(pCreate)
            parent.appendChild(divCreate)
            // return image
        },
        $notNull(val,frontName){
            if(val == '' || !val){
                return this.$message({type: 'warning', message: frontName + '不能为空'});
            }
        },
        $getYMD(val){
            if(!val){
                return val
            }
            let years = val.getFullYear();
            let Months = (val.getMonth() + 1) < 10 ? '0' + (val.getMonth()+1) : (val.getMonth()+1);
            let days = val.getDate() < 10 ? '0' + val.getDate() : val.getDate();
            return years + '-' + Months + '-' + days;
        },
        
        beforeDestroy() {}
    }
});
