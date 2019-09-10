/**
 * Created by kuo zi on 2016/10/14.
 */
const restUrl = {
    /** 用户*/
    userLogin:{
        name:"用户登录",
        url:"sysUser/login"
    },
    userAuth:{
        name:"判断登录",
        url:"sysUser/auth"
    },
    userSave:{
        name:"新增修改",
        url:"sysUser/save"
    },
    userList:{
        name:"用户列表",
        url:"sysUser/list"
    },
    userLogout:{
        name:"用户退出",
        url:"sysUser/logout"
    },
    userDetail:{
        name:"用户详情",
        url:"sysUser/get"
    },
    validateCode:{
        name:"验证码",
        url:"sysUser/code"
    },
    /** 权限*/
    menuList:{
        name:"权限列表",
        url:"sysMenu/list"
    },
    menuSave:{
        name:"新增修改",
        url:"sysMenu/save"
    },
    menuDetail:{
        name:"详情",
        url:"sysMenu/get"
    },
    /** 角色*/
    roleList:{
        name:"角色列表",
        url:"sysRole/list"
    },
    roleSave:{
        name:"新增修改",
        url:"sysRole/save"
    },
    roleDetail:{
        name:"详情",
        url:"sysRole/get"
    }

   

};

export default restUrl;
