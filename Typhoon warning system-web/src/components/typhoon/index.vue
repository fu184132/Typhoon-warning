<template>
<div class="typhoon-list">
  <div class="title">
    台风列表
    <div class="year-select">
      <el-select v-model="selectYear" class="m-2" placeholder="Select" size="small">
        <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
  </div>
  <el-table
      class="list"
      :data="typhoonList"
      height="250"
      style="width: 100%"
      @select="selectChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="tfbh" label="台风编号" />
    <el-table-column prop="name" label="中文名称"  />
    <el-table-column prop="ename" label="英文名称" />
  </el-table>
</div>
</template>

<script>
let map;

export default {
  name: "TyphoonList",
  mounted() {
    this.getYearList()
  },
  data() {
    return {
      typhoonList: [],
      selectTyphoons: [],
      selected: { tfbh: -1 },
      yearList: [],
      selectYear: 0
    }
  },
  watch: {
    selectYear() {
      this.getTyphoonList()
    }
  },
  methods: {
    getYearList() {
      const url = 'https://lzugis.cn/v2/data/complex/years.json'
      fetch(url).then(res => res.json()).then(res => {
        this.yearList = res.map(r => {
          return {value: r.year, label: r.year + '年'}
        })
        this.selectYear =  this.yearList[0].value
      })
    },
    getTyphoonList() {
      const url = `https://lzugis.cn/v2/data/complex/${this.selectYear}.json`
      fetch(url).then(res => res.json()).then(res => {
        this.typhoonList = res
      })
    },
    selectChange(selection, row) {
      this.selectTyphoons = selection
      const isChecked = row.tfbh !== this.selected.tfbh
      this.selected = isChecked ? row : { tfbh: -1 }
      this.$emit('check-typhoon', row.tfbh, isChecked)
    }
  }
}
</script>

<style scoped lang="scss">
.typhoon-list {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 99;
  background-color: rgba(255, 255, 255, 1);
  width: 380px;
  font-size: 14px;
  .title {
    padding: 16px 12px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    .year-select {
      float: right;
      margin-top: -4px;
    }
  }
  .list {
    padding: 0;
  }
}
</style>