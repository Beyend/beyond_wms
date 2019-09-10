<template>
    <ui-container style="padding:0;">
        <div class="homeBg">
            <div class="personalInfo">
                <p class="personalName" style="font-size:20px;color:#636c72;" v-text="'你好, ' + userName"></p>
                <p class="personalName" style="font-size:20px;color:#636c72;">海阔凭鱼跃,天高任鸟飞</p>
            </div>
        </div>
    </ui-container>
</template>

<script>
import UiPage from "../../components/UiPage.vue";
import { Loading } from 'element-ui';
export default {
    components: { UiPage, Loading },
    data() {
        return {
            value:null,
            formInline: {
                user: "",
                date: ""
            },
            userName:null,
            tableData: []
        };
    },
    mounted(){
        this.userName = localStorage.getItem('name');
    },
};
</script>

<style lang="less">
@import '../../style/teaend.less';
.noPadding{
    padding: 0;
}
.homeBg{
    width:100%;
    height: 100%;
    background: #fff;
    .personalInfo{
        color: #000;
        padding-top: 200px;
        text-align: center;
        font-size: 24px;
        line-height: 60px;
    }
}
    
</style>