<template>
  <tr style="border:1px solid black">
    <td>
      <input type="text" v-model.trim="product.productName" />
    </td>
    <td>
      <select class="browser-default" v-model="product.supplierId" id="supplier-name">
        <option v-for="s in suppliersProp" :key="s" :value="s.supplierId">{{ s.companyName }}</option>
      </select>
    </td>
    <td>{{ categoryProp.categoryName }}</td>
    <td>
      <input type="text" v-model.trim="product.quantityPerUnit" />
    </td>
    <td>
      <input type="number" v-model.number="product.unitPrice" />
    </td>
    <td>
      <input type="number" v-model.number="product.unitsInStock" />
    </td>
    <td>
      <input type="number" v-model.number="product.unitsOnOrder" />
    </td>
    <td>
      <input type="number" v-model.number="product.reorderLevel" />
    </td>
    <td>
      <label>
        <input type="checkbox" v-model="product.discontinued" />
        <span>{{product.discontinued}}</span>
      </label>
    </td>
    <td>{{TotalPrice}}</td>
    <td>
      <a @click="AddProduct()" class="btn">Dodaj</a>
      <a @click="Revert()" class="btn">Ponisti</a>
    </td>
  </tr>
</template>

<script>
import { postData } from "../dataService.js";

export default {
  name: "ProductSingle",
  props: {
    suppliersProp: Array,
    categoryProp: Object
  },
  components: {},
  data() {
    return {
      product: {}
    };
  },
  emits: ["ProductAddedEvent"],
  methods: {
    AddProduct() {
      this.product.categoryId = this.categoryProp.categoryId;
      this.product.unitPrice =
        this.product.unitPrice == "" ? 0 : Math.abs(this.product.unitPrice);
      this.product.unitsInStock =
        this.product.unitsInStock == ""
          ? 0
          : Math.abs(this.product.unitsInStock);
      this.product.unitsOnOrder =
        this.product.unitsOnOrder == ""
          ? 0
          : Math.abs(this.product.unitsOnOrder);
      this.product.reorderLevel =
        this.product.reorderLevel == ""
          ? 0
          : Math.abs(this.product.reorderLevel);

      if (this.product.supplierId == undefined) {
        alert("You have to choose supplier first!");
        return;
      }
      if (this.product.unitPrice == 0) {
        alert("Unit price can not be zero!");
        return;
      }
      if (!this.product.productName || !this.product.quantityPerUnit) {
        alert("Some field is empty, please fill it all!");
        return;
      }

      this.product.supplierName = this.suppliersProp.find(
        y => y.supplierId == this.product.supplierId
      ).companyName;
      this.product.totalPrice = (
        this.product.unitPrice * this.product.unitsInStock
      ).toFixed(2);

      postData("Products", this.product)
        .then(response => {
          this.product.productId = response.data.productId;
          alert("Successful data add!");
          this.$emit("ProductAddedEvent", this.product);
          this.Revert();
        })
        .catch(err => {
          console.log(err);
        });
    },
    Revert() {
      this.product = {};
    }
  },
  mounted() {
    this.product.unitPrice = 0;
    this.product.unitsInStock = 0;
    console.log(this.categoryProp);
  },
  computed: {
    TotalPrice() {
      console.log(typeof this.product.unitPrice);
      if (this.product.unitPrice != "" && this.product.unitsInStock != "") {
        return this.product.unitPrice * this.product.unitsInStock;
      }
      return 0;
    }
  }
};
</script>

<style>
</style>