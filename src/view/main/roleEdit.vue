<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" :rules="rules" label-position="right" label-width="100px">
                   
                    <el-col>
                        <el-row :span="7">
                            <el-form-item label="角色名称" prop="roleName">
                                <el-input v-model="formData.roleName" clearable></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="权限" required="">
                                  <div style="width:500px;">
                                      <el-checkbox-group v-model="menuCheck" @change="handleCheckedMenuChange">
                                        <el-checkbox :label="i.menuId" v-for="(i , k) in menuAll" :key="k" style="width:100px;">{{i.name}}</el-checkbox>
                                      </el-checkbox-group>
                                  </div> 
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20">
                                    <el-button type="info" plain @click="toRoleEdit">确认修改</el-button>
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
import { Loading } from "element-ui";
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "编辑角色", to: { name: "roleEdit" } }],
      formData: {
        roleName:null,
        roleMenu:[]
      },
      //已有权限
      menuUse:[],
      //所有权限
      menuAll:[],
      //勾选权限
      menuCheck:[],
      queryMap:{
        pageNo : 1,
        pageSize : 100
      },
      rules: {
            roleName: [
                  { required: true, message: '请输入角色名', trigger: 'blur' },
                  { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ]
      }
    };
  },
  mounted() {
    this.getTebelData();
  },
  methods: {
    handleCheckedMenuChange(value) {
       this.formData.roleMenu = this.menuCheck;
    },
    toRoleEdit() {
      if(this.formData.roleMenu.length == 0){
                this.$message({
                    message: '请至少选择一个权限',
                    type: 'warning',
                    center: true
                });
                    return;
      }
      this.$refs['formData'].validate(valid => {
          if (valid) {
              let loadingInstance = Loading.service({ fullscreen: true });
              this.$post("roleSave", this.formData).then(res => {
              this.$message({ message: "编辑角色成功", type: "success", center: true });
                  loadingInstance.close();
              this.$to({ name: "roleManager" });
              }).catch(() => {
                  loadingInstance.close();
              });
          } else {
              return false;
          }
      });    
    },
    getTebelData(){
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$get("roleDetail", this.$route.query).then(res => {
          this.formData = res.role;
          this.menuUse = res.roleMenu;
          this.getMenuData();
          loadingInstance.close();
        }).catch(() => {
          loadingInstance.close();
        });
    },
    getMenuData(){
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("menuList",this.queryMap).then(res => {
          this.menuAll = res.rows;
          this.menuAll.forEach(i => {
            this.menuUse.forEach(k =>{
              if(i.menuId == k.menuId){
                this.menuCheck.push(k.menuId)
              }
            })
          });
          this.formData.roleMenu = this.menuCheck;
          loadingInstance.close();
        }).catch(() => {
          loadingInstance.close();
        });
    }
  }
};
</script>

<style lang="less">
@import "../../style/teaend.less";
.imgcontainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    text-align: center;
    > p {
      margin-bottom: 20px;
      position: relative;
      .imgUpload {
        width: 152px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 74px;
        opacity: 0;
        z-index: 10;
        cursor: pointer;
      }
    }
    > div {
      border: 1px solid #999;
      padding: 10px;
      width: 300px;
      height: 300px;
      > img {
        max-width: 280px;
        max-height: 280px;
      }
    }
  }
}
.el-checkbox+.el-checkbox {
    margin-left: 0px;
}
</style>