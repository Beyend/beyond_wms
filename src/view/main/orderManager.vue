                   
<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="5">
                        <el-form-item >
                                <el-select filterable v-model="queryMap.orderType"  style="margin-left:100px;width:200px;">
                                    <el-option label="全部订单" value="all" @click.native="getShZtOrder"></el-option>
                                    <!-- <el-option label="自提订单" value="zt"  @click.native="getShZtOrder"></el-option>
                                    <el-option label="售后订单" value="sh"  @click.native="getShZtOrder"></el-option> -->
                                    <el-option label="未付款" value="wfk"  @click.native="getShZtOrder"></el-option>
                                    <el-option label="待发货" value="dfh"  @click.native="getShZtOrder"></el-option>
                                    <el-option label="待收货" value="dsh"  @click.native="getShZtOrder"></el-option>
                                    <el-option label="已完成" value="ywc"  @click.native="getShZtOrder"></el-option>
                                    <el-option label="待处理" value="dcl"  @click.native="getShZtOrder"></el-option>
                                    <el-option label="已取消" value="yqx"  @click.native="getShZtOrder"></el-option>
                                    <el-option label="回收站" value="hsz"  @click.native="getShZtOrder"></el-option>
                                </el-select>
                            </el-form-item>
                         </el-col>   
                        <el-col :span="5">
                        <el-form-item >
                                <el-select filterable v-model="queryMap.operation"  style="margin-left:100px;width:200px;" >
                                    <el-option label="订单号" value="orderNumber"></el-option>
                                    <el-option label="用户名" value="memberName"></el-option>
                                    <!-- <el-option label="用户ID" value="memberId"></el-option> -->
                                    <el-option label="商品名称" value="goodsName"></el-option>
                                    <el-option label="收货人" value="contactName"></el-option>
                                    <el-option label="收货人电话" value="phone"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                            
                        <el-col :span="5">
                            <el-form-item style="margin-left:100px;">
                                <el-input v-model="queryMap.content" placeholder="请输入指定查询内容" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="开始日期">
                                <el-date-picker v-model="startTimeNull" @change="getSearchTime" placeholder="开始日期" style="width:87%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="结束日期">
                                <el-date-picker v-model="endTimeNull" @change="getSearchTime" placeholder="结束日期" style="width:87%;"></el-date-picker>
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
            <el-table :data="tableData" border style="width:80%;">
                <el-table-column prop="orderNumber" label="订单号" width="200" align="center"></el-table-column>
                <!-- <el-table-column prop="merchantName" label="所属商家" width="200" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.merchantName == '' || scope.row.merchantName == null">平台</span>
                        <span v-if="scope.row.merchantName != ''">{{scope.row.merchantName}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="goodsName" label="商品名称" width="300" :show-overflow-tooltip="true" align="center"></el-table-column>
                <el-table-column prop="name" label="规格图片"  align="center">
                      <template slot-scope="scope">
                          <img v-if="scope.row.imgSrc" :src="scope.row.imgSrc" style="width:30px;height:30px;">
                      </template>
                </el-table-column>
                <el-table-column prop="bak1" label="规格1" width="100" :show-overflow-tooltip="true" align="center"></el-table-column>
                <el-table-column prop="bak2" label="规格2" width="100" :show-overflow-tooltip="true" align="center"></el-table-column>
                <el-table-column prop="bak3" label="规格3" width="100" :show-overflow-tooltip="true" align="center"></el-table-column>
                <el-table-column prop="count" label="数量" width="100" align="center"></el-table-column>
                <el-table-column prop="memberName" label="用户名" width="150" align="center"></el-table-column>
                <el-table-column prop="integralCase" label="所需丫丫币" width="150" align="center"></el-table-column>
                <el-table-column prop="price" label="商品价格" width="100" align="center"></el-table-column>
                <el-table-column prop="payPrice" label="实际付款" width="100" align="center">
                  <template slot-scope="scope">
                                <!-- <span>{{scope.row.payPrice * scope.row.count + scope.row.freight}}</span> -->
                                <span>{{scope.row.payPrice + scope.row.freight}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="bindingPhone" label="绑定手机号" width="150" align="center"></el-table-column>
                <el-table-column prop="freight" label="邮费" width="100" align="center"></el-table-column>
                <el-table-column prop="integralCase" label="丫丫币" width="100" align="center"></el-table-column>
                <el-table-column prop="payType" label="支付方式" width="150" align="center"></el-table-column>
                <el-table-column prop="sendType" label="发货方式" width="100" align="center">
                    <template slot-scope="scope">
                                <span v-if="scope.row.sendType == 1">快递发送</span>
                                <span v-if="scope.row.sendType == 2">到店自提</span>
                            </template>
                </el-table-column>
                <el-table-column prop="contactName" label="收货人" width="100" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系电话" width="100" align="center"></el-table-column>
                <el-table-column prop="address" label="地址" width="300" :show-overflow-tooltip="true" align="center"></el-table-column>
               <el-table-column prop="createTime" label="下单时间" width="120" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | dateFmt('yyyy-MM-dd')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="操作" width="300" fixed="right" align="center">
                    <template slot-scope="scope">
                        <!-- 未发货 已支付 -->
                        <el-button v-if="scope.row.sendStatus == 'N' && scope.row.payStatus == 'Y'" @click="toSend(scope.row)" type="text" size="small">发货</el-button>
                        <!-- 未支付 待发货 未发货  -->
                        <el-button v-if="scope.row.payStatus == 'N' && scope.row.status == 1 || scope.row.status == 2 && scope.row.sendStatus == 'N'" @click="toCancel(scope.row)" type="text" size="small">取消</el-button>
                        <!-- 退单 已完成的订单 点击返还积分 -->
                        <el-button v-if="scope.row.status == 4" @click="toAfter(scope.row)" type="text" size="small">退单</el-button>
                        <el-button @click="toOrderDetail(scope.row)" type="text" size="small">详情</el-button>
                        <el-button @click="toRemark(scope.row)" type="text" size="small">添加备注</el-button>
                        <el-button v-if="scope.row.deleted == 'N'" @click="toDeleted(scope.row)" type="text" size="small">移入回收站</el-button>
                    </template>
                </el-table-column>
            </el-table>
                
                <el-dialog  title="备注" :visible.sync="dialogVisibleRemark" width="20%" :before-close="closeRemark">
                                <span>
                                    <el-form :inline="true" :model="remarkMap" ref="remarkMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <el-col>
                                            <el-row>
                                              <el-form-item label="添加备注信息">
                                                        <div >
                                                            <el-input v-model="remarkMap.merchantRemark" autocomplete="off" style="width:300px;"  type="textarea" :rows="3">
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

                 <el-dialog  title="物流信息" :visible.sync="dialogVisibleExpress" width="20%" :before-close="closeExpress">
                                <span>
                                    <el-form :inline="true" :model="expressMap" ref="expressMap"  class="demo-form-inline" label-position="left" label-width="150px">
                                        <el-col>
                                            <el-row>
                                              <el-form-item label="快递公司">
                                                        <el-select v-model="expressMap.expressName" filterable placeholder="请选择物流公司" style="width:200px;">
                                                            <el-option
                                                            v-for="item in expressOpetion"
                                                            :key="item.name"
                                                            :label="item.name"
                                                            :value="item.type">
                                                            </el-option>
                                                        </el-select>
                                                </el-form-item>
                                            </el-row>
                                            <el-row>
                                              <el-form-item label="快递单号">
                                                        <el-input v-model="expressMap.expressNumber" style="width:200px;"></el-input>
                                              </el-form-item>
                                              <el-form-item label="添加备注信息">
                                                            <el-input v-model="expressMap.merchantRemark" autocomplete="off" style="width:300px;"  type="textarea" :rows="3">
                                                            </el-input>
                                                </el-form-item>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="dialogVisibleExpress = false ">取 消</el-button>
                                    <el-button type="primary" @click="expressConfirm">确 定</el-button>
                                </span>
                </el-dialog>
            <el-row>
                <ui-page :total="total"  :pageSize="10" @size-change="handleSizeChange" @current-change="handleCurrentChange"></ui-page>
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
      brs: [{ name: "自营订单", to: { name: "orderList" } }],
      date: [],
      startTimeNull: null,
      endTimeNull: null,
      queryMap: {
        pageNo: 1,
        pageSize: 10,
        orderType: "all",
        operation: "orderNumber",
        content: null,
        startTime: null,
        endTime: null,
        isIntegral:-1
      },
      //备注参数
      remarkMap: {
        id: null,
        merchantRemark: null
      },
      expressMap: {
        id: null,
        expressName: null,
        expressNumber: null,
        merchantRemark: null,
        status:null
      },
      tableData: [],
      total: null,
      dialogVisibleRemark: false,
      dialogVisibleExpress: false,
      //物流集合
      expressOpetion:[],
    };
  },
  mounted() {
    //   this.$route.query.pageNo ? this.queryMap.pageNo = parseInt(this.$route.query.pageNo) : 1
    this.getTableData();
    this.getExpressList();
  },
  methods: {
    closeRemark(done){
        this.remarkMap.id = null;
        this.remarkMap.merchantRemark = null;
        done();
    },
      //备注操作对话框关闭
    closeExpress(done){
        this.expressMap.id = null;
        this.expressMap.expressName = null;
        this.expressMap.expressNumber = null;
        this.expressMap.merchantRemark = null;
        this.expressMap.status = null;
        done();
    },  
    getExpressList(){
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("expressList")
        .then(res => {
          this.expressOpetion = res;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //导出excel
    getExport(){
            var params = "?content="+this.queryMap.content+"&&orderType="+this.queryMap.orderType+
                "&&startTime="+this.queryMap.startTime+"&&endTime="+this.queryMap.endTime+"&&isIntegral="+this.queryMap.isIntegral+"";
            window.open(exportExcel+"/taoyy/orders/export"+params+""); 
            this.getTableData;
    },
    //点击发货触发
    toSend(val) {
      this.expressMap.id = val.id;
      this.dialogVisibleExpress = true;
    },
    //确定物流触发
    expressConfirm() {
        this.expressMap.status = 3;
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("orderSave", this.expressMap)
        .then(res => {
          this.dialogVisibleExpress = false;
          this.$message({
            showClose: true,
            message: "发货成功",
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
    //取消订单
    toCancel(row) {
      this.$confirm("是否确认取消该订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.$post("orderSave", { id: row.id, status: "7",applyStatus:"Y",memberId:row.memberId }).then(res => {
            this.getTableData();
            this.$message({
              message: "操作成功",
              type: "success",
              center: true
            });
          });
        }).catch(() => {});
    },
    // 售后
    toAfter(row){
        this.$confirm("是否确认退单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.$post("orderSave", { id: row.id, status: "5" }).then(res => {
            this.getTableData();
            this.$message({
              message: "操作成功",
              type: "success",
              center: true
            });
          });
        }).catch(() => {});
    },
    //移入回收站
    toDeleted(row) {
      this.$confirm("是否确认移入回收站?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("orderSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({
              message: "操作成功",
              type: "success",
              center: true
            });
          });
        })
        .catch(() => {});
    },
    //确定添加备注触发
    remarkConfirm() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("orderSave", this.remarkMap)
        .then(res => {
          this.dialogVisibleRemark = false;
          this.$message({
            showClose: true,
            message: "添加备注成功",
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
    toRemark(val) {
      this.remarkMap.id = val.id;
      this.dialogVisibleRemark = true;
    },
    //售后、自提订单查询
    getShZtOrder() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("orderList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },

    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("orderList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    dateChange() {
      if (this.date.length > 1) {
        this.queryMap.startTime = this.$getYMD(this.date[0]);
        this.queryMap.endTime = this.$getYMD(this.date[1]);
      }
    },
    //时间搜索
    getSearchTime() {
      this.queryMap.startTime = this.$getYMD(this.startTimeNull);
      this.queryMap.endTime = this.$getYMD(this.endTimeNull);
    },
    toOrderDetail(row) {
      this.$to({ name: "orderDetail", query: row });
    //   this.$to({ name: "orderDetail", query: {id:row.id,pageNo:this.queryMap.pageNo} });
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