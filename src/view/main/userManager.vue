<template>
    <ui-layout :brs="brs">
        <ui-container v-if="flag">
            <el-row>
                <el-form :inline="true" :model="queryMap" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col >
                            <el-form-item label="用户名">
                                <el-input v-model="queryMap.keyword" placeholder="请输入用户名" clearable></el-input>
                            </el-form-item>
                           <el-form-item >
                               <el-select v-model="queryMap.roleId" placeholder="角色" style="width:200px;" clearable @change="getTableData">
                                   <el-option label="全部角色" value=""></el-option>
                                    <el-option
                                        v-for="item in roleArr"
                                        :key="item.roleName"
                                        :label="item.roleName"
                                        :value="item.roleId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label=" " style="margin-left:-100px;">
                                <el-button  @click="getTableData" type="info" plain>
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                            </el-form-item>
                            <el-form-item label=" " style="margin-left:-100px;">
                                <el-button  @click="toAddUser" type="info" plain>
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加</span>
                                </el-button>
                            </el-form-item>
                            <el-upload style="display: inline-block;"
                                    class="upload-demo"
                                    action="http://localhost:8080/beyond/sysUser/import"
                                    multiple
                                    name="file"
                                    :show-file-list="false"
                                    :on-success="onSuccess"
                                    :on-exceed="handleExceed"
                                    :before-upload="beforeAvatarUpload"
                                    >
                                <el-button type="info" plain ><i class="el-icon-upload2"></i>
                                        <span>导入数据</span>
                                </el-button>
                            </el-upload>
                            <el-button type="info" plain @click="getExport" style="margin-left:10px;"><i class="el-icon-download"></i>
                                        <span>导出列表</span>
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="width: 80%">
                        <el-table-column type="index" label="序号" align="center" ></el-table-column>
                        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                        <el-table-column prop="state" label="状态" align="center">
                            <template slot-scope="scope">
                                 <span v-if="scope.row.state == 'NORMAL'" v-text="'正常'"></span>
                                 <span v-if="scope.row.state == 'PROHIBIT'" v-text="'禁用'"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="info" plain @click="modifyAccount(scope.row)" >编辑</el-button>
                                <el-button type="info" plain @click="changeStatus(scope.row)" v-text="scope.row.state == 'NORMAL' ? '禁用' : '恢复'"></el-button>
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
    exportExcel : exportExcel,
    components: { UiPage, Loading },
    data() {
        return {
            brs: [{ name: "用户管理", to: { name: "userManager" } }],
            total:null,
            queryMap: {
                pageNo:1,
                pageSize:10,
                roleId:null,
                keyword:null,
            },
            roleMap:{
                pageNo:1,
                pageSize:100,
            },
            tableData: [],
            roleArr:[],
            flag:true,
            excelMap:{
                roleId:"",
                keyword:""
            }
        };
    },
    mounted(){
        this.getTableData();
        this.getRoleList();
    },
    methods:{
         beforeAvatarUpload(file) {
            const isXLS = file.type === 'application/vnd.ms-excel';
            const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            if (!isXLS && !isXLSX) {
                this.$message({
                    message : '上传文件只能是xls或xlsx格式!',
                    type : 'warning',
                    center : true  
                })
                return isXLS && isXLSX;
            }
        },
        //导出excel
        getExport(){
                var params = "?keyword="+this.excelMap.keyword+"&&roleId="+this.excelMap.roleId+"";
                window.open(exportExcel+"sysUser/export"+params+""); 
                this.getTableData;
        },
        handleExceed(files) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
        },
        onSuccess(response) {
            if(500 == response.meta.code){
                this.$message({
                message: "导入数据失败,请检查是否有重复数据!",
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
            this.getTableData();
        },
        toAddUser(){
            this.$to({name:'userInsert'})
        },
        getRoleList() {
        this.$post("roleList",this.roleMap).then(res => {
            this.roleArr = res.rows;
        });
        },
        changeStatus(row){
            let visibtext = null;
            let state = null;
            if (row.state == "NORMAL") {
                visibtext = "禁用";
                state = "PROHIBIT";
            }
            if (row.state == "PROHIBIT") {
                visibtext = "恢复";
                state = "NORMAL";
            }
            this.$confirm("是否确认对用户品进行" + visibtext + "操作", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$post("userSave", { userId: row.userId, state: state }).then(res => {
                    this.getTableData();
                    this.$message({ message: "操作成功", 
                                    type: "success",
                                    center:true });
                });
                }).catch(() => {});
        },
        modifyAccount(row){
            this.$to({name:'userEdit',query:row.userId})
        },
        getTableData(){
            let loadingInstance = Loading.service({fullscreen: true});
            this.$post('userList',this.queryMap).then(res=>{
                this.tableData = res.rows;
                this.total = res.total;
                loadingInstance.close();
            }).catch(()=>{
                this.flag = false
                loadingInstance.close();
            })
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

<style>
@import '../../style/teaend.less';

</style>