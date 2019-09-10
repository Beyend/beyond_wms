<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="queryMap" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <el-input v-model="queryMap.name4Like" placeholder="请输入商品名" clearable></el-input>
                            </el-form-item>
                            <el-form-item >
                                <el-select filterable v-model="queryMap.status"  style="width:100px;" @change="getTableData">
                                    <el-option label="全部商品" value="all"></el-option>
                                    <el-option label="上架" value="Y"></el-option>
                                    <el-option label="下架" value="N"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item >
                                <el-select filterable v-model="queryMap.operation"  style="width:100px;" @change="getTableData">
                                    <el-option label="全部商品" value="all"></el-option>
                                    <el-option label="热销商品" value="hotSell"></el-option>
                                    <el-option label="拼团商品" value="groupBuy"></el-option>
                                    <el-option label="秒杀商品" value="seckill"></el-option>
                                    <el-option label="抽奖商品" value="lottery"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item >
                               <el-select v-model="queryMap.goodsTypeId" placeholder="全部分类" style="width:100px;" @change="getTableData">
                                   <el-option label="全部分类" value=""></el-option>
                                    <el-option
                                    v-for="item in goodsTypeList"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item >
                                <el-select filterable v-model="lotSetMap.operation"  style="width:200px;" >
                                    <el-option label="批量设置" value="all" @click.native="lotSetChange"></el-option>
                                    <el-option label="批量上架" value="statusY" @click.native="lotSetChange"></el-option>
                                    <el-option label="批量下架" value="statusN" @click.native="lotSetChange"></el-option>
                                    <el-option label="批量删除" value="deletedY" @click.native="lotSetChange"></el-option>
                                    <!-- <el-option label="批量加入快速购买" value="fastBuyY" @click.native="lotSetChange"></el-option>
                                    <el-option label="批量关闭快速购买" value="fastBuyN" @click.native="lotSetChange"></el-option> -->
                                    <el-option label="批量设置积分" value="integralSet" @click.native="lotSetChange"></el-option>

                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" @click="getTableData">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button type="primary" @click="goodsInsert">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>新增</span>
                                </el-button>
                                <el-upload style="display: inline-block;margin-left:10px;"
                                    class="upload-demo"
                                    action="http://120.78.179.55:80/taoyy/excel/import"
                                    multiple
                                    name="file"
                                    :show-file-list="false"
                                    :on-success="onSuccess"
                                    :on-exceed="handleExceed">
                                    <el-button size="small" type="primary" >导入数据</el-button>
                                    <!-- action="http://localhost:8080/excel/import" -->
                                </el-upload>
                            </el-form-item>
                            
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="tableData" border style="max-width:80%;" @selection-change="handleSelectionChange">
                     <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="商品ID" width="80" align="center"></el-table-column>
                    <el-table-column prop="goodsType" label="商品类型" width="120" align="center"></el-table-column>
                    <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="" label="图片"  align="center">
                      <template slot-scope="scope">
                          <img v-if="scope.row.thumbnailSrc" :src="scope.row.thumbnailSrc" style="width:40px;height:40px;">
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="售价" width="80" align="center"></el-table-column>
                    <el-table-column prop="inventoryCount" label="库存" width="80" align="center"></el-table-column>
                    <!-- <el-table-column prop="status" label="状态" width="80" align="center">
                        <template slot-scope="scope">
                                <span v-text="scope.row.status == 'N' ? '下架' : '上架'" align="center"></span>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="fastBuy" label="快速购买" width="80" align="center">
                        <template slot-scope="scope">
                                <el-button type="text" size="small" @click="changeFastBuy(scope.row)" v-text="scope.row.fastBuy == 'N' ? '加入' : '关闭'"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="sales" label="已出售量" width="80" align="center"></el-table-column>
                    <el-table-column prop="sort" label="排序" width="80" align="center"></el-table-column>
                    <!-- <el-table-column prop="createTime" label="申请时间" width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | dateFmt("yyyy-MM-dd")}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope"> 
                            <el-button type="text" size="small" @click="toCheckInDetail(scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="toDeleted(scope.row)">删除</el-button>
                            <el-button type="text" size="small" @click="changeStatus(scope.row)" v-text="scope.row.status == 'N' ? '上架' : '下架'"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <ui-page :total="total" :pageSize="10" :pageNo="queryMap.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" ></ui-page>
            </el-row>

            
            <el-dialog
                                title="设置积分"
                                :visible.sync="dialogVisibleIntegral"
                                width="30%"
                                >
                                <!-- :before-close="handleClose" 弹窗 -->
                                <span>
                                    <el-form :inline="true" :model="lotSetMap" ref="lotSetMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <!-- :rules="rules" -->
                                        <el-col>
                                            <el-row>
                                              <el-form-item label="积分赠送">
                                                        <div >
                                                            <el-input placeholder="请输入内容" v-model.number="lotSetMap.integralGift" autocomplete="off" type="number" style="width:300px;">
                                                                <template slot="append">分</template>
                                                            </el-input>
                                                        </div>
                                                        <div style="font-size:10px;">
                                                                会员购物赠送的积分, 如果不填写或填写0，则默认为不赠送积分如果带%则为按成交价格的比例计算积分 <br/>
                                                        </div>
                                                </el-form-item>
                                                <el-form-item label="积分抵扣">
                                                    <div >
                                                        <el-input placeholder="请输入内容" v-model.number="lotSetMap.integralDeduction" autocomplete="off" type="number" style="width:300px;">
                                                            <template slot="append">元</template>
                                                        </el-input>
                                                    </div>
                                                    <div style="font-size:10px;">
                                                          如果设置0，则不支持积分抵扣 如果带%则为按成交价格的比例计算抵扣多少元
                                                    </div>
                                                </el-form-item>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="lotSetIntegral">确 定</el-button>
                                </span>
                            </el-dialog>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiPage from "../../components/UiPage.vue";
import { Loading } from "element-ui";
import { viewImg } from "../../../config/project/project.env"; //图片预览
import { uploadImg } from "../../../config/project/project.env"; //图片预览
export default {
  components: { UiPage, Loading },
  data() {
    return {
      uploadImg:uploadImg,
      brs: [{ name: "自营商品", to: { name: "goodsManager" } }],
      //查询参数
      queryMap: {
        pageNo: 1,
        pageSize: 10,
        name4Like: null,
        deleted: "N",
        status: "Y",
        goodsTypeId: "",
        operation:"all",
        integral:-1
      },
      //批量设置参数
      lotSetMap: {
        operation: "all",
        integralDeduction: null,
        integralGift: null,
        goodsList: []
      },
      //二级商品分类列表
      goodsTypeList: [],
      tableData: [],
      total: null,
      viewImg:viewImg,
      dialogVisibleIntegral: false
    };
  },
  created(){
    this.$route.query.pageNo ? this.queryMap.pageNo = parseInt(this.$route.query.pageNo) : 1
    this.getTableData();
    this.getGoodsTypeList();
  },
  mounted() {
    
  },
  methods: {
    //导入Excel
    importExcel(){

    },
    onSuccess(response) {
        this.getTableData();
        if(500 == response.code){
            this.$message({
            message: '不支持的文件类型!',
            type: 'warning',
            center: true
            });
        }else{
            this.$message({
            message: '导入数据成功!',
            type: 'success',
            center: true
            });
        }
    },
    handleExceed(files) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
    },
    //对话框中积分的值
    lotSetIntegral() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("lotSetGoods", this.lotSetMap)
        .then(res => {
          this.dialogVisibleIntegral = false;
          loadingInstance.close();
          this.getTableData();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //当批量设置为设置积分，弹出对话框   批量设置change事件
    lotSetChange() {
      if(this.lotSetMap.operation == "all"){
        return;
      }
      if (this.lotSetMap.goodsList.length <= 0) {
        this.$message({ message: "请先勾选商品", type: "warning" ,center:true});
        return;
      }
      if (this.lotSetMap.operation == "integralSet") {
        this.dialogVisibleIntegral = true;
        return;
      }
      //批量设置
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("lotSetGoods", this.lotSetMap)
        .then(res => {
          // this.tableData = res.list;
          // this.total = res.total;
          loadingInstance.close();
          this.getTableData();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //勾选多行
    handleSelectionChange(val) {
      this.lotSetMap.goodsList = val;
    },
    //勾选多行
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //跳转新增页
    goodsInsert() {
      this.$to({ name: "goodsInsert" });
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("goodsManage", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        }).catch(() => {
          loadingInstance.close();
        });
    },
    getGoodsTypeList() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("allGoodsTypes")
        .then(res => {
          this.goodsTypeList = res.list;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    toCheckInDetail(row) {
      this.$to({ name: "goodsDetail", query: {id:row.id,pageNo:this.queryMap.pageNo} });
    },
    changeStatus(row) {
      let visibtext = null;
      let status = null;
      if (row.status == "N") {
        visibtext = "上架";
        status = "Y";
      }
      if (row.status == "Y") {
        visibtext = "下架";
        status = "N";
      }
      this.$confirm("是否确认对该商品进行" + visibtext + "操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$post("goodsSave", { id: row.id, status: status }).then(res => {
            this.getTableData();
            this.$message({ message: "操作成功", 
                            type: "success",
                            center:true });
          });
        }).catch(() => {});
    },
    toDeleted(row) {
      this.$confirm("是否确认删除该商品", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("goodsSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({ message: "删除商品成功", type: "success",center:true });
          });
        })
        .catch(() => {});
    },
    changeFastBuy(row) {
      let visibtext = null;
      let fastBuy = null;
      if (row.fastBuy == "N") {
        visibtext = "加入";
        fastBuy = "Y";
      }
      if (row.fastBuy == "Y") {
        visibtext = "关闭";
        fastBuy = "N";
      }
      this.$confirm(
        "是否确认对该商品进行" + visibtext + "快速购买操作",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$post("goodsSave", { id: row.id, fastBuy: fastBuy }).then(
            res => {
              this.getTableData();
              this.$message({ message: "操作成功", type: "success" ,center:true});
            }
          );
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