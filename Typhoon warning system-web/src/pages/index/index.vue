<template>
  <map-component @map-loaded="mapLoaded"></map-component>
  <typhoon-list @check-typhoon="checkTyphoon"></typhoon-list>
  <chart-panel :tfbh="'202203'"></chart-panel>
  <ul class="typhoon-legend">
    <li v-for="item in colorDict" :key="item.label">
      <span class="color-block" :style="{backgroundColor: item.color}"></span>
      <label>{{ item.label }}</label>
    </li>
  </ul>
</template>

<script>
import MapComponent from '../../components/map/index.vue'
import TyphoonList from '../../components/typhoon/index.vue'
import ChartPanel from '../../components/chart/index.vue'
import TyphoonPlayer from '../../utils/typhoon'
import { colorDict } from '../../utils/const'

let map = null, typhoonPlayer = null
export default {
  name: 'HomePage',
  components: {
    MapComponent,
    TyphoonList,
    ChartPanel
  },
  data() {
    return {
      colorDict
    }
  },
  methods: {
    mapLoaded(_map) {
      map = _map
      typhoonPlayer = new TyphoonPlayer(map)
    },
    checkTyphoon(tfbh, isChecked) {
      isChecked ? typhoonPlayer.addTyphoon(tfbh) : typhoonPlayer.dropTyphoon(tfbh)
    }
  }
}
</script>

<style lang="scss" scoped>
.typhoon-legend {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  overflow: hidden;
  padding: 0.5rem;
  background-color: rgba(255,255,255, 0.8);
  border-radius: 0.3rem;
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  li {
    margin-right: 0.5rem;
    &:last-child {
      margin-right: 0;
    }
    display: inline-block;
    .color-block {
      --size: 0.8rem;
      width: var(--size);
      height: var(--size);
      margin-right: 0.3rem;
      display: inline-block;
    }
  }
}
</style>
