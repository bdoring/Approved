<!-- PDF VIEWER -->
<!-- <object data="https://s3-us-west-2.amazonaws.com/approved-capstone/1-003" type="application/pdf" width="600px" height="830px">
</object> -->


<template>
    <div class="container">
      <h1>Hello, {{ user.first_name | proper }}</h1>
        <div class="home-dashboard">
          <div>
            <h2>Invoices Pending Approval</h2>
            <div class="vendor-pending" v-for="invoice in invoices" v-if="invoice.status==='pending'">
              <div >
                <p>Vendor: {{invoice.name}}</p>
                <p>Amount: ${{ invoice.amount }}</p>
                <p value="hi">Due date: {{invoice.invoice_due_date | formatDate }} - <b>{{dueDate(invoice.invoice_due_date)}}</b></p>
                <p>Payment method: {{ invoice.payment_method}}</p>
                <p>Pending approval from: {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
                <hr />
              </div>
            </div>
          </div>
          <div>
            <h2>Invoices Scheduled For Payment</h2>
            <div class="vendor-scheduled" v-for="invoice in invoices" v-if="invoice.status==='scheduled'">
              <p>Vendor: {{invoice.name}}</p>
              <p>Amount: ${{ invoice.amount }}</p>
              <p>Due date: {{invoice.invoice_due_date | formatDate }} - <b>{{dueDate(invoice.invoice_due_date)}}</b></p>
              <p>Payment method: {{ invoice.payment_method}}</p>
              <p>Approved by: {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
              <hr />
            </div>
          </div>
          <div>
            <h2>Invoices Ready To Be Scheduled</h2>
            <div class="vendor-ready" v-for="invoice in invoices" v-if="invoice.status==='approved'">
              <p>Vendor: {{invoice.name}}</p>
              <p>Amount: ${{ invoice.amount }}</p>
              <p>Due date: {{invoice.invoice_due_date | formatDate }} - <b>{{dueDate(invoice.invoice_due_date)}}</b></p>
              <p>Payment method: {{ invoice.payment_method}}</p>
              <p>Approved by: {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
              <hr />
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      invoices: []
    }
  },
  methods: {
    dueDate(invoiceDueDate) {
      let milisecondsInADay = 1000 * 60 * 60 * 24;
      let today = new Date().toISOString().slice(0,10);
      let dueDate = (new Date(today) - new Date(invoiceDueDate)) / milisecondsInADay;
      return dueDate < 0 ? `${dueDate * (-1)} days until due` : `${dueDate} days past due`;
    }
  },
  created(){
    this.axios.get('/invoices')
      .then(response => {
        console.log('response from invoices/home:', response.data);
        this.invoices = response.data.map(invoice => {
          let formattedDate = new Date(invoice.invoice_due_date).toISOString().slice(0,10);
          invoice.invoice_due_date = formattedDate;
          console.log("formattedDate:", formattedDate);
          return invoice;
        });
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.home-dashboard{
  margin-top: 10px;
  display: flex;
  /* background-color: lightblue; */
  text-align: center;

}

.home-dashboard > div{
  flex: 1;
  border: 1px dotted grey;
  margin: 5px;
  border-radius: 5px;
  padding: 10px;
}

.vendor-pending, .vendor-scheduled, .vendor-ready{
  text-align: left;
  margin-top: 20px;
  font-size: 15px;
}

p{
  font-size: 17px;
}


</style>
