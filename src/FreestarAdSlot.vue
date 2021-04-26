<template>
  <div>
    <div
      :id="resolvedPlacementName"
      :class="classes"
    />
  </div>
</template>
<script>
export default {
  name: 'FreestarAdSlot',
  props: {
    placementName: {
      type: String,
      required: true,
    },
    targeting: {
      type: Object,
      default: () => ({}),
    },
    channel: {
      type: String,
      default: '',
    },
    classList: {
      type: Array,
      default: () => [],
    },
    adRefresh: {
      type: Number,
      default: 0,
    },
    adUnitPath: {
      type: String,
      default: '',
    },
    slotSize: {
      type: [Array, String],
      default: null,
    },
    sizeMapping: {
      type: Object,
      default: () => ({
        viewport: [],
        slot: [],
      }),
      validator: (val) => val.viewport && val.slot,
    },
  },
  data() {
    return {
      adslot: null,
      mappedName: '',
    };
  },
  computed: {
    classes() {
      return this.classList.join(' ');
    },
    resolvedPlacementName() {
      return this.mappedName || this.placementName;
    },
  },
  watch: {
    adRefresh() {
      this.$freestar.refreshAdSlot(this.placementName, this.targeting, this.adSlot);
      this.$emit('ad-refresh', this.placementName);
    },
  },
  async mounted() {
    await this.$freestar.init();
    this.mappedName = await this.$freestar.getMappedPlacementName(
      this.placementName,
      this.targeting,
    );
    await this.newAdSlots();
  },
  destroyed() {
    this.$freestar.deleteAdSlot(this.placementName, this.targeting, this.adSlot);
    this.$emit('delete-ad-slots', this.placementName);
  },
  methods: {
    async newAdSlots() {
      this.adSlot = await this.$freestar.newAdSlot(
        this.placementName,
        this.channel,
        this.targeting,
        this.adUnitPath,
        this.slotSize,
        this.sizeMapping,
      );
      this.$emit('new-ad-slots', this.placementName);
    },
  },
};
</script>
