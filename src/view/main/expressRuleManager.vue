<template>
    <ui-layout :brs="brs">
        <ui-container>
          <el-row>
                <el-form :inline="true" :model="queryMap" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" @click="expressRuleInsert">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>新增</span>
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="tableData" border style="max-width:80%;">
                    <el-table-column prop="name" label="规则名称"  align="center"></el-table-column>
                    <el-table-column prop="type" label="计费方式"  align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.type == '1'">按重量计算</span>
                        <span v-if="scope.row.type == '2'">按件计算</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="isDefault" label="是否默认"  align="center">
                        <template slot-scope="scope">
                                <el-button type="text" size="small" @click="changeDefault(scope.row)" v-text="scope.row.isDefault == 'N' ? '默认' : '不默认'"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope"> 
                            <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="toDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
      brs: [{ name: "运费设置", to: { name: "expressRuleManager" } }],
      tableData: [],
      total:null,
      queryMap:{
        pageNo:1,
        pageSize:10,
      }
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    expressRuleInsert(){
      this.$to({ name: "expressRuleInsert"});
    },
    changeDefault(row) {
      let visibtext = null;
      let isDefault = null;
      if (row.isDefault == "N") {
        visibtext = "默认";
        isDefault = "Y";
      }
      if (row.isDefault == "Y") {
        visibtext = "不默认";
        isDefault = "N";
      }
      this.$confirm(
        "是否确认将该规则设为" + visibtext + "运费规则",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$post("expressRuleSave", { id: row.id, isDefault: isDefault }).then(
            res => {
              this.getTableData();
              this.$message({ message: "操作成功", type: "success" ,center:true});
            }
          );
        })
        .catch(() => {});
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("expressRuleList",this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    toEdit(row) {
      this.$to({ name: "expressRuleEdit", query: row });
    },
    toDelete(row){
      if(row.isDefault == 'Y'){
        this.$message({ message: "请取消默认运费规则", type: "warning",center:true });
        return;
      }
       this.$confirm("是否确认删除该运费规则", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.$post("expressRuleSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({ message: "删除运费规则成功", type: "success",center:true });
          });
        })
        .catch(() => {});
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