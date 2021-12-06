<template>
  <div class="panel">
    <div class="panel-heading">
      <div class="row">
        <div class="col-sm-2 col-xs-12">
          <h4 class="title">Products</h4>
        </div>
        <div class="row">
          <div class="col s4">
            <label>Supplier name:</label>
            <input type="text" v-model="supplierName" />
          </div>
          <div class="col s4">
            <label>Unit price:</label>
            <input type="number" v-model.number="unitPrice" />
          </div>
          <div class="col s4">
            <button type="button" class="btn" @click="Search()">Pretraga</button>
          </div>
        </div>
      </div>
    </div>
    <table class="striped responsive-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Supplier name</th>
          <th>Category name</th>
          <th>Quantity per unit</th>
          <th>Unit price</th>
          <th>Units in stock</th>
          <th>Units on order</th>
          <th>Reorder level</th>
          <th>Discontinued</th>
          <th>Total price</th>
        </tr>
      </thead>
      <tbody>
        <ProductAdding
          v-if="categoryProp  != undefined"
          :suppliersProp="suppliersProp"
          :categoryProp="categoryProp"
          @ProductAddedEvent="OnProductAddedEvent($event)"
        />
        <ProductSingle
          v-for="p in products"
          :key="p.productId"
          :productProp="p"
          :suppliersProp="suppliersProp"
          @ProductDeletedEvent="OnProductDeletedEvent($event)"
          @ProductChangedEvent="OnProductChangedEvent($event)"
          @ProductInfoEvent="OnProductInfoEvent($event)"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import ProductSingle from "./ProductSingle.vue";
import ProductAdding from "./ProductAdding.vue";
export default {
  name: "ProductsView",
  data() {
    return {
      supplierName: "",
      unitPrice: "",
      products: []
    };
  },
  emits: ["ProductDeletedEvent", "ProductChangedEvent", "ProductAddedEvent", "ProductInfoEvent"],
  props: {
    productsProp: Array,
    categoryProp: Object,
    suppliersProp: Array
  },
  watch: {
    productsProp: {
      handler(newVal) {
        this.products = newVal;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    Search() {
        this.products = this.productsProp;
        if(this.supplierName != ""){
            this.products = this.products.filter(x => x.supplierName.includes(this.supplierName))
        }
        if(this.unitPrice != ""){
            this.products = this.products.filter(x => x.unitPrice <= Math.abs(this.unitPrice))
        }
    },
    OnProductChangedEvent(obj) {
      this.$emit("ProductChangedEvent", obj);
    },
    OnProductDeletedEvent(obj) {
      this.$emit("ProductDeletedEvent", obj);
    },
    OnProductAddedEvent(obj) {
      this.$emit("ProductAddedEvent", obj);
    },
    OnProductInfoEvent(obj){
        this.$emit("ProductInfoEvent", obj);
    }
  },
  components: {
    ProductSingle,
    ProductAdding
  }
};
</script>