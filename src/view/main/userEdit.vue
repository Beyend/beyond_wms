<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" class="demo-form-inline" status-icon :rules="rules" ref="formData" label-position="right" label-width="100px">
                    <el-col>
                        <el-row :span="7">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="formData.username" clearable></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                                <el-form-item label="密码">
                                    <el-input v-model="formData.password" v-if="flag" placeholder="请牢记密码此操作不可逆" clearable></el-input>
                                </el-form-item>
                                <el-switch v-model="flag" style="margin-top:5px;" active-text="开" inactive-text="关"></el-switch>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="角色" required="">
                                  <div style="width:500px;">
                                      <el-checkbox-group v-model="roleCheck" @change="handleCheckedRoleChange">
                                        <el-checkbox :label="i.roleId" v-for="(i , k) in roleAll" :key="k" style="width:100px;">{{i.roleName}}</el-checkbox>
                                      </el-checkbox-group>
                                  </div> 
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20 marginleft150px">
                                    <el-button type="primary" @click="userModifyMethod">确认修改</el-button>
                                    <el-button type="primary" @click="$back()">关闭</el-button>
                                </div>
                            </el-form-item>
                        </el-row>
                    </el-col>
                </el-form>
            </el-row>
        </ui-container>
    </ui-layout>
</template>

<script>
import { Loading } from 'element-ui';
export default {
    components: { Loading },
    data() {
        return {
            brs: [{ name: "编辑用户", to: { name: "userEdit" } }],
            formData:{
                username:null,
                password:null,
                userRole:[]
                
            },
            roleArr:[],
            queryMap:{
                pageNo:1,
                pageSize:100
            },
            //已有角色
            roleUse:[],
            //所有角色
            roleAll:[],
            //勾选角色
            roleCheck:[],
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            },
            flag:false
        };
    },
    mounted(){
        this.getTebelData();
    },
    methods:{
        getTebelData(){
            if(null == this.$route.query){
                this.$message({
                    message: '请返回上一个页面',
                    type: 'warning',
                    center: true
                });
                    return;
            }
            let loadingInstance = Loading.service({ fullscreen: true });
            this.$get("userDetail", this.$route.query)
                .then(res => {
                    this.formData = res.user;
                    res.userRole.forEach(i =>{
                        this.roleUse.push(i.roleId)
                    })
                    this.getRoleList();
                    loadingInstance.close();
                })
                .catch(() => {
                    loadingInstance.close();
                });
        },
        handleCheckedRoleChange(value) {
           this.formData.userRole = this.roleCheck;

        },
        getRoleList() {
            this.$post("roleList",this.queryMap).then(res => {
                this.roleAll = res.rows;
                this.roleAll.forEach(i => {
                    this.roleUse.forEach(k =>{
                        if(i.roleId == k){
                            this.roleCheck.push(k)
                        }
                    })
                });
                this.formData.userRole = this.roleCheck;

            });
        },
        userModifyMethod(){
            if(this.formData.userRole.length == 0){
                this.$message({
                    message: '请至少选择一个角色',
                    type: 'warning',
                    center: true
                });
                    return;
            }
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    let loadingInstance = Loading.service({fullscreen: true});
                      this.$post('userSave',this.formData).then(res=>{
                          this.$message({type: 'success', message: '操作成功!',center:true});
                          this.$to({name:'userManager'})
                          loadingInstance.close();
                       }).catch(()=>{loadingInstance.close();})
                } else {
                    return false;
                }
            });  
        },
    },
};
</script>

<style lang="less">
@import '../../style/teaend.less';

.el-checkbox+.el-checkbox {
    margin-left: 0px;
}
</style>