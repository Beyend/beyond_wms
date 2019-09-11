<template>
    <header>
        <div>
            <slot name="left"></slot>
        </div>
        <div>
            <slot name="right"></slot>
        </div>
    </header>
</template>

<script>
export default {};
</script>

<style lang="less">
@import "./../style/variables.less";
header {
    height: 60px;
    background: linear-gradient(left,#909399, #bfc4ff); 
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
}
</style>