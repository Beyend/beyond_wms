<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-table :data="tableData" border style="max-width:80%;">
                    <el-table-column prop="qq" label="微信二维码"  align="center">
                       <template slot-scope="scope">
                          <img v-if="scope.row.qq" :src="scope.row.qq" style="width:40px;height:40px;">
                      </template>
                    </el-table-column>
                    <el-table-column prop="wx" label="微信"  align="center"></el-table-column>
                    <el-table-column prop="tel" label="QQ"  align="center"></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope"> 
                            <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
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
      brs: [{ name: "客服管理", to: { name: "configManager" } }],
      tableData: [],
      total:null
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("configList")
        .then(res => {
          this.tableData = res;
          this.total = res.length;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    toEdit(row) {
      this.$to({ name: "configEdit", query: row });
    },
    handleSizeChange(val) {
      // this.queryMap.pageNo = val;
      // this.getTableData();
    },
    handleCurrentChange(val) {
      // this.queryMap.pageNo = val;
      // this.getTableData();
    }
  }
};
</script>

<style>
@import "../../style/teaend.less";
</style>