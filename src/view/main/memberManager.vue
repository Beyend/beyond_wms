<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="queryMap" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item label="">
                                <el-select filterable v-model="queryMap.memberTypeId" placeholder="全部会员">
                                    <el-option label="全部会员" :value=0></el-option>
                                     <el-option
                                        v-for="item in memberTypeArr"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" >
                            <el-form-item label="" v-if="this.userName == 'admin'">
                                <el-select filterable v-model="queryMap.shopId" placeholder="全部门店">
                                    <el-option label="全部门店" :value=0></el-option>
                                     <el-option
                                        v-for="item in shopArr"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item label="">
                                <el-input v-model="queryMap.keyWord" placeholder="手机号或联系方式或昵称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label=" ">
                                <el-button type="primary" @click="getTableData">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button type="primary" @click="getExport">
                                    <i class="el-icon-download"></i>
                                    <span>导出列表</span>
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="width: 80%">
                        <el-table-column prop="id" label="ID" align="center"></el-table-column>
                        <el-table-column prop="nickName" label="昵称" align="center" width="100"></el-table-column>
                        <!-- <el-table-column prop="openId" label="OpnenID" align="center" width="260"></el-table-column> -->
                        <el-table-column prop="shopName" label="所属门店" align="center" width="180"></el-table-column>
                        <el-table-column prop="bindingPhone" label="手机号" align="center" width="100"></el-table-column>
                        <!-- <el-table-column prop="contactInformation" label="联系方式" align="center" width="100"></el-table-column> -->
                        <el-table-column prop="integral" label="金币" align="center"></el-table-column>
                        <el-table-column prop="goldCoin" label="丫丫币" align="center"></el-table-column>
                        <el-table-column prop="remark" label="备注" align="center" width="200"></el-table-column>
                        <el-table-column prop="createTime" label="加入时间" align="center" width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime | dateFmt('yyyy-MM-dd')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  label="身份" prop="memberType" align="center"></el-table-column>
                        <el-table-column prop="oorderNumber" label="订单数" align="center"></el-table-column>
                        <el-table-column prop="couponNumber" label="优惠券数量" align="center" width="120"></el-table-column>
                        <!-- <el-table-column prop="cardNumber" label="卡券数量" align="center"></el-table-column> -->
                        
                        <!-- <el-table-column prop="balance" label="当前余额" align="center"></el-table-column> -->
                        <el-table-column label="操作" width="300" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="toDetail(scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="toIntegral(scope.row)">充值金币</el-button>
                                <!-- <el-button type="text" size="small" @click="toMoney(scope.row)">充值余额</el-button> -->
                                <el-button type="text" size="small" @click="toGold(scope.row)">充值丫丫币</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <el-dialog  title="金币操作" :visible.sync="dialogVisibleIntegral" width="20%" :before-close="closeIntegral">
                                <span>
                                    <el-form :inline="true" :model="integralMap" ref="integralMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <el-col>
                                            <el-row>
                                                <el-form-item label="">
                                                        <template>
                                                            <!-- 判断是不是有充值积分权限 v-if="isrechargeBalance" -->
                                                            <el-radio v-model="integralMap.type" label="1" >充值</el-radio>
                                                            <el-radio v-if="this.isIntegralDeduct" v-model="integralMap.type" label="3">扣除</el-radio>
                                                        </template>
                                                </el-form-item>
                                                <el-form-item label="金币" v-if="integralMap.type == 3">
                                                    <el-input v-model.number="integralMap.integral" autocomplete="off" type="number"></el-input>
                                                </el-form-item>
                                                <el-form-item label="金币卡号" v-if="integralMap.type == 1">
                                                    <el-input v-model="integralMap.cardNumber" ></el-input>
                                                </el-form-item>
                                                <el-form-item label="金币卡密码" v-if="integralMap.type == 1">
                                                    <el-input v-model="integralMap.password"></el-input>
                                                </el-form-item>
                                                <el-form-item label="备注">
                                                        <div >
                                                            <el-input v-model="integralMap.remark" autocomplete="off" style="width:300px;"  type="textarea" :rows="3"></el-input>
                                                        </div>
                                                </el-form-item>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="integralConfirm">确 定</el-button>
                                </span>
                </el-dialog>

                <el-dialog  title="丫丫币操作" :visible.sync="dialogVisibleGold" width="20%" :before-close="closeGold">
                                <span>
                                    <el-form :inline="true" :model="goldMap" ref="goldMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <el-col>
                                            <el-row>
                                                <el-form-item label="">
                                                        <template>
                                                            <!-- 判断是不是有充值积分权限 v-if="isrechargeBalance" -->
                                                            <el-radio v-model="goldMap.type" label="1" >充值</el-radio>
                                                            <el-radio v-if="this.isgoldDeduct" v-model="goldMap.type" label="3">扣除</el-radio>
                                                        </template>
                                                </el-form-item>
                                                <el-form-item label="丫丫币" v-if="goldMap.type == 3">
                                                    <el-input v-model.number="goldMap.integral" autocomplete="off" type="number"></el-input>
                                                </el-form-item>
                                                <el-form-item label="丫丫币卡号" v-if="goldMap.type == 1">
                                                    <el-input v-model="goldMap.cardNumber" ></el-input>
                                                </el-form-item>
                                                <el-form-item label="丫丫币卡密码" v-if="goldMap.type == 1">
                                                    <el-input v-model="goldMap.password"></el-input>
                                                </el-form-item>
                                                <el-form-item label="备注">
                                                        <div >
                                                            <el-input v-model="goldMap.remark" autocomplete="off" style="width:300px;"  type="textarea" :rows="3"></el-input>
                                                        </div>
                                                </el-form-item>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="goldConfirm">确 定</el-button>
                                </span>
                </el-dialog>

                <el-dialog  title="余额操作" :visible.sync="dialogVisibleMoney" width="20%" >
                                <span>
                                    <el-form :inline="true" :model="moneyMap" ref="moneyMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <el-col>
                                            <el-row>
                                                <el-form-item label="">
                                                        <template>
                                                            <el-radio v-model="moneyMap.type" label="2" v-if="isrechargeBalance" >充值</el-radio>
                                                            <el-radio v-model="moneyMap.type" label="4">扣除</el-radio>
                                                        </template>
                                                </el-form-item>
                                                <el-form-item label="余额">
                                                    <el-input v-model.number="moneyMap.payMoney" autocomplete="off" type="number"></el-input>
                                                </el-form-item>
                                                <el-form-item label="备注">
                                                        <div >
                                                            <el-input v-model="moneyMap.remark" autocomplete="off" style="width:300px;"  type="textarea" :rows="3"></el-input>
                                                        </div>
                                                </el-form-item>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="moneyConfirm">确 定</el-button>
                                </span>
                </el-dialog>

            <el-row>
                <ui-page :total="total" :pageNo="queryMap.pageNo" :pageSize="10" @size-change="handleSizeChange" @current-change="handleCurrentChange"></ui-page>
            </el-row>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiPage from "../../components/UiPage.vue";
import { Loading } from "element-ui";
import { exportExcel } from "../../../config/project/project.env";
export default {
  components: { UiPage, Loading },
  data() {
    return {
      exportExcel:exportExcel,
      brs: [{ name: "会员管理", to: { name: "memberManager" } }],
      total: 100,
      queryMap: {
        pageNo: 1,
        pageSize: 10,
        keyWord: "",
        memberTypeId: 0,
        shopId:0
      },
      //查询会员类型
      queryMemberTypeMap: {
        pageNo: 1,
        pageSize: 1000
      },
      tableData: [],
      //会员类型
      memberTypeArr: [],
      //门店列表
      shopArr:[],
      //积分参数
      integralMap: {
        memberId: null,
        type: null,
        remark: null,
        integral: null,
        cardNumber:null,
        password:null
      },
      //余额参数
      moneyMap: {
        memberId: null,
        type: null,
        remark: null,
        payMoney: null,
        money: null
      },
      //丫丫币参数
      goldMap: {
        memberId: null,
        type: null,
        remark: null,
        gold: null,
        cardNumber:null,
        password:null
      },
      dialogVisibleIntegral: false,
      dialogVisibleMoney: false,
      dialogVisibleGold:false,
      //权限集合
      arrs:[],
      //积分充值权限
      isrechargeIntegral:false,
      //余额充值权限
      isrechargeBalance:false,  
      //积分扣除权限
      isIntegralDeduct:false,
      //丫丫币扣除权限
      isgoldDeduct:false,
      //从session取用户名
      userName:""
    };
  },
  created(){
    this.$route.query.pageNo ? this.queryMap.pageNo = parseInt(this.$route.query.pageNo) : 1
    this.getMemberTypeList();
    this.getTableData();
    this.getShopTypeList();
    this.arrs = sessionStorage.getItem("privileges");
    this.userName = sessionStorage.getItem("name");
    this.isrechargeIntegrals();
    this.isrechargeBalances();
    this.isIntegralDeducts();
    this.isgoldDeducts();
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    //积分操作对话框关闭
    closeIntegral(done){
        this.integralMap.memberId = null;
        this.integralMap.type = null;
        this.integralMap.remark = null;
        this.integralMap.integral = null;
        this.integralMap.cardNumber = null;
        this.integralMap.password = null;
        done();
    },
    //丫丫币操作对话框关闭
    closeGold(done){
        this.goldMap.memberId = null;
        this.goldMap.type = null;
        this.goldMap.remark = null;
        this.goldMap.gold = null;
        this.goldMap.cardNumber = null;
        this.goldMap.password = null;
        done();
    },
    //积分扣除
    isIntegralDeducts(){
        if(this.arrs.indexOf("integral_deduct") == -1){
          this.isIntegralDeduct = false;
      }else{
          this.isIntegralDeduct = true;
      }
    },
    //丫丫币扣除
    isgoldDeducts(){
      if(this.arrs.indexOf("gold_deduct") == -1){
          this.isgoldDeduct = false;
      }else{
          this.isgoldDeduct = true;
      }
    },
      //积分充值
    isrechargeIntegrals() {
      if(this.arrs.indexOf("recharge_integral") == -1){
          this.isrechargeIntegral = false;
      }else{
          this.isrechargeIntegral = true;
      }
    },
    //余额充值
    isrechargeBalances() {
      if(this.arrs.indexOf("recharge_balance") == -1){
          this.isrechargeBalance = false;
      }else{
          this.isrechargeBalance = true;
      }
    },
    //导出excel
    getExport(){
            var params = "?keyWord="+this.queryMap.keyWord+"&&memberTypeId="+this.queryMap.memberTypeId+"";
            window.open(exportExcel+"/taoyy/member/export"+params+""); 
            this.getTableData;
    },  
    //确定充值余额触发
    moneyConfirm() {
      var operation = "";
      if (this.moneyMap.type == 2) {
        operation = "充值";
      }
      if (this.moneyMap.type == 4) {
        operation = "扣除";
        this.moneyMap.money = this.moneyMap.payMoney;
        this.moneyMap.payMoney = null;
      }
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("rechargeRecordSave", this.moneyMap)
        .then(res => {
          this.dialogVisibleMoney = false;
          this.$message({
            showClose: true,
            message: "余额" + operation + "成功",
            type: "success",
            center: true
          });
          this.moneyMap.memberId = null;
          this.moneyMap.type = null;
          this.moneyMap.remark = null;
          this.moneyMap.money = null;
          this.moneyMap.payMoney = null;
          operation = "";
          loadingInstance.close();
          this.getTableData();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //确定充值积分触发
    integralConfirm() {
        var operation = "";
      if (this.integralMap.type == 1) {
        operation = "充值";
      }
      if (this.integralMap.type == 3) {
        operation = "扣除";
      }
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("rechargeRecordSave", this.integralMap)
        .then(res => {
          this.dialogVisibleIntegral = false;
          this.$message({
            showClose: true,
            message: "金币" + operation + "成功",
            type: "success",
            center: true
          });
          this.integralMap.memberId = null;
          this.integralMap.type = null;
          this.integralMap.remark = null;
          this.integralMap.integral = null;
          this.integralMap.cardNumber = null;
          this.integralMap.password = null;
          operation = "";
          loadingInstance.close();
          this.getTableData();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //确定充值丫丫币触发
    goldConfirm() {
        var operation = "";
      if (this.goldMap.type = 1) {
        operation = "充值";
      }
      if (this.goldMap.type = 3) {
        operation = "扣除";
      }
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("goldRecordSave", this.goldMap)
        .then(res => {
          this.dialogVisibleGold = false;
          this.$message({
            showClose: true,
            message: "丫丫币" + operation + "成功",
            type: "success",
            center: true
          });
          this.goldMap.memberId = null;
          this.goldMap.type = null;
          this.goldMap.remark = null;
          this.goldMap.gold = null;
          this.goldMap.cardNumber = null;
          this.goldMap.password = null;
          this.goldMap.integral = null;
          operation = "";
          loadingInstance.close();
          this.getTableData();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //充值积分触发
    toIntegral(val) {
      this.integralMap.memberId = val.id;
      this.dialogVisibleIntegral = true;
    },
    //充值余额触发
    toMoney(val) {
      this.moneyMap.memberId = val.id;
      this.dialogVisibleMoney = true;
    },
    //充值丫丫币触发
    toGold(val) {
      this.goldMap.memberId = val.id;
      this.dialogVisibleGold = true;
    },
    toDetail(row) {
    //   this.$to({ name: "memberDetail", query: row });
    this.$to({ name: "memberDetail", query: {row:row,pageNo:this.queryMap.pageNo} });
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("memberList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //会员类型列表
    getMemberTypeList() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("memberTypeList", this.queryMemberTypeMap)
        .then(res => {
          this.memberTypeArr = res.list;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //门店列表
    getShopTypeList() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("shopNoPageList")
        .then(res => {
          this.shopArr = res;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    handleSizeChange(val) {
      this.queryMap.pageNo = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.queryMap.pageNo = val;
      this.getTableData();
    }
  }
};
</script>

<style>
@import "../../style/teaend.less";
</style>