<template>
  <div>
    <a @click="CloseOrders()" class="btn">Zatvori order info</a>
    <table class="table responsive-table">
      <thead>
        <tr>
          <th>Product name</th>
          <th>Unit price</th>
          <th>Quantity</th>
          <th>Discount</th>
          <th>Total price</th>
          <th>Customer</th>
          <th>Employee</th>
          <th>Shipper</th>
          <th>Order date</th>
          <th>Required date</th>
          <th>Shipped date</th>
          <th>Ship address</th>
          <th>Ship city</th>
          <th>Ship country</th>
          <th>Ship postal code</th>
          <th>Ship name</th>
          <th>Freight</th>
        </tr>
      </thead>
      <tbody>
        <OrderSingle
          v-for="o in orderDetails"
          :key="o.orderId"
          :orderDetail="o"
          :product="productProp"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
// import OrderRow from "./OrderRow.vue";
import { getData, getDataForId } from "../dataService.js";
import OrderSingle from "./OrderSingle.vue";
export default {
  name: "OrderView",
  components: {
    OrderSingle
  },
  data() {
    return {
      orderDetails: []
    };
  },
  props: {
    productProp: Object
  },
  emits: ["OrderCloseEvent"],
  methods: {
    CloseOrders() {
      this.$emit("OrderCloseEvent");
    },
    async GetOrderDetails(id) {
      await getData("OrderDetails")
        .then(response => {
          this.orderDetails = response.data;
          this.orderDetails = this.orderDetails.filter(x => x.productId == id);
        })
        .catch(err => {
          console.log(err);
        });

      await getData("Orders")
        .then(response => {
          let orders = response.data;
          this.orderDetails.forEach(x => {
            x.order = orders.find(y => y.orderId == x.orderId);
          });
        })
        .catch(err => {
          console.log(err);
        });

      await getData("Customers")
        .then(response => {
          let customers = response.data;
          this.orderDetails.forEach(x => {
            x.order.customer = customers.find(
              y => y.customerId == x.order.customerId
            );
          });
        })
        .catch(err => {
          console.log(err);
        });

      for (const x of this.orderDetails) {
        x.order.employee = await getDataForId("Employees", x.order.employeeId)
          .then(response => response.data)
          .catch(err => {
            console.log(err);
          });
      }

      await getData("Shippers")
        .then(response => {
          let shippers = response.data;
          this.orderDetails.forEach(x => {
            x.order.shipper = shippers.find(
              y => y.shipperId == x.order.shipVia
            );
            x.unitPrice = x.unitPrice ? x.unitPrice : 0;
            x.quantity = x.quantity ? x.quantity : 0;
            x.discount = x.discount ? x.discount : 0;
            x.totalPrice = (
              x.unitPrice * x.quantity -
              x.unitPrice * x.quantity * x.discount
            ).toFixed(2);
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    productProp: {
      handler(newValue) {
        this.GetOrderDetails(newValue.productId);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>