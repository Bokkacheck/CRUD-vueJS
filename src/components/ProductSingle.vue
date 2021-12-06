<template>
  <tr>
    <td v-if="!alt">{{ productProp.productName }}</td>
    <td v-if="alt">
      <input type="text" v-model.trim="product.productName" />
    </td>
    <td v-if="!alt">{{ productProp.supplierName}}</td>
    <td v-if="alt">
      <select class="browser-default" v-model="product.supplierId" id="supplier-name">
        <option v-for="s in suppliersProp" :key="s" :value="s.supplierId">{{ s.companyName }}</option>
      </select>
    </td>
    <td>{{ product.categoryName }}</td>
    <td v-if="!alt">{{ productProp.quantityPerUnit }}</td>
    <td v-if="alt">
      <input type="text" v-model.trim="product.quantityPerUnit" />
    </td>
    <td v-if="!alt">{{ productProp.unitPrice }}</td>
    <td v-if="alt">
      <input type="number" v-model.number="product.unitPrice" />
    </td>
    <td v-if="!alt">{{ productProp.unitsInStock }}</td>
    <td v-if="alt">
      <input type="number" v-model.number="product.unitsInStock" />
    </td>
    <td v-if="!alt">{{ productProp.unitsOnOrder }}</td>
    <td v-if="alt">
      <input type="number" v-model.number="product.unitsOnOrder" />
    </td>
    <td v-if="!alt">{{ productProp.reorderLevel }}</td>
    <td v-if="alt">
      <input type="number" v-model.number="product.reorderLevel" />
    </td>
    <td v-if="!alt">{{ productProp.discontinued }}</td>
    <td v-if="alt">
      <label>
        <input type="checkbox" v-model="product.discontinued" />
        <span>{{product.discontinued}}</span>
      </label>
    </td>
    <td>{{ product.totalPrice}}</td>
    <td>
      <ul>
        <li v-if="!alt">
          <a @click="alt=!alt" class="btn">Izmeni</a>
        </li>
        <li v-if="!alt">
          <a @click="DeleteProduct(productProp.productId)" class="btn">Obrisi</a>
        </li>
        <li v-if="alt">
          <a @click="SaveProduct()" class="btn">Sacuvaj</a>
        </li>
        <li v-if="alt">
          <a @click="Revert()" class="btn">Ponisti</a>
        </li>
        <li v-if="!alt">
          <a @click="OrderInfo()" class="btn">INFO</a>
        </li>
      </ul>
    </td>
  </tr>
</template>

<script>
// import { deleteDataForId, putData  } from '../dataService.js'
import { deleteDataForId, putDataForId } from "../dataService.js";

export default {
  name: "ProductSingle",
  props: {
    productProp: Object,
    suppliersProp: Array
  },
  components: {},
  data() {
    return {
      alt: false,
      info: false,
      product: {},
      supplier: {},
      orderDetails: []
    };
  },
  emits: ["ProductDeletedEvent", "ProductChangedEvent","ProductInfoEvent"],
  methods: {
    DeleteProduct(id) {
      deleteDataForId("Products", id)
        .then(response => {
          if (response.status == 204) {
            alert("Product is deleted");
            this.$emit("ProductDeletedEvent", this.product);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    SaveProduct() {
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

      let prod = {};
      prod.productId = this.product.productId;
      prod.productName = this.product.productName;
      prod.supplierId = this.product.supplierId;
      prod.categoryId = this.product.categoryId;
      prod.quantityPerUnit = this.product.quantityPerUnit;
      prod.unitPrice = this.product.unitPrice;
      prod.unitsInStock = this.product.unitsInStock;
      prod.unitsOnOrder = this.product.unitsOnOrder;
      prod.reorderLevel = this.product.reorderLevel;
      prod.discontinued = this.product.discontinued;
      prod.category = this.product.category;
      prod.supplier = this.product.supplier;
      prod.orderDetails = this.product.orderDetails;

      putDataForId("Products", prod.productId, prod)
        .then(response => {
          if (response.status == 204) {
            alert("Product is changed!");
            this.alt = false;
            this.$emit("ProductChangedEvent", this.product);
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.alt = !this.alt;
    },
    Revert() {
      this.alt = !this.alt;
      this.product = JSON.parse(JSON.stringify(this.productProp));
    },
    OrderInfo() {
      this.$emit("ProductInfoEvent", this.product);
    }
  },
  mounted() {
    this.product = JSON.parse(JSON.stringify(this.productProp));
  }
};
</script>

<style>
</style>