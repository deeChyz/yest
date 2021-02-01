export default {
  data () {
    return {
      isMobile: null
    }
  },
  mounted () {
    this.isMobile = (navigator && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth < 451 || screen && screen.width < 992);
  }
}
