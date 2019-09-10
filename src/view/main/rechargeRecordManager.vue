<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="开始时间">
                                <el-date-picker v-model="startTimeNull" @change="getSearchTime" placeholder="开始时间" style="width:180px;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="结束时间">
                                <el-date-picker v-model="endTimeNull" @change="getSearchTime" placeholder="结束时间" style="width:180px;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>    
                        <el-col :span="6">
                            <el-form-item label="操作类型">
                                <el-select filterable v-model="queryMap.type" placeholder="请选择操作类型" style="width:180px;">
                                    <el-option label="全部操作" value= 0></el-option>
                                    <el-option label="金币充值" value= 1></el-option>
                                    <!-- <el-option label="余额充值" value= 2></el-option> -->
                                    <el-option label="金币扣除" value= 3></el-option>
                                    <el-option label="金币返还" value= 5></el-option>
                                    <!-- <el-option label="余额扣除" value= 4></el-option> -->
                                </el-select>
                            </el-form-item>
                        </el-col>    
                        <el-col :span="6">
                            <el-form-item label="昵称">
                                <el-input v-model="queryMap.name4Like" placeholder="请输入昵称" style="width:180px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label=" ">
                                <el-button type="primary" @click="getTableData">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                 <el-button type="primary" @click="getExport">
                                    <i class="el-icon-download"></i>
                                    <span>导出列表</span>
                                </el-button>
                                <el-button type="primary" @click="lotSet">
                                    <span>批量删除</span>
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="width: 80%" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="remark" label="说明" width="500px;" align="center"></el-table-column>
                        <el-table-column prop="nickName" label="昵称" align="center"></el-table-column>
                        <el-table-column prop="type" label="操作类型" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type == 1" v-text="'金币充值'"></span>
                                <span v-if="scope.row.type == 2" v-text="'余额充值'"></span>
                                <span v-if="scope.row.type == 3" v-text="'金币扣除'"></span>
                                <span v-if="scope.row.type == 4" v-text="'余额扣除'"></span>
                                <span v-if="scope.row.type == 5" v-text="'金币返还'"></span>
                            </template>
                        </el-table-column>    
                        <!-- <el-table-column prop="payMoney" label="支付金额" align="center"></el-table-column>
                        <el-table-column prop="giveMoney" label="赠送金额" align="center"></el-table-column> -->
                        <!-- <el-table-column prop="operationUser" label="操作者" align="center"></el-table-column> -->
                        <el-table-column prop="createTime" label="支付日期" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime | dateFmt('yyyy-MM-dd')}}</span>
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
import { Loading } from 'element-ui';
import { exportExcel } from "../../../config/project/project.env";
export default {
    components: { UiPage, Loading },
    data() {
        return {
            exportExcel:exportExcel,
            brs: [{ name: "金币充值记录", to: { name: "rechargeBalanceList" } }],
            startTimeNull:null,
            endTimeNull:null,
            total:null,
            queryMap: {
                pageNo:1,
                pageSize:10,
                type:null,
                name4Like:null,
                startTime:null,
                endTime:null,
            },
            tableData: [],
            //批量设置参数
            lotSetMap: {
                ids: []
            },
        };
    },
    mounted(){
        this.getTableData();
    },
    methods:{
        lotSet(){
            if(this.lotSetMap.ids.length<=0){
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning',
                    center: true
                });
                return;
            }
             //批量设置
            let loadingInstance = Loading.service({ fullscreen: true });
            this.$post("rechargeLotSet", this.lotSetMap)
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
        this.lotSetMap.ids = val;
        },
        getTableData(){
            let loadingInstance = Loading.service({fullscreen: true});
            this.$post('rechargeRecordList',this.queryMap).then(res=>{
                this.tableData = res.list;
                this.total = res.total;
                loadingInstance.close();
            }).catch(()=>{loadingInstance.close();})
        },
        getExport(){
            var params = "?type="+this.queryMap.type+"&&name4Like="+this.queryMap.name4Like+"&&startTime="+this.queryMap.startTime+"&&endTime="+this.queryMap.endTime+"";
            window.open(exportExcel+"/taoyy/rechargeRecord/export"+params+""); 
            this.getTableData;
        },
        getSearchTime(){
            this.queryMap.startTime = this.$getYMD(this.startTimeNull);
            this.queryMap.endTime = this.$getYMD(this.endTimeNull);
            
        },
        handleSizeChange(val) {
            this.queryMap.pageNo = val;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.queryMap.pageNo = val;
            this.getTableData();
        },
    }
};
</script>

<style scoped>
@import '../../style/teaend.less';
.total{
    text-align:right;
    padding: 20px 400px;
}
</style>