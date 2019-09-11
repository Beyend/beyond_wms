<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" :rules="rules" label-position="right" label-width="100px">
                   
                    <el-col>
                        <el-row :span="7">
                            <el-form-item label="权限名称" prop="name">
                                <el-input v-model="formData.name" clearable></el-input>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20">
                                    <el-button type="info" plain @click="toMenuAdd">确认添加</el-button>
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
      brs: [{ name: "添加权限", to: { name: "menuInsert" } }],
      formData: {
        name:null,
      },
      rules: {
            name: [
                  { required: true, message: '请输入权限名', trigger: 'blur' },
                  { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ]
      }
    };
  },
  mounted() {
  },
  methods: {
    toMenuAdd() {
      this.$refs['formData'].validate(valid => {
          if (valid) {
            let loadingInstance = Loading.service({fullscreen: true});
            this.$post("menuSave", this.formData).then(res => {
            this.$message({ message: "添加权限成功", type: "success", center: true });
                loadingInstance.close();
                this.$to({ name: "menuManager" });}).catch(() => {
                    loadingInstance.close();
                  });
          } else {
              return false;
          }
      });    
    },
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