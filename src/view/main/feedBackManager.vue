<template>
    <ui-layout :brs="brs">
        <ui-container>
          <el-row>
                <el-form :inline="true" :model="queryMap" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item>
                                <el-input v-model="queryMap.content" placeholder="请输入反馈内容" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" @click="getTableData">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                            </el-form-item>
                            
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="tableData" border style="max-width:80%;">
                    <el-table-column prop="name" label="反馈用户"  align="center"></el-table-column>
                    <el-table-column prop="phone" label="联系方式"  align="center"></el-table-column>
                    <el-table-column prop="content" label="反馈内容"  align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="createTime" label="反馈时间" width="120" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | dateFmt('yyyy-MM-dd')}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column prop="replyContent" label="回复内容"  align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope"> 
                            <el-button type="text" size="small" @click="toEdit(scope.row)" v-if="scope.row.replyContent == '' ||  scope.row.replyContent == null">回复</el-button>
                            <el-button type="text" size="small" @click="toDeleted(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <ui-page :total="total" :pageSize="10" @size-change="handleSizeChange" @current-change="handleCurrentChange"></ui-page>
            </el-row>
            
            <el-dialog  title="回复内容" :visible.sync="dialogVisibleRemark" width="20%" :before-close="closeRemark">
                                <span>
                                    <el-form :inline="true" :model="feedbackMap" ref="feedbackMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <el-col>
                                            <el-row>
                                              <el-form-item label="">
                                                        <div >
                                                            <el-input v-model="feedbackMap.replyContent" autocomplete="off" style="width:300px;"  type="textarea" :rows="5">
                                                            </el-input>
                                                        </div>
                                                </el-form-item>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="remarkConfirm">确 定</el-button>
                                </span>
                </el-dialog>

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
      brs: [{ name: "反馈管理", to: { name: "feedBackManager" } }],
      //查询参数
      queryMap: {
        pageNo: 1,
        pageSize: 10,
        content:null
      },
      tableData: [],
      total: null,
      feedbackMap:{
        id:null,
        replyContent:null,
      },
      dialogVisibleRemark: false,
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    closeRemark(done){
        this.feedbackMap.id = null;
        this.feedbackMap.replyContent = null;
        done();
    },
    //确定添加回复触发
    remarkConfirm() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("feedBackSave", this.feedbackMap)
        .then(res => {
          this.dialogVisibleRemark = false;
          this.$message({
            showClose: true,
            message: "回复成功",
            type: "success",
            center: true
          });
          loadingInstance.close();
          this.getTableData();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //添加备注触发
    toEdit(val) {
      this.feedbackMap.id = val.id;
      this.dialogVisibleRemark = true;
    },
    toDeleted(row) {
      this.$confirm("是否确认删除该反馈内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("feedBackSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({ message: "删除反馈内容成功", type: "success",center:true });
          });
        })
        .catch(() => {});
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("feedBackList", this.queryMap)
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