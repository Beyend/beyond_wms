<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
              <el-form :inline="true" :model="queryMap" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item>
                                <el-input v-model="queryMap.rank" placeholder="请输入会员等级" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item>
                                <el-button type="primary" @click="getTableData">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button type="primary" @click="toMemberTypeInsert">
                                    <i class="el-icon-setting"></i>
                                    <span>会员设置</span>
                                </el-button>
                            </el-form-item>
                            
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="max-width:80%;">
                        <el-table-column prop="rank" label="等级" width="50" align="center"></el-table-column>
                        <el-table-column prop="name" label="会员名称" align="center"></el-table-column>
                        <el-table-column prop="discount" label="折扣" align="center"></el-table-column>
                        <el-table-column prop="payMoney" label="购买所需金额" width="150" align="center"></el-table-column>
                        <el-table-column prop="upCondition" label="升级条件" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态"  align="center">
                           <template slot-scope="scope">
                                <el-button type="text" size="small" @click="changeStatus(scope.row)" v-text="scope.row.status == 'N' ? '启用' : '禁用'"></el-button>
                        </template>
                        </el-table-column>
                        <el-table-column label="操作"  fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button  @click="toEdit(scope.row)" type="text" size="small">修改</el-button>
                                <el-button  @click="toDeleted(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <el-row>
                <ui-page :total="total" :pageSize="10" @size-change="handleSizeChange" @current-change="handleCurrentChange"></ui-page>
            </el-row>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiPage from "../../components/UiPage.vue";
import { Loading } from "element-ui";
export default {
  components: { UiPage, Loading },
  data() {
    return {
      brs: [{ name: "会员等级管理", to: { name: "memberTypeList" } }],
      total: null,
      queryMap: {
        pageNo: 1,
        pageSize: 10,
        rank:null,
        deleted:"N",
      },
      tableData: []
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    //隐藏
    changeStatus(row){
      let visibtext = null;
      let status = null;
      if (row.status == "N") {
        visibtext = "启用";
        status = "Y";
      }
      if (row.status == "Y") {
        visibtext = "禁用";
        status = "N";
      }
      this.$confirm("是否确认" + visibtext + "该会员等级", "提示",{confirmButtonText: "确定",cancelButtonText: "取消",type: "warning",
        } ).then(() => {
          this.$post("memberTypeSave", { id: row.id, status: status }).then(
            res => {
              this.getTableData();
              this.$message({ message: "操作成功", type: "success" ,center:true});
            } );}).catch(() => {});
        
    },
    //删除
    toDeleted(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.$post("memberTypeSave", { id: row.id, deleted: "Y" }).then(
            res => {
              this.getTableData();
              this.$message({
                message: "删除会员分类成功",
                type: "success",
                center: true
              }); } ); }).catch(() => {});
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("memberTypePageList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    toMemberTypeInsert(){
      this.$to({ name: "memberTypeInsert"});
    },
    toEdit(row) {
      this.$to({ name: "memberTypeEdit", query: row });
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