<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="queryMap" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item label="">
                                <el-input v-model="queryMap.name" placeholder="请输入商户名" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label=" ">
                                <el-button type="primary" @click="getTableData">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button type="primary" @click="toinsert">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>新增</span>
                                </el-button>
                                <!-- <el-button type="primary" @click="getExport">
                                    <i class="el-icon-download"></i>
                                    <span>导出列表</span>
                                </el-button> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="width: 80%">
                        <el-table-column prop="id" label="ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="店铺名称" align="center" width="260"></el-table-column>
                        <el-table-column prop="imgSrc" label="店铺图片"  align="center" width="160">
                            <template slot-scope="scope">
                                <img v-if="scope.row.imgSrc" :src="scope.row.imgSrc" style="width:40px;height:40px;">
                            </template>
                        </el-table-column>
                        <el-table-column prop="master" label="店主名" align="center" width="120"></el-table-column>
                        <el-table-column prop="merchantQq" label="店铺QQ" align="center" width="100"></el-table-column>
                        <el-table-column prop="serviceQq" label="客服QQ" align="center" width="100"></el-table-column>
                        <el-table-column prop="serviceWx" label="客服微信" align="center" width="150"></el-table-column>
                        <el-table-column prop="createTime" label="加入时间" align="center" width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime | dateFmt('yyyy-MM-dd')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="telephone" label="客服电话" align="center" width="150"></el-table-column>
                        <el-table-column prop="email" label="邮箱" align="center" width="150"></el-table-column>
                        <el-table-column prop="account" label="收款账号" align="center" width="150"></el-table-column>
                        <el-table-column prop="balance" label="余额" align="center" width="150"></el-table-column>
                        <el-table-column prop="contactInformation" label="联系方式" align="center" width="150"></el-table-column>
                        <el-table-column label="操作" width="150" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="toDetail(scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="toMoney(scope.row)" v-if="isrechargeBalance">充值余额</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <el-dialog  title="充值余额" :visible.sync="dialogVisibleBalance" width="20%" >
                                <span>
                                    <el-form :inline="true" :model="moneyMap" ref="moneyMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <el-col>
                                            <el-row>
                                                <el-form-item label="余额">
                                                    <el-input v-model.number="moneyMap.balance" autocomplete="off" type="number"></el-input>
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
                <ui-page :total="total" :pageSize="10" @size-change="handleSizeChange" @current-change="handleCurrentChange"></ui-page>
            </el-row>

        </ui-container>
    </ui-layout>
</template>

<script>
import UiPage from "../../components/UiPage.vue";
import { Loading } from "element-ui";
import { viewImg } from "../../../config/project/project.env"; //图片预览
export default {
  components: { UiPage, Loading },
  data() {
    return {
      brs: [{ name: "商户管理", to: { name: "merchantManager" } }],
      total: null,
      queryMap: {
        pageNo: 1,
        pageSize: 10,
        name: "",
      },
      tableData: [],
      viewImg:viewImg,
      moneyMap:{
        id:null,
        balance:null  
      },
      dialogVisibleBalance:false,
      isrechargeBalance:false,
      //权限集合
      arrs:[],
    };
  },
  mounted() {
    this.getTableData();
    this.arrs = sessionStorage.getItem("privileges");
    this.isrechargeBalances();
  },
  methods: {
    isrechargeBalances() {
        if(this.arrs.indexOf("recharge_balance") == -1){
            console.log("1")
            this.isrechargeBalance = false;
        }else{
            this.isrechargeBalance = true;
            console.log("2")
        }
    },
    //充值积分触发
    toMoney(val) {
      this.moneyMap.id = val.id;
      this.dialogVisibleBalance = true;
    },
    //确定充值余额触发
    moneyConfirm() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("merchantSave", this.moneyMap)
        .then(res => {
          this.dialogVisibleBalance = false;
          this.$message({
            showClose: true,
            message: "余额充值成功",
            type: "success",
            center: true
          });
          this.moneyMap.id = null;
          this.moneyMap.balance = null;
          loadingInstance.close();
          this.getTableData();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //导出excel
    // getExport(){
    //         var params = "?keyWord="+this.queryMap.keyWord+"&&memberTypeId="+this.queryMap.memberTypeId+"";
    //         window.open("http://localhost:8080/taoyy/member/export"+params+""); 
    //         this.getTableData;
    // },  
    toDetail(row) {
      this.$to({ name: "merchantEdit", query: row });
    },
    toinsert(){
      this.$to({ name: "merchantDetail"});  
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("merchantList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
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