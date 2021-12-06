<template>
    <tr>
        <td>{{ product.productName }}</td>
        <td>{{ orderDetail.unitPrice}}</td>
        <td>{{ orderDetail.quantity }}</td>
        <td>{{ orderDetail.discount*100 }}%</td>
        <!-- <td>{{ orderDetail.totalPrice }}</td>
        <td>{{ orderDetail.order.customer.companyName }}</td>
        <td>{{ orderDetail.order.employee.firstName+' '+orderDetail.order.employee.lastName }}</td>
        <td>{{ orderDetail.order.shipper.companyName }}</td> -->
        <!-- <td>{{ orderDetail.order.orderDate }}</td> -->
        <!-- <td>{{ orderDetail.order.requiredDate }}</td> -->
        <!-- <td>{{ orderDetail.order.shippedDate }}</td>
        <td>{{ orderDetail.order.shipAddress }}</td>
        <td>{{ orderDetail.order.shipCity }}</td>
        <td>{{ orderDetail.order.shipCountry }}</td>
        <td>{{ orderDetail.order.shipPostalCode }}</td>zzz
        <td>{{ orderDetail.order.shipName }}</td>
        <td>{{ orderDetail.order.freight }}</td> -->
    </tr>
</template>

<script>
export default {
    name:'OrderSingle',
    props:{
        orderDetail:Object,
        product:Object
    }
}
</script>