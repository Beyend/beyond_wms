<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" class="demo-form-inline" ref="formData" label-position="right" label-width="150px">
                    <el-col>
                        <el-row>
                            <el-form-item label="优惠券名称" prop="name">
                                <el-input v-text="formData.name"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="最低消费金额(元)" prop="mininumConsume">
                                <el-input v-text="formData.mininumConsume"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="优惠金额(元)" prop="couponMoney">
                                <el-input v-text="formData.couponMoney"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="剩余数量" prop="remain">
                                <el-input v-text="formData.remain"></el-input>
                            </el-form-item>
                        </el-row>
                        <span v-if="formData.timeLimit != null">
                            <el-row>
                                <el-form-item label="优惠券有效期" prop="timeLimit">
                                    <el-input v-text="formData.timeLimit"></el-input>
                                </el-form-item>
                            </el-row>
                        </span>
                        <span v-if="formData.startTime != null && formData.endTime != null">
                            <el-row>
                                <el-form-item label="优惠券有效期">
                                    <span>{{formData.startTime | dateFmt('yyyy-MM-dd')}} ~ {{formData.endTime | dateFmt('yyyy-MM-dd')}}</span>
                                </el-form-item>
                            </el-row>
                        </span>
                        <el-row>
                            <el-form-item label="发放对象">
                                  <el-button type="text" @click="dialogTableVisible = true">查找用户</el-button>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    
                    <el-dialog  title="查找用户"  style="width:50%;margin-left:500px;" :visible.sync="dialogTableVisible">
                                <span>
                                    <el-form :inline="true" :model="queryMemberMap" ref="queryMemberMap"  class="demo-form-inline"  >
                                        <el-col>
                                            <el-row>
                                                <el-col>
                                                    <el-form-item label="">
                                                        <el-form-item label="">
                                                            <el-input v-model="queryMemberMap.keyWord" placeholder="请输入用户名查找" clearable >
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form-item>
                                                    <el-button type="primary" @click="getMemberUser">
                                                                <i class="el-icon-search"></i>
                                                                <span>查询</span>
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <el-table :data="tableData" border style="width:300px;" height="300" @selection-change="handleSelectionChange">
                                        <el-table-column type="selection" width="55"></el-table-column>
                                        <el-table-column prop="name"  style="width:300px;" align="center"></el-table-column>
                                </el-table>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="getConfirm">确 定</el-button>
                                </span>
                         </el-dialog>

                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20 marginleft150px">
                                    <el-button type="primary" @click="$back(-1)">关闭</el-button>
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
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "优惠券发放", to: { name: "couponDetail" } }],
      //查询会员
      queryMemberMap: {
        pageNo: 1,
        pageSize: 10000,
        keyWord: "",
        memberTypeId: 0
      },
      formData: {
        name: null,
        mininumConsume: null,
        couponMoney: null,
        remain: null,
        timeLimit: null,
        startTime: null,
        endTime: null
      },
      //会员
      tableData: [],
      dialogTableVisible: false,
      relevanceData: {
        couponId: null,
        relevanceList: []
      }
      //选中发放的用户
    };
  },
  mounted() {
    this.getCouponDetail();
    this.getMemberUser();
  },
  methods: {
    //优惠券批量发放
    getConfirm() {
      this.dialogTableVisible = false;
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("couponLotSet", this.relevanceData)
        .then(res => {
          this.$message({
            showClose: true,
            message: "优惠券发放成功",
            type: "success",
            center: true
          });
          this.$to({ name: "couponManager" });
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //商品类勾选多行
    handleSelectionChange(val) {
      this.relevanceData.relevanceList = val;
    },
    getCouponDetail() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$get("couponDetail", this.$route.query.id)
        .then(res => {
          this.relevanceData.couponId = res.coupon.id;
          this.formData = res.coupon;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //会员类型列表
    getMemberUser() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("memberList", this.queryMemberMap)
        .then(res => {
          this.tableData = res.list;
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