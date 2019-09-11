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
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="formData.password" placeholder="请牢记密码此操作不可逆" clearable></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="角色">
                                  <div style="width:550px;">
                                      <el-checkbox-group v-model="roleCheck" @change="handleCheckedRoleChange">
                                        <el-checkbox :label="i.roleId" v-for="(i , k) in roleAll" :key="k" style="width:100px;">{{i.roleName}}</el-checkbox>
                                      </el-checkbox-group>
                                  </div> 
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="缩略图" >
                                <el-upload
                                    class="avatar-uploader"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    action="http://localhost:8080/beyond/file/upload"
                                    >
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20 marginleft150px">
                                    <el-button type="info" plain @click="userModifyMethod">确认添加</el-button>
                                    <el-button type="info" plain @click="$back()">关闭</el-button>
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
            brs: [{ name: "添加用户", to: { name: "userInsert"}}],
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
            //勾选权限
            roleCheck:[],
            //所有权限
            roleAll:[],
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            },
            imageUrl: null
        };
    },
    mounted(){
        this.getRoleList();
    },
    methods:{
        handleAvatarSuccess(res, file) {
            this.imageUrl = res.data;
        },
        getRoleList(){
            let loadingInstance = Loading.service({ fullscreen: true });
            this.$post("roleList",this.queryMap)
                .then(res => {
                this.roleAll = res.rows;
                loadingInstance.close();
                })
                .catch(() => {
                loadingInstance.close();
                });
        },
        handleCheckedRoleChange(value) {
            this.formData.userRole = this.roleCheck;
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader-icons {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatars {
  width: 100px;
  height: 100px;
  display: block;
}
</style>