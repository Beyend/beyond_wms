<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row >
                            <el-form-item >
                                  <el-select filterable v-model="queryMap.status"  style="width:120px;" @change="getTableData">
                                      <el-option label="全部充值卡" value=""></el-option>
                                      <el-option label="已使用" value="Y"></el-option>
                                      <el-option label="未使用" value="N"></el-option>
                                  </el-select>
                            </el-form-item>
                            <el-form-item >
                                <el-select filterable v-model="lotSetMap.operation"  style="width:200px;" >
                                    <el-option label="批量设置" value="all" @click.native="lotSetChange"></el-option>
                                    <el-option label="批量删除" value="deletedY" @click.native="lotSetChange"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label=" ">
                                <el-button type="primary" @click="setRechargeCard">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>生成金币卡</span>
                                </el-button>
                            </el-form-item>
                            <el-form-item label=" ">
                                <el-button type="primary" @click="getExport">
                                    <i class="el-icon-download"></i>
                                    <span>导出列表</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-table :data="tableData" border style="width:80%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="100px;" align="center"></el-table-column>
                <el-table-column prop="cardNumber" label="卡号" align="center"></el-table-column>
                <el-table-column prop="password" label="密码" width="100px;" align="center"></el-table-column>
                <el-table-column prop="integral" label="充值金币" width="100px;" align="center"></el-table-column>
                <el-table-column prop="status" label="状态"  align="center">
                    <template slot-scope="scope" >
                        <span v-if="scope.row.status == 'Y'" v-text="'已使用'"></span>
                        <span v-if="scope.row.status == 'N'" v-text="'未使用'"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="使用时间" width="150" align="center">
                    <template slot-scope="scope" v-if="scope.row.updateTime != null">
                        <span>{{scope.row.updateTime | dateFmt('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button @click="toDeleted(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog  title="设置金币卡" :visible.sync="dialogVisible" width="20%">
                                <span>
                                    <el-form :inline="true" :model="formData" ref="formData"  class="demo-form-inline" label-position="left" >
                                              <el-form-item label="张数" prop="count" :rules="[{ type: 'number', message: '金币卡张数必须为数字值'}]">
                                                  <el-input placeholder="请输入金币卡张数"  v-model.number="formData.count" autocomplete="off" type="number"></el-input>
                                              </el-form-item>
                                              <el-form-item label="额度">
                                                  <el-input placeholder="请输入金币卡额度" v-model="formData.integral"></el-input>
                                              </el-form-item>
                                    </el-form>
                                    
                                </span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="toAddRechargeCard">确 定</el-button>
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
import { exportExcel } from "../../../config/project/project.env";
export default {
  components: { UiPage, Loading },
  data() {
    return {
      exportExcel:exportExcel,
      brs: [{ name: "金币卡管理", to: { name: "rechargeCardManager" } }],
      date: [],
      queryMap: {
        pageNo: 1,
        pageSize: 10,
        status:""
      },
      tableData: [],
      total: null,
      //设置积分弹窗
      dialogVisible: false,
      formData:{
        integral:null,
        count:null
      },
      //批量设置参数
      lotSetMap: {
        rechargeCardList: [],
        operation:"all"
      },
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    lotSetChange() {
      // console.log(this.lotSetMap)
      if(this.lotSetMap.operation == "all"){
        return;
      }
      if (this.lotSetMap.rechargeCardList.length <= 0) {
        this.$message({ message: "请先勾选充值卡", type: "warning" ,center:true});
        return;
      }
      //批量设置
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("rechargeCardLotSet", this.lotSetMap)
        .then(res => {
          loadingInstance.close();
          this.getTableData();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //勾选多行
    handleSelectionChange(val) {
      this.lotSetMap.rechargeCardList = val;
    },
    getExport(){
       var params = "?status="+this.queryMap.status;
            window.open(exportExcel+"/taoyy/rechargeCard/export"+params+""); 
              //  window.open("http://localhost:8080/rechargeCard/export"+params+""); 
            this.getTableData;
    },
    setRechargeCard(){
      this.formData.integral = null;
      this.formData.count = null;
      this.dialogVisible = true;
    },
    toDeleted(row) {
      this.$confirm("是否确认删除该充值卡", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("rechargeCardSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({ message: "删除充值卡成功", type: "success",center:true });
          });
        })
        
        .catch(() => {});
    },
    toAddRechargeCard() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("rechargeCardSave",this.formData)
        .then(res => {
          this.dialogVisible = false;
          this.formData.integral = null;
          this.getTableData();
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("rechargeCardList", this.queryMap)
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>