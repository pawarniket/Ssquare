
export const APIConstant = {
   
    Users: {
        userlogin: 'user/login',
        getuser:'Users/Get',
        inseruser:'Users/insert',
        updateuser:'users/update',
        deleteuser:'users/delete'
      },

      Products:{
        AddProducts:'Product/Insert',
        UpdateProducts:'Product/update',
        getProduct:'Product/get',
        deleteproduct:'Product/delete',
        Productstockupdate:'ProductStock/Update'
      },
      Productcategories:{
        AddProductscategory:'Productcategory/Insert',
        UpdateProductscategory:'Productcategory/update',
        getProductCategory:'Productcategory/get',
        deleteProductCategory:'Productcategory/delete'

      },
      sales:{
        insertsales:'Sales/insert',
        Updatesales:'Sales/Update',
        getsales:'Sales/Get',
        getsalesInvoice:'SalesInvoice/Get',
        deletesales:'Sales/Delete'

      },
      salesdetails:{
        insertsalesdetails:'SalesDetails/insert',
        Updatesalesdetails:'SalesDetails/Update',
        getsalesdetails:'SalesDetails/Get',
        deletesalesdetails:'SalesDetails/Delete'

      },
      Client:{
        insertclient:'Client/add',
        Updateclient:'Client/update',
        getClient:'Client/get',


      },
      Vehicle:{
        getvehicle:"Vehicle/get",
        insertvehicle:"vehicle/insert",
        Updatevehicle:"vehicle/update"
      },
      JobCard:{
        getJobCard:"jobcard/get",
        insertJobCard:"jobcard/insert",
        UpdateJobCard:"jobcard/update",
        DeleteJobCardProduct:"jobcardproduct/delete"
      },
      Dashboard:{
        getDashboard:"Dashboard/get"
      }
}