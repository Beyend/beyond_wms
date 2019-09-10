<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="left" label-width="100px">
                   
                    <el-col>
                        <el-row :span="7">
                            <el-form-item label="充值名称">
                                <el-input v-model="formData.name" ></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="支付金额" prop="payMoney" :rules="[{ type: 'number', message: '支付金额必须为数字值'}]">
                                <el-input v-model.number="formData.payMoney" autocomplete="off" type="number">
                                  <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="赠送金额" prop="giveMoney" :rules="[{ type: 'number', message: '赠送金额必须为数字值'}]">
                                <el-input v-model.number="formData.giveMoney" autocomplete="off" type="number">
                                  <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20">
                                    <el-button type="primary" @click="rechargeSchemeSave">确认添加</el-button>
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
      brs: [{ name: "添加充值方案", to: { name: "rechargeSchemeInsert" } }],
      formData: {
        name:null,
        payMoney:null,
        giveMoney:null
      }
    };
  },
  mounted() {
  },
  methods: {
    rechargeSchemeSave() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("rechargeSchemeSave", this.formData)
        .then(res => {
          this.$message({ message: "新增充值方案成功", type: "success", center: true });
          loadingInstance.close();
          this.$to({ name: "rechargeSchemeManager" });
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