<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="right" label-width="100px">
                   
                    <el-col>
                        <el-row :span="7">
                            <el-form-item label="姓名">
                                <el-input v-model="formData.name" disabled=""></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="手机号">
                                <el-input v-model="formData.phone" clearable>
                                    <el-button slot="append" style="color: #fff; background-color: #99B9F3; border-color: #99B9F3;"  @click="chechName">检测</el-button>
                                </el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="充值金额" prop="money" :rules="[{ type: 'number', message: '充值金额必须为数字值'}]">
                                <el-input v-model.number="formData.money" autocomplete="off" type="number" clearable>
                                  <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="充值时间" prop="startTime">
                                <el-date-picker
                                    v-model="formData.startTime"
                                    type="date"
                                    placeholder="选择日期"
                                    style="width:200px;">
                                </el-date-picker>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                                <el-form-item label="备注">
                                    <el-input v-model="formData.remark" type="textarea" :rows="5" style="width:300px;" clearable></el-input>
                                </el-form-item>
                            </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20">
                                    <el-button type="primary" @click="autoRechargeSave" v-if="checkStatus">确认添加</el-button>
                                    <el-button type="primary" @click="$back()">关闭</el-button>
                                </div>
                            </el-form-item>
                        </el-row>
                    </el-col>
                </el-form>
            </el-row>
        </ui-container>
    </ui-layout>
</template>

<script>
import { Loading } from "element-ui";
import Citys from "../../utils/citys.js";
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "添加自动充值", to: { name: "autoRechargeInsert" } }],
      formData: {
        name:null,
        phone:null,
        money:null,
        startTime:null,
        remark:null
      },
      form:{
          bindingPhone:null
      },
      checkStatus:false
    };
  },
  mounted() {
  },
  methods: {
    chechName(){
        this.form.bindingPhone = this.formData.phone;
      if (this.formData.phone) {
                this.$post("memberCheck",this.form).then((res) => {
                    if(res != null){
                        this.$message({
                            center:true,
                            message: '存在此用户',
                            type: 'success',
                            center:true
                          });
                        this.checkStatus = true;
                        this.formData.name = res.nickName;  
                    }
              })
            }else{
                this.checkStatus = false;
                this.$message({
                    center:true,
                    message: '请输入手机号',
                    type: 'warning'
                 });
            }
    },  
    autoRechargeSave() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("autoRechargeSave", this.formData)
        .then(res => {
          this.$message({ message: "新增自动充值成功", type: "success", center: true });
          loadingInstance.close();
          this.$to({ name: "autoRechargeManager" });
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
  }
};
</script>

<style lang="less">
@import "../../style/teaend.less";
.imgcontainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    text-align: center;
    > p {
      margin-bottom: 20px;
      position: relative;
      .imgUpload {
        width: 152px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 74px;
        opacity: 0;
        z-index: 10;
        cursor: pointer;
      }
    }
    > div {
      border: 1px solid #999;
      padding: 10px;
      width: 300px;
      height: 300px;
      > img {
        max-width: 280px;
        max-height: 280px;
      }
    }
  }
}
</style>