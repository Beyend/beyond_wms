<template>
    <ui-layout :brs="brs">
        <ui-container style="height:50rem;overflow-y:scroll">
            <el-row>
                <el-form :inline="true" :model="formData" :rules="rules" ref="formData" class="demo-form-inline" label-position="center" label-width="100px">
                    <el-col>
                        <el-row :span="12">
                            <el-form-item label="父级分类">
                                <el-select filterable v-model="formData.parentId" placeholder="请选择" style="width:200px;">
                                    <el-option label="无" :value=0></el-option>
                                    <el-option v-for="item in goodsTypeList" :key="item.name" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="分类名称" prop="expectDate">
                                <el-input v-model="formData.name"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                           
                             <el-form-item label="排序"  prop="sort"
                            :rules="[
                                            { type: 'number', message: '排序必须为数字值'}
                                    ]">
                                <el-input v-model.number="formData.sort" autocomplete="off" type="number"></el-input>
                                <div style="font-size:10px;">
                                      排序值越小排序越靠前
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="分类图标">
                                        <el-upload
                                            class="avatar-uploader"
                                            action="http://120.78.179.55:80/taoyy/file/upload"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccessType"
                                            >
                                            <!-- :before-upload="beforeAvatarUpload" -->
                                            <img v-if="formData.icon" :src="formData.icon" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="分类大图">
                                <el-upload
                                            class="avatar-uploader"
                                            action="http://120.78.179.55:80/taoyy/file/upload"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccessImg"
                                            >
                                            <!-- :before-upload="beforeAvatarUpload" -->
                                            <img v-if="formData.imgSrc" :src="formData.imgSrc" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="分类广告">
                                <el-upload
                                            class="avatar-uploader"
                                            action="http://120.78.179.55:80/taoyy/file/upload"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccessAdv"
                                            >
                                            <!-- :before-upload="beforeAvatarUpload" -->
                                            <img v-if="formData.advertising" :src="formData.advertising" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                            </el-form-item>
                        </el-row>
                    <el-row>
                        <el-form-item label=" ">
                            <div class="margin20">
                                <el-button type="primary" @click="addGoodsType">确认修改</el-button>
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
import Citys from "../../utils/citys.js";
import { viewImg } from "../../../config/project/project.env"; //图片预览
import { Loading } from "element-ui";
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "编辑商品分类", to: { name: "goodsTypeEdit" } }],
      formData: {
        parentId: 0,
        name: null,
        sort: null,
        icon: null,
        imgSrc: null,
        advertising: null,
        pageNo:null
      },
      queryMap:{
          pageNo:1,
          pageSize:1000
      },
      rules: {
        name: [
          { required: true, message: "请输入分类名", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入排序", trigger: "blur" }
        ],
      },
      imageUrl: "",
      goodsTypeList: [],
      //预览框
      dialogVisible: false,
      viewImg:viewImg
    };
  },
  mounted() {
       this.pageNo = this.$route.query.pageNo
      this.getParentGoodsTypes();
      this.getGoodsTypeDetail();
  },
  methods: {
      getGoodsTypeDetail(){
            let loadingInstance = Loading.service({fullscreen: true});
            this.$get('goodsTypeDetail',this.$route.query.id).then((res)=>{
                this.formData = res;
                loadingInstance.close();
            }).catch(()=>{loadingInstance.close();})
        },
      //单图上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleExceed(files) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    //一级商品分类
    getParentGoodsTypes() {
      this.$post("parentGoodsTypes",this.queryMap).then(res => {
        this.goodsTypeList = res.list;
      });
    },
    //分类图标
    handlePictureCardPreviewType(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccessType(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.formData.icon = res.data;
    },
    //分类大图
    handlePictureCardPreviewImg(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccessImg(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.formData.imgSrc = res.data;
    },
    //广告
    handlePictureCardPreviewAdv(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccessAdv(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.formData.advertising = res.data;
    },

    addGoodsType() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("goodsTypeSave", this.formData)
            .then(res => {
              this.$message({ message: "编辑商品分类成功", type: "success" ,center:true});
              loadingInstance.close();
              this.$to({ name: "goodsTypeManager",query:{pageNo:this.pageNo} });
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