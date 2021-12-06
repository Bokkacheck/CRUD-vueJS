<template>
  <div>
    <div v-if="!ord">
      <div class="row">
        <div class="col s12 m3">
          <label for>Odaberite kategoriju:</label>
          <select class="browser-default" v-model="category" @change="ShowProducts()">
            <option v-for="c in categories" :key="c" :value="c">{{ c.categoryName }}</option>
          </select>
        </div>
      </div>
      <ProductsView
        :categoryProp="category"
        :suppliersProp="suppliers"
        :productsProp="productView"
        @ProductDeletedEvent="OnProductDeletedEvent($event)"
        @ProductChangedEvent="OnProductChangedEvent($event)"
        @ProductInfoEvent="OnProductInfoEvent($event)"
        @ProductAddedEvent="OnProductAddedEvent($event)"
      />
    </div>
    <div v-if="ord">
      <OrderView :productProp="product" @OrderCloseEvent="OnOrderCloseEvent()"/>
    </div>
  </div>
</template>

<script>
import ProductsView from "./components/ProductsView.vue";
import OrderView from "./components/OrderView.vue";
import { getData } from "./dataService.js";
import $ from "jquery";

export default {
  name: "App",
  data() {
    return {
      products: [],
      productView: [],
      suppliers: [],
      categories: [],
      category: undefined,
      ord: false,
      product: {}
    };
  },
  methods: {
    ShowProducts() {
      this.productView = this.products.filter(
        x => x.categoryId == this.category.categoryId
      );
      this.productView.forEach(p => {
        p.unitPrice = p.unitPrice ? p.unitPrice : 0;
        p.unitsInStock = p.unitsInStock ? p.unitsInStock : 0;
        p.categoryName = this.category.categoryName;
        let suppName = "";
        for (var supp of this.suppliers) {
          if (supp.supplierId == p.supplierId) {
            suppName = supp.companyName;
          }
        }
        p.supplierName = suppName;
        p.totalPrice = (p.unitPrice * p.unitsInStock).toFixed(2);
      });
    },
    OnProductDeletedEvent(obj) {
      this.products.splice(this.products.indexOf(obj), 1);
      this.ShowProducts();
    },
    OnProductChangedEvent(obj) {
      for (var i = 0; i < this.products.length; i++) {
        if (this.products[i].productId == obj.productId) {
          this.products[i] = obj;
        }
      }
      this.ShowProducts();
    },
    OnProductAddedEvent(obj) {
      this.products.push(JSON.parse(JSON.stringify(obj)));
      this.ShowProducts();
    },
    OnProductInfoEvent(obj) {
      this.product = obj;
      this.ord = true;
    },
    OnOrderCloseEvent(){
      this.ord = false;
      this.product = {};
    }
  },
  mounted() {
    getData("products")
      .then(response => {
        this.products = response.data;
      })
      .catch(err => {
        console.log(err);
      });
    getData("Categories")
      .then(response => {
        this.categories = response.data;
        $("select").formSelect();
      })
      .catch(err => {
        console.log(err);
      });
    getData("Suppliers")
      .then(response => (this.suppliers = response.data))
      .catch(err => {
        console.log(err);
      });
  },
  components: {
    ProductsView,
    OrderView
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 50px;
}

label {
  font-size: 1.2em !important;
  color: black !important;
}

select {
  border: 1px solid black !important;
}
</style>
