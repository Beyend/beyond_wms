<template>
    <ui-layout :brs="brs">
        <ui-container style="height:50rem;overflow-y:scroll">
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="center" label-width="100px">
                    <el-col >
                        <el-row :span="12">
                            <el-form-item label="商品分类">
                                 <el-select filterable v-model="formData.goodsTypeId" placeholder="请选择" @change="goodsTypeChange" size="18">
                                    <el-option v-for="i in goodsTypeList" :key="i.name" :label="i.name" :value="i.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="商品名称">
                                <el-input v-model="formData.name" size="50"></el-input>
                            </el-form-item>
                        </el-row>
                  
                        <el-row :span="12">
                            <el-form-item label="单位">
                                <el-input v-model="formData.unit"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="商品排序"  prop="sort"
                            :rules="[
                                            { type: 'number', message: '排序必须为数字值'}
                                    ]">
                                <el-input v-model.number="formData.sort" autocomplete="off" type="number"></el-input>
                                <div style="font-size:10px;color:#636c72;">
                                      排序按升序排列
                                </div>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="已出售量" prop="sales"
                                :rules="[
                                            { type: 'number', message: '已出售量必须为数字值'}
                                        ]">
                                <el-input v-model.number="formData.sales" autocomplete="off" type="number"></el-input>
                                <div style="font-size:10px;color:#636c72;">
                                      前端展示的销量=实际销量+已出售量
                                </div>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="限购数量" prop="purchaseLimitation"
                            :rules="[
                                            { type: 'number', message: '限购数量必须为数字值'}
                                    ]">
                                <el-input v-model.number="formData.purchaseLimitation" autocomplete="off" type="number"></el-input>
                                <div style="font-size:10px;color:#636c72;">
                                      设置为0则不限购，大于0则等于对应的限购数量
                                </div>
                            </el-form-item>
                        </el-row>
                   
                        <el-row :span="12">
                            <el-form-item label="重量" prop="weight"
                            :rules="[
                                            { type: 'number', message: '限购数量必须为数字值'}
                                    ]">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.weight" autocomplete="off" type="number">
                                        <template slot="append">克</template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="缩略图" prop="thumbnailSrc">
                                <el-upload
                                    class="avatar-uploader"
                                    action="http://120.78.179.55:80/taoyy/file/upload"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    >
                                    <!-- :before-upload="beforeAvatarUpload" -->
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                    <!-- action="http://120.78.179.55:80/taoyy/file/upload" -->
                            </el-form-item>
                        </el-row>
                  
                        <el-row :span="12">
                            <el-form-item label="商品视频">
                                     <span v-if="formData.videoSrc">
                                      <video :src="formData.videoSrc" controls style="max-width:400px;max-height:400px;"></video>
                                    </span>
                                        <el-upload style="display: inline-block;"
                                            class="upload-demo"
                                            action="http://120.78.179.55:80/taoyy/file/upload"
                                            name="file"
                                            :show-file-list="true"
                                            :limit="1"
                                            :on-success="onSuccess"
                                            :on-exceed="handleExceed"
                                            accept="video/*"
                                            >
                                            <!-- :headers="{'x-token':token}" -->
                                            <el-button size="small" type="primary" >上传视频</el-button>
                                        </el-upload>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="商品图片">
                                <div style="width: 800px">
                                    <el-upload
                                    action="http://120.78.179.55:80/taoyy/file/upload"
                                    list-type="picture-card"
                                    :on-preview="handlePictureCardPreview"
                                    :on-remove="handleRemove"
                                    :on-success='successImg'
                                    multiple>
                                    <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                                </div>
                            </el-form-item>
                        </el-row>
                   
                        <el-row :span="12">
                            <el-form-item label="售价" prop="price"
                            :rules="[
                                            { type: 'number', message: '售价必须为数字值'}
                                    ]">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.price" autocomplete="off" type="number">
                                        <template slot="append">元</template>
                                    </el-input>
                                </div>
                                <div style="font-size:10px;color:red">
                                            如果选择拼团或秒杀，即为拼团或秒杀价格
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="成本价" prop="costPrice"
                            :rules="[
                                            { type: 'number', message: '成本价必须为数字值'}
                                    ]">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.costPrice" autocomplete="off" type="number">
                                        <template slot="append">元</template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-row>
                   
                        <el-row :span="12">
                            <el-form-item label="原价" prop="originalPrice"
                            :rules="[
                                            { type: 'number', message: '原价必须为数字值'}
                                    ]">
                                 <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.originalPrice" autocomplete="off" type="number">
                                        <template slot="append">元</template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="服务内容">
                                <el-input v-model="formData.serviceContent"></el-input>
                                <div style="font-size:10px;color:#636c72;">
                                      例子：正品保障,极速发货,7天退换货。多个请使用英文逗号,分隔
                                </div>
                            </el-form-item>
                            
                        </el-row>
                        
                        <el-row :span="12">
                            <el-form-item label="运费设置">
                                        <el-select filterable v-model="formData.freightSetting" placeholder="请选择" @change="expressRuleChange" size="18">
                                            <el-option v-for="i in expressRuleList" :key="i.name" :label="i.name" :value="i.id"></el-option>
                                        </el-select>
                            </el-form-item>
                        </el-row>
                        <!-- <el-row :span="12">
                            <el-form-item label="单品满件包邮" prop="fullPiece"
                            :rules="[
                                            { type: 'number', message: '单品满件包邮必须为数字值'}
                                    ]">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.fullPiece" autocomplete="off" type="number">
                                        <template slot="append">件</template>
                                    </el-input>
                                </div>
                                 <div style="font-size:10px;color:#636c72;">
                                      如果设置0或空，则不支持满件包邮
                                 </div>
                            </el-form-item>
                        </el-row>
                   
                        <el-row :span="12">
                            <el-form-item label="单品满额包邮" prop="fullAmount"
                            :rules="[
                                            { type: 'number', message: '单品满额包邮必须为数字值'}
                                    ]">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.fullAmount" autocomplete="off" type="number">
                                        <template slot="append">元</template>
                                    </el-input>
                                </div>
                                <div style="font-size:10px;color:#636c72;">
                                      如果设置0或空，则不支持满额包邮
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="是否开启面议">
                                <template>
                                    <el-radio v-model="formData.discussPersonally" label="Y">开启</el-radio>
                                    <el-radio v-model="formData.discussPersonally" label="N">关闭</el-radio>
                                </template>
                                <div style="font-size:10px;color:red">
                                      如果开启面议，则商品无法在线支付
                                </div>
                            </el-form-item>
                        </el-row> -->
                    
                        <el-row :span="12">
                            <el-form-item label="商品库存" prop="inventoryCount"
                            :rules="[
                                            { type: 'number', message: '商品库存必须为数字值'}
                                    ]">
                                <div >
                                    <el-input placeholder="请输入内容" :disabled="canNotEidt" v-model.number="formData.inventoryCount" autocomplete="off" type="number">
                                        <template slot="append">件</template>
                                    </el-input>
                                </div>
                                <div style="font-size:10px;color:red">
                                            如果选择拼团或秒杀，即为拼团或秒杀库存
                                </div>
                                
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="商品货号">
                                <el-input v-model="formData.freightNumber"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="20">
                                <el-form-item label="规格" >
                                    <el-row v-for="(a,i) in formData.specifications" :key="i" style="margin-bottom:10px;">
                                        <el-input placeholder="请输入规格" v-model="formData.specifications[i]['bak1']" style="width:170px;" >
                                            <template slot="append">规格</template>
                                        </el-input>
                                         <el-input placeholder="请输入规格" v-model="formData.specifications[i]['bak2']" style="width:170px;" >
                                            <template slot="append">规格</template>
                                        </el-input>
                                         <el-input placeholder="请输入规格" v-model="formData.specifications[i]['bak3']" style="width:170px;" >
                                            <template slot="append">规格</template>
                                        </el-input>
                                        <el-input placeholder="请输入库存"  v-model.number="formData.specifications[i]['inventoryCount']" style="width:170px;" type="number">
                                            <template slot="append">件</template>
                                        </el-input>
                                        <el-input placeholder="请输入价格" v-model="formData.specifications[i]['price']" style="width:170px;" type="number">
                                            <template slot="append">元</template>
                                        </el-input>
                                        <el-input placeholder="请输入丫丫币" v-model="formData.specifications[i]['integralDeduction']" style="width:210px;" type="number">
                                            <template slot="append">丫丫币</template>
                                        </el-input>
                                        <el-input placeholder="请输入原价" v-model="formData.specifications[i]['freightNumber']" style="width:180px;">
                                            <template slot="append">元</template>
                                        </el-input>
                                        <el-upload
                                            class="avatar-uploader"
                                            action="http://120.78.179.55:80/taoyy/file/upload"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccessSpecificationImg"
                                            @click.native="setIndex(i)"
                                            >
                                            <!-- :before-upload="beforeAvatarUpload" -->
                                            <img v-if="formData.specifications[i]['imgSrc']" :src="formData.specifications[i]['imgSrc']" class="avatars">
                                            <i v-else class="el-icon-plus avatar-uploader-icons"></i>
                                        </el-upload>
                                        
                                    </el-row>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="addInvestmentIncome()" style="width:60px;">添加</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="deleteArr()" style="width:60px;" >删除</el-button>
                                </el-form-item>
                        </el-row>
                    
                        <el-row :span="12">
                            <el-form-item label="金币赠送">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.integralGift" autocomplete="off" type="number">
                                        <template slot="append">分</template>
                                    </el-input>
                                </div>
                                <div style="font-size:10px;color:#636c72;">
                                        会员购物赠送的金币, 如果不填写或填写0，则默认为不赠送金币 <br/>
                                        <!-- ，如果带%则为按成交价格的比例计算积分 -->
                                        如: 购买2件，设置10 金币, 不管成交价格是多少， 则购买后获得20金币 <br/>
                                        <!-- 如: 购买2件，设置10%积分, 成交价格2 * 200= 400， 则购买后获得 40 积分（400*10%）<br/> -->
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="金币抵扣">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.integralDeduction" autocomplete="off" type="number">
                                        <template slot="append">元</template>
                                    </el-input>
                                </div>
                                <div style="font-size:10px;color:red;">
                                       如果设置0，则不支持金币抵扣；如果参加抽奖，则为抽奖消耗金币
                                       <!-- 如果带%则为按成交价格的比例计算抵扣多少元 -->
                                </div>
                            </el-form-item>
                        </el-row>
                   
                        <!-- <el-row :span="12">
                            <el-form-item label="卡券发放">
                                
                                <div >
                                    <el-select filterable v-model="formData.cardId" placeholder="请选择卡券" @change="cardChange" size="18">
                                      <el-option v-for="i in cardList" :key="i.name" :label="i.name" :value="i.id"></el-option>
                                     </el-select>
                                </div>
                                <div style="font-size:10px;color:red">
                                      卡券会在用户付款后自动发放给用户
                                </div>
                            </el-form-item>
                        </el-row> -->
                        <!-- <el-row :span="12">
                            <el-form-item label="快速购买">
                                <template>
                                    <el-radio v-model="formData.fastBuy" label="Y">添加</el-radio>
                                    <el-radio v-model="formData.fastBuy" label="N">不添加</el-radio>
                                </template>
                            </el-form-item>
                        </el-row> -->
                        <el-row :span="12">
                            <el-form-item label="热销">
                                <template>
                                    <el-radio v-model="formData.hotSell" label="Y">添加</el-radio>
                                    <el-radio v-model="formData.hotSell" label="N">不添加</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12" v-if="formData.seckill == 'N'">
                            <el-form-item label="拼团">
                                <template>
                                    <el-radio v-model="formData.groupBuy" label="Y">添加</el-radio>
                                    <el-radio v-model="formData.groupBuy" label="N">不添加</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12" v-if="formData.groupBuy == 'N'">
                            <el-form-item label="秒杀">
                                <template>
                                    <el-radio v-model="formData.seckill" label="Y">添加</el-radio>
                                    <el-radio v-model="formData.seckill" label="N">不添加</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12" v-if="formData.seckill == 'Y' || formData.groupBuy == 'Y'">
                             <el-form-item label="开始时间">
                                     <el-date-picker v-model="startTimeNull" @change="getSearchTime" placeholder="开始日期" style="width:130px;">
                                         <template slot="prepend">开始日期</template>
                                     </el-date-picker>
                                     <el-date-picker v-model="endTimeNull" @change="getSearchTime" placeholder="结束日期" style="width:130px;">
                                         <template slot="prepend">结束日期</template>
                                     </el-date-picker>
                             </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="抽奖">
                                <template>
                                    <el-radio v-model="formData.lottery" label="Y">添加</el-radio>
                                    <el-radio v-model="formData.lottery" label="N">不添加</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="1688链接">
                                <el-input v-model="formData.aliUrl" size="50"></el-input>
                            </el-form-item>
                        </el-row>
                        <!-- <el-row :span="12">
                            <el-form-item label="图文详情"> wangeditor
                                <div class="edit_container" >
                                    <quill-editor v-model="formData.detail" ref="myQuillEditor" class="editer" :options="editorOption" @ready="onEditorReady($event)" style="height:300px;">
                                    </quill-editor>
                                </div>
                            </el-form-item> -->
                            <!-- <el-form-item label="图文详情"> UE
                                <template>
                                    <div class="components-container">
                                        <div class="info"></div>
                                            <div class="editor-container">
                                            <UE :defaultMsg=defaultMsg :config=config ref="UE"></UE>
                                        </div>
                                    </div>
                                </template>
                            </el-form-item> -->
                        <!-- </el-row> -->
                        <el-row :span="12">
                            <el-form-item label="商品详情图">
                                <div style="width: 800px">
                                    <el-upload
                                        action="http://120.78.179.55:80/taoyy/file/upload"
                                        list-type="picture-card"
                                        :on-preview="handleDetailPreview"
                                        :on-remove="handleDetailRemove"
                                        :on-success='successDetailImg'
                                        multiple>
                                        <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <el-dialog :visible.sync="dialogDetailVisible">
                                        <img width="100%" :src="dialogDetailUrl" alt="">
                                    </el-dialog>
                                    <!-- <el-upload
                                        class="upload-demo"
                                        drag
                                        action="http://120.78.179.55:80/taoyy/file/upload"
                                        multiple>
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload> -->
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label=" ">
                                <div style="margin-left:50px;margin-top:100px;">
                                    <el-button type="primary" @click="goodsAddMethod">确认添加</el-button>
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
import UE from '../../components/UEditor.vue';
import { viewImg } from "../../../config/project/project.env"; //图片预览
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: { Loading,UE },
  data() {
    return {
        defaultMsg: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
        startTimeNull: null,
        endTimeNull: null,
        editorOption: {},
        brs: [{ name: "添加商品", to: { name: "goodsInsert" } }],
        canNotEidt: false,
        formData: {
            goodsTypeId: null,
            name: null,
            unit: "件",
            sort: null,
            sales: 0,
            purchaseLimitation: 0,
            weight: 0,
            thumbnailSrc: null,
            videoSrc: null,
            goodsImgs: [],
            specifications: [],
            price: 0,
            costPrice: 0,
            originalPrice: 0,
            serviceContent: null,
            freightSetting: null,
            fullPiece: 0,
            fullAmount: 0,
            discussPersonally: "N",
            fastBuy: "N",
            hotSell: "N",
            status: "Y",
            inventoryCount: null,
            freightNumber: null,
            integralGift: 0,
            integralDeduction: 0,
            cardId: null,
            groupBuy: "N",
            seckill:"N",
            lottery:"N",
            startTime: null,
            endTime: null,
            numberOfPeople: null,
            groupBuyStatus: null,
            aliUrl: null,
            goodsDetailImgs:[]
            },
        goodsTypeList: [],
        expressRuleList:[],
        cardList: [],
        rules: {},
        goodsImgLis: [],
        dialogImageUrl: "",
        dialogVisible: false,
        goodsImgDetail: [],
        dialogDetailUrl: "",
        dialogDetailVisible: false,
        imageUrl: "",
        //图片预览地址
        viewImg:viewImg,
        sub:null
    };
   
  },
  components: {
    //使用编辑器
    quillEditor,
    UE
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.getGoodsTypeList();
    this.cardNoPageList();
    this.getExpressList();
  },
  methods: {
    getUEContent() {
        let content = this.$refs.ue.getUEContent();
        this.$notify({
          title: '获取成功，可在控制台查看！',
          message: content,
          type: 'success'
        });
      },  
    //时间搜索
    getSearchTime() {
      this.formData.startTime = this.$getYMD(this.startTimeNull);
      this.formData.endTime = this.$getYMD(this.endTimeNull);
    },  
    deleteArr(){
        this.formData.specifications.splice(this.formData.specifications.length-1,1)
        if(this.formData.specifications.length == 0){
            this.canNotEidt = false;
            return;
        }
    } ,
      //富文本
    onEditorReady(editor) {
    },
    //规格
    addInvestmentIncome(blur) {
        this.canNotEidt = true
        this.formData.inventoryCount = 0
      if (this.formData.specifications.length == 0) {
        this.formData.specifications.push({
          bak1: "",
          bak2:"",
          bak3:"",
          inventoryCount: "",
          price: "",
          freightNumber: "",
          imgSrc:""
        });
      } else if (!blur) {
        if (blur) return;
        this.formData.specifications.push({
          bak1: "",
          bak2:"",
          bak3:"",
          inventoryCount: "",
          price: "",
          freightNumber: "",
          imgSrc:""
        });
      } else if (this.formData.specifications.length > 0) {
        this.formData.specifications[0] = this.formData.specifications;
      }
    },
    //多图上传
    handleRemove(file, fileList) {
      let list = [];
      if (fileList.length > 0) {
        fileList.forEach(i => {
          list.push(i.response);
        });
        this.goodsImgLis = list;
      } else {
        this.goodsImgLis = [];
      }
    },
    //商品详情多图上传
    handleDetailRemove(file, fileList) {
      let list = [];
      if (fileList.length > 0) {
        fileList.forEach(i => {
          list.push(i.response);
        });
        this.goodsImgDetail = list;
      } else {
        this.goodsImgDetail = [];
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //商品详情多图
    handleDetailPreview(file) {
      this.dialogDetailUrl = file.url;
      this.dialogDetailVisible = true;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data;
      this.formData.thumbnailSrc = res.data;
    },
    setIndex (i) {
        this.sub = i;
    },
    handleAvatarSuccessSpecificationImg(res,file,fileList) {
      this.formData.specifications[this.sub].imgSrc=res.data
    },
    successImg(response, file, fileList) {
      this.goodsImgLis.push(response.data);
      
    },
    successDetailImg(response, file, fileList) {
      this.goodsImgDetail.push(response.data);
    },
    //单图上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleExceed(files) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    // 视频上传成功
    onSuccess(response) {
      this.formData.videoSrc = response.data;
      if (500 == response.code) {
        this.$message({
          message: "不支持的文件类型!",
          type: "warning",
          center: true
        });
      } else {
        this.$message({
          message: "上传视频成功!",
          type: "success",
          center: true
        });
      }
    },
    //商品分类列表
    getGoodsTypeList() {
      this.$post("allGoodsTypes").then(res => {
        this.goodsTypeList = res.list;
      });
    },
    //运费列表
    getExpressList(){
        this.$post("expressRuleNoPage").then(res => {
        this.expressRuleList = res;
      });
    },
    cardNoPageList() {
      this.$post("cardNoPageList").then(res => {
        this.cardList = res.list;
      });
    },
    //商品类型
    goodsTypeChange(val) {
      this.formData.goodsTypeId = val;
    },
    //运费规则
    expressRuleChange(val) {
      this.formData.freightSetting = val;
    },
    //卡券
    cardChange(val) {
      this.formData.cardId = val;
    },
    goodsAddMethod() {
      this.formData.goodsImgs = this.goodsImgLis;
      this.formData.goodsDetailImgs = this.goodsImgDetail;
      var count = 0;
      if(this.formData.specifications.length>0){
          for(var i = 0;i<this.formData.specifications.length;i++){
              count= count + this.formData.specifications[i].inventoryCount;
          }
      }
      this.formData.inventoryCount = count;
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("goodsSave", this.formData)
            .then(res => {
              this.$message({
                showClose: true,
                message: "新增商品成功",
                type: "success"
              });
              this.$to({ name: "goodsManager" });
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
 .info{
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }
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