<template>
    <ui-layout :brs="brs">
        <ui-container>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="center" label-width="100px">
                    <el-col >
                        <el-row :span="12">
                            <el-form-item label="规则名称">
                                <el-input v-model="formData.name" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="计费方式">
                                <template>
                                    <el-radio v-model="formData.type" label="1">按重计费</el-radio>
                                    <el-radio v-model="formData.type" label="2">按件计算</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                         <el-row :span="20">
                                <el-form-item label="运费">
                                    <el-row>
                                        <div>
                                            <el-input placeholder="请输入首重/件"  v-model.number="formData.skg" style="width:220px;" type="number">
                                                <template slot="append">千克/件</template>
                                            </el-input>
                                            <el-input placeholder="请输入首重/件价格" v-model.number="formData.smoney" style="width:220px;" type="number">
                                                <template slot="append">元</template>
                                            </el-input>
                                            <el-input placeholder="请输入续重/件"  v-model.number="formData.xkg" style="width:220px;" type="number">
                                                <template slot="append">千克/件</template>
                                            </el-input>
                                            <el-input placeholder="请输入续重/件价格" v-model.number="formData.xmoney" style="width:220px;" type="number">
                                                <template slot="append">元</template>
                                            </el-input>
                                        </div>
                                    </el-row>
                                </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="运费规则">
                                <div class="edit_container" >
                                    <quill-editor v-model="formData.rule" ref="myQuillEditor" class="editer" :options="editorOption" @ready="onEditorReady($event)" style="width:1100px;height:400px;">
                                    </quill-editor>
                                </div>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item label=" ">
                                <div style="margin-left:50px;margin-top:100px;">
                                    <el-button type="primary" @click="toEdit">确认修改</el-button>
                                    <el-button type="primary" @click="$back()">关闭</el-button>
                                </div>
                            </el-form-item>
                        </el-row>
                    </el-col>
                </el-form>
           
        </ui-container>
    </ui-layout>
</template>

<script>
import { Loading } from "element-ui";
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: { Loading },
  data() {
    return {
      editorOption: {},
      brs: [{ name: "新增运费规则", to: { name: "expressRuleEdit" } }],
      formData: {},
    };
  },
  components: {
    //使用编辑器
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
     this.formData = this.$route.query;
  },
  methods: {
    //富文本
    onEditorReady(editor) {
    },
    toEdit() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("expressRuleSave", this.formData)
            .then(res => {
              this.$message({
                showClose: true,
                message: "编辑运费规则成功",
                type: "success",
                center:true
              });
              this.$to({ name: "expressRuleManager" });
              loadingInstance.close();
            })
            .catch(() => {
              loadingInstance.close();
            });
        } else {
          return false;
        }
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
.margintop20 {
  margin-top: 20px;
}
.tenzi {
  content: "";
  display: block;
  border: 0;
  background-color: #9b9b9b;
  border-radius: 5px;
  position: absolute;
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
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>