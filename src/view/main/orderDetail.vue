<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" class="demo-form-inline" label-position="left" label-width="120px">
                   
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="订单号">
                                <el-input v-text="formData.orderNumber"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户">
                                <el-input v-text="formData.memberName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="支付方式">
                                <el-input v-text="formData.payType"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收货人">
                                <el-input v-text="formData.contactName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="电话">
                                <el-input v-text="formData.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收货地址">
                                <el-input v-text="formData.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="总金额(含运费)">
                                <el-input v-text="formData.payPrice * formData.count + formData.freight +'元'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="运费">
                                <el-input v-text="formData.freight + '元'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="金币/丫丫币情况">
                                <el-input v-text="formData.integralCase"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="商品名">
                                <el-input v-text="formData.goodsName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="规格">
                                <el-input v-text="formData.bak1 + formData.bak2 + formData.bak3 + formData.freightNumber "></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数量">
                                <el-input v-text="formData.count"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>    
                        <el-col :span="12">
                            <el-form-item label="小计">
                                <el-input v-text="formData.payPrice + '元'"></el-input>
                            </el-form-item>
                        </el-col>
                    
                        <el-col :span="12">
                            <el-form-item label="配货门店">
                                <el-input v-text="formData.shopName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>    
                        <el-col :span="12">
                            <el-form-item label="商家备注">
                                <el-input v-text="formData.merchantRemark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <hr>
                     <el-steps  direction="vertical" space='150px' :active="(expressDetailArr.length-1)">
                        <el-step v-for="item in expressDetailArr" :title="item.status" :key="item.time" :description="item.status"></el-step>
                    </el-steps>
                    <el-row>
                        <el-form-item label=" ">
                            <div>
                                <el-button type="primary" @click="$back()" size="medium ">关闭</el-button>
                            </div>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            
        </ui-container>
    </ui-layout>
</template>

<script>
import { Loading } from "element-ui";
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "订单详情", to: { name: "orderDetail" } }],
      formData: {},
      expressData:{},
      expressDetailArr:[]
    };
  },
  mounted() {
      this.getOrderDetail();
      this.expressData = this.$route.query;
      if(this.expressData.expressNumber != null && this.expressData.expressNumber != ''){
          this.getExpressDetail();
      }
  },
  methods: {
    getOrderDetail() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$get("orderDetail", this.$route.query.id)
        .then(res => {
          this.formData = res.orders;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    getExpressDetail(){
     let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("expressDetail", {"no":this.expressData.expressNumber,"type":this.expressData.expressName})
        .then(res => {
            if(null != res.result.list && res.result.list.length > 0){
                this.expressDetailArr = res.result.list;
            }
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    }
  }
};
</script>

<style lang="less">
@import "../../style/teaend.less";
</style>