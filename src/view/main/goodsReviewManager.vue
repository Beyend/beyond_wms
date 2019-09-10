<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="max-width:80%;">
                        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                        <el-table-column prop="nickName" label="用户" width="100" align="center"></el-table-column>
                        <el-table-column prop="goodsName" label="商品名称" width="350" align="center"></el-table-column>
                        <el-table-column prop="type" label="评分" width="80" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type == '1'" v-text="'好评'"></span>
                                <span v-if="scope.row.type == '2'" v-text="'中评'"></span>
                                <span v-if="scope.row.type == '3'" v-text="'差评'"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="content" label="详情" align="center"></el-table-column>
                        <el-table-column prop="reply" label="评价回复" align="center"></el-table-column>
                         <!-- <el-table-column prop="auditStatus" label="状态" width="100">
                            
                        </el-table-column> -->
                        <el-table-column label="操作"  fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button  @click="toEdit(scope.row)" type="text" size="small">修改</el-button>
                                <el-button  @click="toDeleted(scope.row)" type="text" size="small">删除</el-button>
                                <el-button  @click="toReply(scope.row)" type="text" size="small">回复</el-button>
                                <el-button  @click="toHide(scope.row)" type="text" v-text="scope.row.status == 'N' ? '显示' : '隐藏'" size="small">隐藏</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <el-dialog  title="回复" :visible.sync="dialogVisibleRemark" width="20%" :before-close="closeRemark">
                                <span>
                                    <el-form :inline="true" :model="remarkMap" ref="remarkMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <el-col>
                                            <el-row>
                                              <el-form-item label="添加回复信息">
                                                        <div >
                                                            <el-input v-model="remarkMap.reply" autocomplete="off" style="width:300px;"  type="textarea" :rows="3">
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
      brs: [{ name: "评价管理", to: { name: "goodsReviewList" } }],
      total: null,
      queryMap: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      dialogVisibleRemark: false,
      remarkMap: {
        id: null,
        reply: null
      }
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    closeRemark(done){
        this.remarkMap.id = null;
        this.remarkMap.reply = null;
        done();
    },
    //确定添加备注触发
    remarkConfirm() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("goodsReviewSave", this.remarkMap)
        .then(res => {
          this.dialogVisibleRemark = false;
          this.$message({
            showClose: true,
            message: "添加回复成功",
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
    //触发回复弹窗
    toReply(val) {
      this.remarkMap.id = val.id;
      this.dialogVisibleRemark = true;
    },
    //隐藏
    toHide(row) {
      let visibtext = null;
      let status = null;
      if (row.status == "N") {
        visibtext = "显示";
        status = "Y";
      }
      if (row.status == "Y") {
        visibtext = "隐藏";
        status = "N";
      }
      this.$confirm("是否确认将该评价" + visibtext + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("goodsReviewSave", { id: row.id, status: status }).then(
            res => {
              this.getTableData();
              this.$message({
                message: "操作成功",
                type: "success",
                center: true
              });
            }
          );
        })
        .catch(() => {});
    },
    //删除
    toDeleted(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("goodsReviewSave", { id: row.id, deleted: "Y" }).then(
            res => {
              this.getTableData();
              this.$message({
                message: "操作成功",
                type: "success",
                center: true
              });
            }
          );
        })
        .catch(() => {});
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("goodsReviewList", this.queryMap)
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
      this.$to({ name: "goodsReviewEdit", query: row });
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